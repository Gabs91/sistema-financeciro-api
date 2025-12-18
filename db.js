require('dotenv').config();
const mysql = require('mysql2/promise');

let connection = null;

async function startConnection() {
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: process.env.MYSQLPORT || 3306,
      user: process.env.MYSQLUSER || process.env.DB_USER,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME
    });

    console.log("✅ MySQL conectado!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MySQL:", err);
    throw err; // MUITO IMPORTANTE pro Railway
  }
}

function getConnection() {
  return connection;
}

module.exports = { startConnection, getConnection };