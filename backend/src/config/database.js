import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'faccilan',
<<<<<<< Updated upstream
  password: process.env.DB_PASSWORD || 'admin', 
  port: process.env.DB_PORT || 5432,
  client_encoding: 'UTF8'
=======
  password: process.env.DB_PASSWORD || 'root', 
  port: process.env.DB_PORT || 5432,
>>>>>>> Stashed changes
});

// Probar la conexión
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error de conexión a PostgreSQL:', err);
});

export default pool;