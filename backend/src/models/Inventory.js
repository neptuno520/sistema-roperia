import pool from '../config/database.js';

export const Inventory = {
  // Obtener movimientos de stock
    getMovements: async (filters = {}) => {
    try {
        console.log('[DEBUG] Buscando movimientos...');
        
        let query = `
        SELECT 
            ms.id_movimiento,
            ms.fecha,
            ms.cantidad,
            CASE 
            WHEN ms.cantidad > 0 THEN 'ENTRADA'
            WHEN ms.cantidad < 0 THEN 'SALIDA' 
            ELSE 'SIN CAMBIO'
            END as tipo_movimiento,
            tp.descripcion as descripcion_movimiento,
            p.nombre as producto_nombre,
            p.codigo_barras,
            t.nombre as tienda_nombre,
            CASE 
            WHEN ms.id_venta IS NOT NULL THEN 'Venta #' || ms.id_venta
            WHEN ms.id_compra IS NOT NULL THEN 'Compra #' || ms.id_compra
            ELSE 'Ajuste manual'
            END as referencia,
            ABS(ms.cantidad) as cantidad_absoluta
        FROM movimientostock ms
        JOIN tipomovimiento tp ON ms.id_tipo = tp.id_tipo
        JOIN producto p ON ms.id_producto = p.id_producto
        JOIN tienda t ON ms.id_tienda = t.id_tienda
        WHERE 1=1
        `;
        
        const params = [];
        let paramCount = 1;

        if (filters.producto_id) {
        query += ` AND ms.id_producto = $${paramCount}`;
        params.push(filters.producto_id);
        paramCount++;
        }

        if (filters.tienda_id) {
        query += ` AND ms.id_tienda = $${paramCount}`;
        params.push(filters.tienda_id);
        paramCount++;
        }

        if (filters.tipo) {
        if (filters.tipo === 'entrada') {
            query += ` AND ms.cantidad > 0`;
        } else if (filters.tipo === 'salida') {
            query += ` AND ms.cantidad < 0`;
        }
        }

        query += ` ORDER BY ms.fecha DESC LIMIT 100`;

        console.log('[DEBUG] Query ejecutada');
        const result = await pool.query(query, params);
        console.log('[DEBUG] Movimientos encontrados:', result.rows.length);

        return result.rows;

        } catch (error) {
            console.error('[DEBUG] Error en getMovements:', error);
            throw error;
        }
    },

  // Obtener productos con stock bajo
getLowStockProducts: async (minStock = 10, tiendaId) => {
    const result = await pool.query(
      `SELECT 
        p.*, 
        i.stock_disponible, 
        c.nombre as categoria_nombre
      FROM producto p
      JOIN inventario i ON p.id_producto = i.id_producto AND i.id_tienda = $2
      JOIN categoriaproducto c ON p.id_categoria = c.id_categoria
      WHERE i.stock_disponible <= $1
      ORDER BY i.stock_disponible ASC`,
      [minStock, tiendaId]
    );
    return result.rows;
  },

  // Obtener stock de un producto en una tienda específica
  getProductStock: async (productId, tiendaId) => {
    try {
      const result = await pool.query(
        `SELECT 
          p.id_producto,
          p.nombre,
          p.stock as stock_general,
          i.stock_disponible,
          t.nombre as tienda_nombre
        FROM producto p
        LEFT JOIN inventario i ON p.id_producto = i.id_producto AND i.id_tienda = $2
        LEFT JOIN tienda t ON i.id_tienda = t.id_tienda
        WHERE p.id_producto = $1`,
        [productId, tiendaId]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error en getProductStock:', error);
      throw error;
    }
  },

  // Registrar movimiento de stock manual (ajuste)
  registerManualAdjustment: async (movementData) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const { id_producto, id_tienda, cantidad, motivo, id_usuario } = movementData;
      
      // 1. Registrar movimiento
      const movementResult = await client.query(
        `INSERT INTO movimientostock 
         (id_tipo, id_producto, id_tienda, cantidad, fecha) 
         VALUES (3, $1, $2, $3, NOW()) RETURNING *`,
        [id_producto, id_tienda, cantidad]
      );

      // 2. Actualizar inventario
      await client.query(
        `INSERT INTO inventario (id_tienda, id_producto, stock_disponible)
         VALUES ($1, $2, $3)
         ON CONFLICT (id_tienda, id_producto) 
         DO UPDATE SET stock_disponible = inventario.stock_disponible + $3`,
        [id_tienda, id_producto, cantidad]
      );

      // 3. Actualizar stock general del producto
      await client.query(
        `UPDATE producto SET stock = stock + $1 WHERE id_producto = $2`,
        [cantidad, id_producto]
      );

      await client.query('COMMIT');
      return movementResult.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Obtener estadísticas de inventario
  getInventoryStats: async (tiendaId) => {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT p.id_producto) as total_productos,
        COALESCE(SUM(COALESCE(i.stock_disponible, 0)), 0) as total_stock,
        COALESCE(SUM(p.precio * COALESCE(i.stock_disponible, 0)), 0) as valor_total,
        
        -- Productos con stock bajo (1-10 unidades) Y que existen en inventario
        COUNT(DISTINCT CASE WHEN i.stock_disponible IS NOT NULL 
                            AND i.stock_disponible > 0 
                            AND i.stock_disponible <= 10 
                            THEN p.id_producto END) as stock_bajo,
        
        -- Productos sin stock (0 unidades O no existen en inventario)
        COUNT(DISTINCT CASE WHEN i.stock_disponible IS NULL 
                            OR i.stock_disponible = 0 
                            THEN p.id_producto END) as sin_stock
        
      FROM producto p
      LEFT JOIN inventario i ON p.id_producto = i.id_producto AND i.id_tienda = $1
    `, [tiendaId]);
    
    return result.rows[0];
  },
};