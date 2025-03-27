import pool from "../databases/MySQL/pool";

async function setupDatabase() {
  const createCompanyTableSql = `
    CREATE TABLE IF NOT EXISTS company (
      slug VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      cnpj VARCHAR(18) NULL,
      cpf VARCHAR(14) NULL,
      telefone VARCHAR(20) NULL,
      email VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  const createOrdersTableSql = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      company_slug VARCHAR(255) NOT NULL,
      body_id VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      description TEXT NOT NULL,
      preference_id VARCHAR(255) NOT NULL,
      currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
      status ENUM('pending', 'approved', 'cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (company_slug) REFERENCES company(slug)
    ) ENGINE=InnoDB;
  `;

  const createInvoicesTableSql = `
    CREATE TABLE IF NOT EXISTS invoices (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      invoice_number VARCHAR(255) UNIQUE NOT NULL,
      issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      due_date DATE NOT NULL,
      status ENUM('unpaid', 'paid', 'overdue') DEFAULT 'unpaid',
      FOREIGN KEY (order_id) REFERENCES orders(id)
    ) ENGINE=InnoDB;
  `;

  // Note: MySQL não suporta 'IF NOT EXISTS' para criação de índices.
  // Vamos tentar criar o índice e, se ele já existir, ignorar o erro.
  const createCompanySlugIndexSql = `
    CREATE INDEX idx_company_slug ON company(slug);
  `;

  try {
    const connection = await pool.getConnection();

    console.log('Criando tabela company...');
    await connection.query(createCompanyTableSql);

    console.log('Verificando se o índice para o campo slug da tabela company já existe...');
    try {
      await connection.query(createCompanySlugIndexSql);
      console.log('Índice para o campo slug criado com sucesso.');
    } catch (indexError) {
      console.log('Índice já existe, não foi necessário criá-lo.');
    }

    console.log('Criando tabela orders...');
    await connection.query(createOrdersTableSql);

    console.log('Criando tabela invoices...');
    await connection.query(createInvoicesTableSql);

    connection.release();
  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
    throw error;
  }
}

setupDatabase();
