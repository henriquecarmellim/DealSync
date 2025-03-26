import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.JDBC_CONNECTION_STRING!);

export default pool;
