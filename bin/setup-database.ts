#!/usr/bin/env node

import pool from '../databases/MySQL/pool';  // Certifique-se de ajustar o caminho

async function setupDatabase() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS company (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      slug VARCHAR(255) GENERATED ALWAYS AS (LOWER(REPLACE(name, ' ', '-'))) STORED,
      cnpj VARCHAR(18) NULL,
      cpf VARCHAR(14) NULL,
      telefone VARCHAR(20) NULL,
      email VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  const createIndexSql = `
    CREATE INDEX idx_company_slug ON company(slug);
  `;

  try {
    const connection = await pool.getConnection();

    console.log('Criando tabela company...');
    await connection.query(createTableSql);

    console.log('Criando índice para o campo slug...');
    await connection.query(createIndexSql);

    connection.release();
  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
    throw error;
  }
}

async function main() {
  console.log('Iniciando a configuração do banco de dados...');
  await setupDatabase();
  console.log('✅ Banco de dados configurado com sucesso!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Erro ao configurar o banco de dados:', error);
  process.exit(1);
});
