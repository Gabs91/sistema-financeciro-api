const express = require('express');
const cors = require('cors');
const { startConnection } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar banco antes de subir o servidor
startConnection()
  .then(() => {
    const authRoutes = require('./routes/auth');
    const txRoutes = require('./routes/transactions');
    const authMiddleware = require('./middlewares/authMiddleware');

    app.use('/auth', authRoutes);
    app.use('/transactions', authMiddleware, txRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 API rodando na porta ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no banco:', err);
    process.exit(1); // Railway entende e mostra erro correto
  });