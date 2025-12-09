const jwt = require('jsonwebtoken');

// 🔐 SECRET IGUAL AO auth.js
const SECRET = process.env.JWT_SECRET || "MEGASECRETO";

module.exports = (req, res, next) => {
  let token = req.headers.authorization || '';

  if (!token)
    return res.status(401).json({ error: 'Token ausente' });

  if (token.startsWith('Bearer '))
    token = token.slice(7);

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();

  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
