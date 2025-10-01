import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'faccilan',
  user: 'postgres',
  password: 'root'
});

async function runSeeds() {
  try {
    await client.connect();
    console.log('Conectado a la base de datos');
    
    const seedsSQL = fs.readFileSync('./database/seeds.sql', 'utf8');
    
    // Ejecutar el script completo
    await client.query(seedsSQL);
    
    console.log('✅ Seeds ejecutados correctamente');
    
    // Verificar que los tipos de movimiento existen
    const result = await client.query('SELECT * FROM tipomovimiento ORDER BY id_tipo');
    console.log('\nTipos de movimiento en la base de datos:');
    result.rows.forEach(row => {
      console.log(`  ID: ${row.id_tipo} - ${row.descripcion}`);
    });
    
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error.message);
  } finally {
    await client.end();
  }
}

runSeeds();
