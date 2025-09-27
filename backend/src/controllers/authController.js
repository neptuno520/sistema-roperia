import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 [DEBUG] Intento de login para:', email);

    // 1. Buscar usuario por email
    const userResult = await pool.query(
      `SELECT u.*, r.nombre as rol, t.nombre as tienda 
       FROM usuario u 
       JOIN rol r ON u.id_rol = r.id_rol 
       JOIN tienda t ON u.id_tienda = t.id_tienda 
       WHERE u.email = $1 AND u.estado = true`,
      [email]
    );

    console.log('📊 Usuarios encontrados:', userResult.rows.length);

    if (userResult.rows.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = userResult.rows[0];

    // 2. Verificar contraseña
    console.log('🔑 Comparando contraseñas:');
    console.log('   Recibida:', password);
    console.log('   En BD:', user.password_hash);
    
    if (password !== user.password_hash) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('✅ Login exitoso');

    // 3. Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id_usuario, 
        email: user.email, 
        rol: user.rol,
        tienda: user.tienda 
      },
      process.env.JWT_SECRET || 'clave_temporal',
      { expiresIn: '24h' }
    );

    // 4. Responder
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
    console.error('💥 Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ✅ AGREGAR ESTA FUNCIÓN NUEVA
export const verifyToken = (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user,
    message: 'Token válido' 
  });
};