const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../db');

const router = express.Router();

// 🔐 SECRET ÚNICO E PADRONIZADO
const SECRET = process.env.JWT_SECRET || "MEGASECRETO";

// ----- REGISTRO -----
router.post('/register', async (req, res) => {
  try {
    const db = getConnection();
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email e senha obrigatórios." });

    const hash = bcrypt.hashSync(password, 10);

    await db.execute(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash]
    );

    return res.json({ message: "Usuário criado!" });

  } catch (error) {
    console.log("ERRO REGISTER:", error);
    return res.status(500).json({ error: "Usuário já existe ou erro interno." });
  }
});

// ----- LOGIN -----
router.post('/login', async (req, res) => {
  try {
    const db = getConnection();
    const { email, password } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(400).json({ error: "Usuário não encontrado." });

    const user = rows[0];

    if (!bcrypt.compareSync(password, user.password))
      return res.status(400).json({ error: "Senha incorreta." });

    // 🔐 Gera token com mesmo SECRET
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

    return res.json({ message: "Login realizado!", token });

  } catch (error) {
    console.log("ERRO LOGIN:", error);
    return res.status(500).json({ error: "Erro interno no login." });
  }
});

module.exports = router;
