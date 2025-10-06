<<<<<<< Updated upstream
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
=======

import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
>>>>>>> Stashed changes
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
<<<<<<< Updated upstream
    
    // Asegurar que user tenga id_tienda
    req.user = user;
    console.log('🔐 Usuario autenticado:', user); // Para debug
    next();
  });
};
=======
    req.user = user;
    next();
  });
};
>>>>>>> Stashed changes
