require('dotenv').config();
const mysql = require('mysql2/promise');

let connection = null;

async function startConnection() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    console.log("MySQL conectado!");
  } catch (err) {
    console.error("Erro ao conectar ao MySQL:", err);
  }
}

function getConnection() {
  return connection;
}

module.exports = { startConnection, getConnection };
