<<<<<<< Updated upstream
=======
import bcrypt from 'bcryptjs';
>>>>>>> Stashed changes
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
<<<<<<< Updated upstream
    
    console.log('🔐 Intento de login para:', email);
    
    // CONSULTA DIRECTA a la base de datos (porque no tienes User.js)
    const result = await pool.query(
      `SELECT u.*, t.nombre as tienda_nombre 
       FROM usuario u 
       JOIN tienda t ON u.id_tienda = t.id_tienda 
       WHERE u.email = $1 AND u.estado = true`,
      [email]
    );
    
    if (result.rows.length === 0) {
      console.log('❌ Usuario no encontrado:', email);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const user = result.rows[0];
    console.log('👤 Usuario encontrado:', user);
    
    // Verificar password (simple por ahora - mejorar con bcrypt después)
    if (user.password_hash !== password) {
      console.log('❌ Password incorrecto para:', email);
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

    console.log('✅ Login exitoso. User response:', userResponse);
    
    res.json({
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('💥 Error en login:', error);
=======

    // 1. Buscar usuario por email
    const userResult = await pool.query(
      `SELECT u.*, r.nombre as rol, t.nombre as tienda 
       FROM Usuario u 
       JOIN Rol r ON u.id_rol = r.id_rol 
       JOIN Tienda t ON u.id_tienda = t.id_tienda 
       WHERE u.email = $1 AND u.estado = true`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = userResult.rows[0];

    // 2. Verificar contraseña (en un caso real, deberías tener password_hash)
    // Por ahora, usaremos una contraseña simple para prueba
    const isValidPassword = password === '123456'; // Cambiar luego por bcrypt

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id_usuario, 
        email: user.email, 
        rol: user.rol,
        tienda: user.tienda 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 4. Responder con token y datos de usuario
    res.json({
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        tienda: user.tienda
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
>>>>>>> Stashed changes
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const verifyToken = (req, res) => {
<<<<<<< Updated upstream
  res.json({ 
    valid: true, 
    user: req.user,
    message: 'Token válido' 
  });
};
=======
  res.json({ valid: true, user: req.user });
};
>>>>>>> Stashed changes
