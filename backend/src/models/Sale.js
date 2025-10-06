import pool from '../config/database.js';

export const Sale = {
  create: async (saleData) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      console.log('🔹 Transacción iniciada');
      
      // 1. Insertar la venta
      console.log('📝 Insertando venta...');
      const saleResult = await client.query(
        `INSERT INTO venta (id_cliente, id_usuario, total) 
         VALUES ($1, $2, $3) RETURNING *`,
        [saleData.id_cliente, saleData.id_usuario, saleData.total]
      );
      
      const venta = saleResult.rows[0];
      console.log('✅ Venta insertada, ID:', venta.id_venta);
      
      // 2. Insertar detalles de venta y actualizar stock
      console.log('📦 Procesando items...');
      for (const item of saleData.items) {
        console.log(`  - Producto ${item.id_producto}, cantidad: ${item.cantidad}`);
        
        // Insertar detalle
        await client.query(
          `INSERT INTO detalleventa (id_venta, id_producto, cantidad, precio_unitario, iva) 
           VALUES ($1, $2, $3, $4, $5)`,
          [venta.id_venta, item.id_producto, item.cantidad, item.precio_unitario, item.iva]
        );
        console.log('    ✓ Detalle insertado');
        
        // Actualizar producto.stock
        await client.query(
          'UPDATE producto SET stock = stock - $1 WHERE id_producto = $2',
          [item.cantidad, item.id_producto]
        );
        console.log('    ✓ Stock actualizado');
        
        // Actualizar inventario (con manejo de error)
        try {
          await client.query(
            `INSERT INTO inventario (id_tienda, id_producto, stock_disponible)
             VALUES ($1, $2, $3)
             ON CONFLICT (id_tienda, id_producto) 
             DO UPDATE SET stock_disponible = inventario.stock_disponible - $3`,
            [saleData.id_tienda, item.id_producto, item.cantidad]
          );
          console.log('    ✓ Inventario actualizado');
        } catch (invError) {
          console.log('    ⚠️ Error en inventario (continuando):', invError.message);
          // Continuar aunque falle el inventario
        }
        
        // Registrar movimiento de stock
        await client.query(
          `INSERT INTO movimientostock (id_tipo, id_producto, id_tienda, id_venta, cantidad) 
           VALUES (2, $1, $2, $3, $4)`,
          [item.id_producto, saleData.id_tienda, venta.id_venta, -item.cantidad]
        );
        console.log('    ✓ Movimiento registrado');
      }
      
      // 3. Insertar pago
      console.log('💳 Insertando pago...');
      await client.query(
        'INSERT INTO pago (id_venta, id_metodo, monto) VALUES ($1, $2, $3)',
        [venta.id_venta, saleData.metodo_pago, saleData.total]
      );
      console.log('✅ Pago insertado');
      
      await client.query('COMMIT');
      console.log('✅ Transacción confirmada');
      
      return venta;
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error en Sale.create, haciendo ROLLBACK');
      console.error('Detalle del error:', error.message);
      console.error('Código:', error.code);
      console.error('Stack:', error.stack);
      throw error;
    } finally {
      client.release();
      console.log('🔹 Conexión liberada');
    }
  },

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

  getPaymentMethods: async () => {
    const result = await pool.query('SELECT * FROM metodopago ORDER BY nombre');
    return result.rows;
  },

  getClients: async () => {
    const result = await pool.query('SELECT * FROM cliente ORDER BY nombre, apellido');
    return result.rows;
  }
};