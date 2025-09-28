import pool from '../config/database.js';

export const Sale = {
  // Crear nueva venta
  create: async (saleData) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Insertar la venta
      const saleResult = await client.query(
        `INSERT INTO venta (id_cliente, id_usuario, total) 
         VALUES ($1, $2, $3) RETURNING *`,
        [saleData.id_cliente, saleData.id_usuario, saleData.total]
      );
      
      const venta = saleResult.rows[0];
      
      // 2. Insertar detalles de venta y actualizar stock
      for (const item of saleData.items) {
        // Insertar detalle
        await client.query(
          `INSERT INTO detalleventa (id_venta, id_producto, cantidad, precio_unitario, iva) 
           VALUES ($1, $2, $3, $4, $5)`,
          [venta.id_venta, item.id_producto, item.cantidad, item.precio_unitario, item.iva]
        );
        
        // Actualizar stock del producto
        await client.query(
          'UPDATE producto SET stock = stock - $1 WHERE id_producto = $2',
          [item.cantidad, item.id_producto]
        );
        
        // Registrar movimiento de stock
        await client.query(
          `INSERT INTO movimientostock (id_tipo, id_producto, id_tienda, id_venta, cantidad) 
           VALUES (2, $1, $2, $3, $4)`,
          [item.id_producto, saleData.id_tienda, venta.id_venta, -item.cantidad]
        );
      }
      
      // 3. Insertar pago
      await client.query(
        'INSERT INTO pago (id_venta, id_metodo, monto) VALUES ($1, $2, $3)',
        [venta.id_venta, saleData.metodo_pago, saleData.total]
      );
      
      await client.query('COMMIT');
      return venta;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Obtener todas las ventas
  getAll: async () => {
    const result = await pool.query(`
      SELECT v.*, 
             c.nombre as cliente_nombre,
             c.apellido as cliente_apellido,
             u.nombre as usuario_nombre,
             mp.nombre as metodo_pago
      FROM venta v
      LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
      JOIN usuario u ON v.id_usuario = u.id_usuario
      JOIN pago p ON v.id_venta = p.id_venta
      JOIN metodopago mp ON p.id_metodo = mp.id_metodo
      ORDER BY v.fecha DESC
    `);
    return result.rows;
  },

  // Obtener venta por ID con detalles
  getById: async (id) => {
    const ventaResult = await pool.query(`
      SELECT v.*, 
             c.nombre as cliente_nombre,
             c.apellido as cliente_apellido,
             u.nombre as usuario_nombre,
             mp.nombre as metodo_pago
      FROM venta v
      LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
      JOIN usuario u ON v.id_usuario = u.id_usuario
      JOIN pago p ON v.id_venta = p.id_venta
      JOIN metodopago mp ON p.id_metodo = mp.id_metodo
      WHERE v.id_venta = $1
    `, [id]);
    
    const detallesResult = await pool.query(`
      SELECT dv.*, p.nombre as producto_nombre, p.codigo_barras
      FROM detalleventa dv
      JOIN producto p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = $1
    `, [id]);
    
    return {
      venta: ventaResult.rows[0],
      detalles: detallesResult.rows
    };
  },

  // Obtener métodos de pago
  getPaymentMethods: async () => {
    const result = await pool.query('SELECT * FROM metodopago ORDER BY nombre');
    return result.rows;
  },

  // Obtener clientes
  getClients: async () => {
    const result = await pool.query('SELECT * FROM cliente ORDER BY nombre, apellido');
    return result.rows;
  }
};