const express = require('express');
const path = require('path');
const cors = require('cors');
const { startConnection } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar banco antes de carregar rotas
startConnection().then(() => {
  
  const authRoutes = require('./routes/auth');
  const txRoutes = require('./routes/transactions');
  const authMiddleware = require('./middlewares/authMiddleware');

  app.use('/auth', authRoutes);
  app.use('/transactions', authMiddleware, txRoutes);

  // Frontend (se quiser hostear junto)
  app.use(express.static(path.join(__dirname, '../public')));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("Rodando em http://localhost:" + PORT));
});
