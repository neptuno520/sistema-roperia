import pool from '../config/database.js';

export const Purchase = {
  create: async (purchaseData) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      console.log('Creando compra con datos:', purchaseData);
      
      // Insertar la compra (AGREGADO campo fecha)
      const purchaseResult = await client.query(
        `INSERT INTO compra (id_proveedor, id_usuario, fecha, total, estado) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          purchaseData.id_proveedor, 
          purchaseData.id_usuario, 
          purchaseData.fecha || new Date().toISOString().split('T')[0], // 👈 AGREGADO
          purchaseData.total, 
          purchaseData.estado || 'pendiente'
        ]
      );
      
      const compra = purchaseResult.rows[0];
      console.log('Compra insertada:', compra);
      
      // Insertar detalles de compra y actualizar stock
      for (const item of purchaseData.items) {
        console.log(`Procesando item: ${item.nombre}`);
        
        // Insertar detalle
        await client.query(
          `INSERT INTO detallecompra (id_compra, id_producto, cantidad, precio_unitario) 
           VALUES ($1, $2, $3, $4)`,
          [compra.id_compra, item.id_producto, item.cantidad, item.precio_unitario]
        );
        console.log(`    ✓ Detalle insertado`);
        
        // Actualizar stock del producto
        const updateResult = await client.query(
          'UPDATE producto SET stock = stock + $1 WHERE id_producto = $2 RETURNING stock',
          [item.cantidad, item.id_producto]
        );
        console.log(`    ✓ Stock actualizado a: ${updateResult.rows[0]?.stock}`);
      }
      
      await client.query('COMMIT');
      console.log('Compra completada exitosamente');
      
      return compra;
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en Purchase.create:', error);
      console.error('Código de error:', error.code);
      console.error('Detalle:', error.detail);
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
      ORDER BY c.fecha DESC, c.id_compra DESC
    `);
    return result.rows;
  },

  getById: async (id) => {
    const compraResult = await pool.query(`
      SELECT c.*, 
             p.nombre as proveedor_nombre,
             p.ruc as proveedor_ruc,
             u.nombre as usuario_nombre
      FROM compra c
      LEFT JOIN proveedor p ON c.id_proveedor = p.id_proveedor
      JOIN usuario u ON c.id_usuario = u.id_usuario
      WHERE c.id_compra = $1
    `, [id]);
    
    const detallesResult = await pool.query(`
      SELECT dc.*, 
             p.nombre as producto_nombre,
             p.color,
             p.talla
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