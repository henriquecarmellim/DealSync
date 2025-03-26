import express, { type Request, type Response, type Router } from 'express';
import pool from '../../databases/MySQL/pool';
import chalk from 'chalk';

const router: Router = express.Router();

const isValidCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false; // Impede CNPJs com todos os números iguais

  const calcularDigito = (cnpjParcial: string, pesos: number[]): number => {
    let soma = 0;
    for (let i = 0; i < pesos.length; i++) {
      soma += parseInt(cnpjParcial[i]) * pesos[i];
    }
    let resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const digito1 = calcularDigito(cnpj.slice(0, 12), pesos1);
  const digito2 = calcularDigito(cnpj.slice(0, 12) + digito1, pesos2);

  return cnpj.endsWith(`${digito1}${digito2}`);
};

router.post('/', async (req: Request, res: Response) => {
  const { name, cnpj } = req.body;

  if (!name) {
    res.status(400).json({ successfully: false, message: 'O campo nome é obrigatório' });
    return;
  }

  if (name.length > 255) {
    res.status(400).json({ successfully: false, message: 'O nome da empresa deve ter no máximo 255 caracteres' });
    return;
  }

  if (cnpj && !isValidCNPJ(cnpj)) {
    res.status(400).json({ successfully: false, message: 'O CNPJ informado é inválido' });
    return;
  }

  const createCompanySql = `INSERT INTO company (name, cnpj) VALUES (?, ?);`;

  let connection;
  try {
    connection = await pool.getConnection();
    const [result]: any = await connection.query(createCompanySql, [name, cnpj]);
    const [slugResult]: any = await connection.query('SELECT slug FROM company WHERE id = ?', [result.insertId]);

    connection.release();

    console.log(
      chalk.bgGreen.black(' INFO '),
      chalk.white('Empresa'),
      chalk.cyan(name),
      chalk.white('criada com sucesso! ID:'),
      chalk.yellow(`${result.insertId}`),
      chalk.white(', Slug:'),
      chalk.yellow(`${slugResult[0].slug}`)
    );

    res.status(201).json({
      successfully: true,
      message: `A empresa ${name} foi criada com sucesso!`,
      info: {
        name,
        companyId: result.insertId,
        slug: slugResult[0].slug,
        cnpj
      }
    });
    return;
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ successfully: false, message: 'Já existe uma empresa com esse nome.' });
      return;
    }

    if (error.code === 'ER_BAD_DB_ERROR' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Erro de conexão com o banco de dados:', error);
      res.status(500).json({ successfully: false, message: 'Erro de conexão com o banco de dados.' });
      return;
    }

    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ successfully: false, message: 'Erro ao criar empresa. Tente novamente mais tarde.' });
    return;
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.get('/', async (req: Request, res: Response) => {
  const selectCompaniesSql = `SELECT id, name, cnpj, slug FROM company;`;

  try {
    const [companies]: any = await pool.query(selectCompaniesSql);

    res.status(200).json({
      successfully: true,
      companies
    });
    return;
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ successfully: false, message: 'Erro ao buscar empresas.' });
    return;
  }
});

router.get('/:companySlug', async (req: Request, res: Response) => {
  const { companySlug } = req.params;
  const selectCompanySql = `SELECT id, name, cnpj, slug FROM company WHERE slug = ?;`;

  try {
    const [company]: any = await pool.query(selectCompanySql, [companySlug]);

    if (company.length === 0) {
      res.status(404).json({ successfully: false, message: 'Empresa não encontrada.' });
      return;
    }

    res.status(200).json({
      successfully: true,
      company: company[0]
    });
    return;
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ successfully: false, message: 'Erro ao buscar empresa.' });
    return;
  }
});

router.delete('/:companySlug', async (req: Request, res: Response) => {
  const { companySlug } = req.params;
  const deleteCompanySql = `DELETE FROM company WHERE slug = ?;`;

  try {
    const [result]: any = await pool.query(deleteCompanySql, [companySlug]);

    if (result.affectedRows === 0) {
      res.status(404).json({ successfully: false, message: 'Empresa não encontrada.' });
      return;
    }

    res.status(200).json({ successfully: true, message: 'Empresa removida com sucesso.' });
    return;
  } catch (error) {
    console.error('Erro ao remover empresa:', error);
    res.status(500).json({ successfully: false, message: 'Erro ao remover empresa.' });
    return;
  }
});

router.patch('/:companySlug/cnpj', async (req: Request, res: Response) => {
  const { companySlug } = req.params;
  const { cnpj } = req.body;

  if (!cnpj || !isValidCNPJ(cnpj)) {
    res.status(400).json({ successfully: false, message: 'CNPJ inválido ou não fornecido.' });
    return;
  }

  const updateCnpjSql = `UPDATE company SET cnpj = ? WHERE slug = ? AND cnpj IS NULL;`;

  try {
    const [result]: any = await pool.query(updateCnpjSql, [cnpj, companySlug]);

    if (result.affectedRows === 0) {
      res.status(400).json({ successfully: false, message: 'Empresa não encontrada ou já possui um CNPJ.' });
      return;
    }

    res.status(200).json({ successfully: true, message: 'CNPJ adicionado com sucesso.' });
    return;
  } catch (error) {
    console.error('Erro ao atualizar CNPJ:', error);
    res.status(500).json({ successfully: false, message: 'Erro ao atualizar CNPJ.' });
    return;
  }
});

export default router;
