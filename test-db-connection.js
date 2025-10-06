const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'postgres', // Cambia si tu base tiene otro nombre
});

client.connect()
  .then(() => {
    console.log('✅ Conexión exitosa a PostgreSQL');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Hora actual en PostgreSQL:', res.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('❌ Error de conexión a PostgreSQL:', err.message);
    client.end();
  });
