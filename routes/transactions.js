const express = require('express');
const { getConnection } = require('../db');

const router = express.Router();

/*
  CAMPOS DA TABELA `transactions`
  -------------------------------
  id INT PK AI
  user_id INT
  type ENUM('entrada','saida')
  description VARCHAR(255)
  amount DECIMAL(10,2)
  date DATE
*/

// ----------------------------
// LISTAR TRANSAÇÕES
// GET /transactions
// ----------------------------
router.get('/', async (req, res) => {
    try {
        const db = getConnection();

        const [rows] = await db.execute(
            "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
            [req.userId]
        );

        return res.json(rows);

    } catch (error) {
        console.log("ERRO LISTAR:", error);
        res.status(500).json({ error: "Erro ao listar transações." });
    }
});

// ----------------------------
// CRIAR TRANSAÇÃO
// POST /transactions
// ----------------------------
router.post('/', async (req, res) => {
    try {
        const db = getConnection();

        const { type, description, amount, date } = req.body;

        if (!type || !description || !amount || !date) {
            return res.status(400).json({ error: "Preencha todos os campos." });
        }

        await db.execute(
            "INSERT INTO transactions (user_id, type, description, amount, date) VALUES (?, ?, ?, ?, ?)",
            [req.userId, type, description, amount, date]
        );

        return res.json({ message: "Transação adicionada!" });

    } catch (error) {
        console.log("ERRO ADD:", error);
        res.status(500).json({ error: "Erro ao adicionar transação." });
    }
});

// ----------------------------
// ATUALIZAR TRANSAÇÃO
// PUT /transactions/:id
// ----------------------------
router.put('/:id', async (req, res) => {
    try {
        const db = getConnection();
        const { id } = req.params;
        const { type, description, amount, date } = req.body;

        await db.execute(
            "UPDATE transactions SET type=?, description=?, amount=?, date=? WHERE id=? AND user_id=?",
            [type, description, amount, date, id, req.userId]
        );

        return res.json({ message: "Transação atualizada!" });

    } catch (error) {
        console.log("ERRO UPDATE:", error);
        res.status(500).json({ error: "Erro ao atualizar transação." });
    }
});

// ----------------------------
// DELETAR TRANSAÇÃO
// DELETE /transactions/:id
// ----------------------------
router.delete('/:id', async (req, res) => {
    try {
        const db = getConnection();
        const { id } = req.params;

        await db.execute(
            "DELETE FROM transactions WHERE id=? AND user_id=?",
            [id, req.userId]
        );

        return res.json({ message: "Transação removida!" });

    } catch (error) {
        console.log("ERRO DELETE:", error);
        res.status(500).json({ error: "Erro ao excluir transação." });
    }
});

module.exports = router;
