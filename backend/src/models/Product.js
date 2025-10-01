import pool from '../config/database.js';

export const Product = {
  // Obtener todos los productos con información de categoría
// En models/Product.js - VERIFICAR
// En models/Product.js - DEBUG TEMPORAL
getAll: async (tiendaId = null) => {
  console.log('🏪 [MODELO] Product.getAll con tiendaId:', tiendaId);
  
  let query = `
    SELECT 
      p.*, 
      c.nombre as categoria_nombre,
      COALESCE(i.stock_disponible, 0) as stock,  -- CAMBIADO
      i.stock_disponible as stock_real,
      p.stock as stock_general
    FROM producto p 
    JOIN categoriaproducto c ON p.id_categoria = c.id_categoria 
  `;
  
  if (tiendaId) {
    query += ` LEFT JOIN inventario i ON p.id_producto = i.id_producto AND i.id_tienda = $1 `;
  }
  
  query += ` ORDER BY p.id_producto DESC`;
  
  const params = tiendaId ? [tiendaId] : [];
  console.log('📝 [MODELO] Query ejecutada con params:', params);
  
  const result = await pool.query(query, params);
  
  // DEBUG: Mostrar algunos productos y sus stocks
  console.log('🔍 [MODELO] Muestra de stocks:');
  result.rows.slice(0, 5).forEach(row => {
    console.log(`   ${row.nombre}: stock=${row.stock}, stock_real=${row.stock_real}, stock_general=${row.stock_general}`);
  });
  
  return result.rows;
},

  // Obtener producto por ID
  getById: async (id) => {
    const result = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM producto p 
      JOIN categoriaproducto c ON p.id_categoria = c.id_categoria 
      WHERE p.id_producto = $1
    `, [id]);
    return result.rows[0];
  },

  // Crear nuevo producto
  create: async (productData) => {
    const { id_categoria, nombre, iva, codigo_barras, color, talla, precio, stock } = productData;
    const result = await pool.query(`
      INSERT INTO producto (id_categoria, nombre, iva, codigo_barras, color, talla, precio, stock) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `, [id_categoria, nombre, iva, codigo_barras, color, talla, precio, stock]);
    return result.rows[0];
  },

  // Actualizar producto
  update: async (id, productData) => {
    const { id_categoria, nombre, iva, codigo_barras, color, talla, precio, stock } = productData;
    const result = await pool.query(`
      UPDATE producto 
      SET id_categoria = $1, nombre = $2, iva = $3, codigo_barras = $4, 
          color = $5, talla = $6, precio = $7, stock = $8 
      WHERE id_producto = $9 
      RETURNING *
    `, [id_categoria, nombre, iva, codigo_barras, color, talla, precio, stock, id]);
    return result.rows[0];
  },

  // Eliminar producto (soft delete)
  delete: async (id) => {
    const result = await pool.query(`
      UPDATE producto SET estado = false WHERE id_producto = $1 RETURNING *
    `, [id]);
    return result.rows[0];
  },

  // Obtener categorías
  getCategories: async () => {
    const result = await pool.query('SELECT * FROM categoriaproducto ORDER BY nombre');
    return result.rows;
  }
};