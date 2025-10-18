import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Intento de login para:', email);
    
    // CONSULTA DIRECTA a la base de datos (porque no tienes User.js)
    const result = await pool.query(
      `SELECT u.*, t.nombre as tienda_nombre 
       FROM usuario u 
       JOIN tienda t ON u.id_tienda = t.id_tienda 
       WHERE u.email = $1 AND u.estado = true`,
      [email]
    );
    
    if (result.rows.length === 0) {
      console.log('Usuario no encontrado:', email);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const user = result.rows[0];
    console.log('Usuario encontrado:', user);
    
    /*const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }*/

    // Verificar password (simple por ahora - mejorar con bcrypt después)
    if (user.password_hash !== password) {
      console.log('Password incorrecto para:', email);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Crear token INCLUYENDO id_tienda
    const token = jwt.sign(
      { 
        id: user.id_usuario, 
        email: user.email,
        id_tienda: user.id_tienda, // ← ESTO ES CRÍTICO
        id_rol: user.id_rol 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Respuesta INCLUYENDO id_tienda
    const userResponse = {
      id: user.id_usuario,
      nombre: user.nombre,
      email: user.email,
      id_tienda: user.id_tienda, // ← ESTO ES CRÍTICO
      id_rol: user.id_rol,
      tienda_nombre: user.tienda_nombre
    };

    console.log('Login exitoso. User response:', userResponse);
    
    res.json({
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const verifyToken = (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user,
    message: 'Token válido' 
  });
};
