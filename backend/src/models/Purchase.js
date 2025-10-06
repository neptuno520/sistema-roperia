import pool from '../config/database.js';

export const Purchase = {
  create: async (purchaseData) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insertar la compra
      const purchaseResult = await client.query(
        `INSERT INTO compra (id_proveedor, id_usuario, total, estado) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [purchaseData.id_proveedor, purchaseData.id_usuario, purchaseData.total, 'pendiente']
      );
      
      const compra = purchaseResult.rows[0];
      
      // Insertar detalles de compra y actualizar stock
      for (const item of purchaseData.items) {
        // Insertar detalle
        await client.query(
          `INSERT INTO detallecompra (id_compra, id_producto, cantidad, precio_unitario) 
           VALUES ($1, $2, $3, $4)`,
          [compra.id_compra, item.id_producto, item.cantidad, item.precio_unitario]
        );
        
        // Actualizar stock del producto
        await client.query(
          'UPDATE producto SET stock = stock + $1 WHERE id_producto = $2',
          [item.cantidad, item.id_producto]
        );
      }
      
      await client.query('COMMIT');
      return compra;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  getAll: async () => {
    const result = await pool.query(`
      SELECT c.*, 
             p.nombre as proveedor_nombre,
             u.nombre as usuario_nombre
      FROM compra c
      LEFT JOIN proveedor p ON c.id_proveedor = p.id_proveedor
      JOIN usuario u ON c.id_usuario = u.id_usuario
      ORDER BY c.fecha DESC
    `);
    return result.rows;
  },

  getById: async (id) => {
    const compraResult = await pool.query(`
      SELECT c.*, 
             p.nombre as proveedor_nombre,
             u.nombre as usuario_nombre
      FROM compra c
      LEFT JOIN proveedor p ON c.id_proveedor = p.id_proveedor
      JOIN usuario u ON c.id_usuario = u.id_usuario
      WHERE c.id_compra = $1
    `, [id]);
    
    const detallesResult = await pool.query(`
      SELECT dc.*, p.nombre as producto_nombre
      FROM detallecompra dc
      JOIN producto p ON dc.id_producto = p.id_producto
      WHERE dc.id_compra = $1
    `, [id]);
    
    return {
      compra: compraResult.rows[0],
      detalles: detallesResult.rows
    };
  },

  getProviders: async () => {
    const result = await pool.query('SELECT * FROM proveedor ORDER BY nombre');
    return result.rows;
  }
};