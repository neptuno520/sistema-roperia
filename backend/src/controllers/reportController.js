// backend/src/controllers/reportController.js
import pool from '../config/database.js';

export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, clientId, userId, paymentMethod } = req.query;
    const userTiendaId = req.user.id_tienda;
    
    let query = `
      SELECT 
        v.id_venta,
        v.fecha,
        v.total,
        v.estado,
        c.nombre as cliente_nombre,
        c.apellido as cliente_apellido,
        c.documento as cliente_documento,
        u.nombre as usuario_nombre,
        t.nombre as tienda_nombre,
        mp.nombre as metodo_pago
      FROM venta v
      LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
      JOIN usuario u ON v.id_usuario = u.id_usuario
      JOIN tienda t ON u.id_tienda = t.id_tienda
      LEFT JOIN pago p ON v.id_venta = p.id_venta
      LEFT JOIN metodopago mp ON p.id_metodo = mp.id_metodo
      WHERE t.id_tienda = $1
        AND v.fecha::date >= $2::date
        AND v.fecha::date <= $3::date
    `;
    
    const params = [userTiendaId, startDate, endDate];
    let paramCount = 4;
    
    // Filtros adicionales opcionales
    if (clientId) {
      query += ` AND v.id_cliente = $${paramCount}`;
      params.push(clientId);
      paramCount++;
    }
    
    if (userId) {
      query += ` AND v.id_usuario = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }
    
    if (paymentMethod) {
      query += ` AND p.id_metodo = $${paramCount}`;
      params.push(paymentMethod);
      paramCount++;
    }
    
    query += ` ORDER BY v.fecha DESC`;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error en getSalesReport:', error);
    res.status(500).json({ error: 'Error al obtener reporte de ventas' });
  }
};

export const getPurchasesReport = async (req, res) => {
  try {
    const { startDate, endDate, providerId, estado } = req.query;
    
    let query = `
      SELECT 
        c.id_compra,
        c.fecha,
        c.total,
        c.estado,
        p.nombre as proveedor_nombre,
        p.ruc as proveedor_ruc,
        u.nombre as usuario_nombre
      FROM compra c
      LEFT JOIN proveedor p ON c.id_proveedor = p.id_proveedor
      JOIN usuario u ON c.id_usuario = u.id_usuario
      WHERE c.fecha::date >= $1::date
        AND c.fecha::date <= $2::date
    `;
    
    const params = [startDate, endDate];
    let paramCount = 3;
    
    if (providerId) {
      query += ` AND c.id_proveedor = $${paramCount}`;
      params.push(providerId);
      paramCount++;
    }
    
    if (estado) {
      query += ` AND c.estado = $${paramCount}`;
      params.push(estado);
      paramCount++;
    }
    
    query += ` ORDER BY c.fecha DESC`;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error en getPurchasesReport:', error);
    res.status(500).json({ error: 'Error al obtener reporte de compras' });
  }
};

export const getSalesByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userTiendaId = req.user.id_tienda;
    
    const query = `
      SELECT 
        cp.nombre as categoria,
        COUNT(DISTINCT v.id_venta) as cantidad_ventas,
        SUM(dv.cantidad) as productos_vendidos,
        SUM(dv.cantidad * dv.precio_unitario) as total_ventas
      FROM venta v
      JOIN detalleventa dv ON v.id_venta = dv.id_venta
      JOIN producto p ON dv.id_producto = p.id_producto
      JOIN categoriaproducto cp ON p.id_categoria = cp.id_categoria
      JOIN usuario u ON v.id_usuario = u.id_usuario
      WHERE u.id_tienda = $1
        AND v.fecha::date >= $2::date
        AND v.fecha::date <= $3::date
      GROUP BY cp.id_categoria, cp.nombre
      ORDER BY total_ventas DESC
    `;
    
    const result = await pool.query(query, [userTiendaId, startDate, endDate]);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error en getSalesByCategory:', error);
    res.status(500).json({ error: 'Error al obtener ventas por categoría' });
  }
};

export const getSalesSummary = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    const userTiendaId = req.user.id_tienda;
    
    let dateFormat;
    switch(period) {
      case 'day':
        dateFormat = 'YYYY-MM-DD';
        break;
      case 'week':
        dateFormat = 'IYYY-IW';
        break;
      case 'month':
        dateFormat = 'YYYY-MM';
        break;
      default:
        dateFormat = 'YYYY-MM-DD';
    }
    
    const query = `
      SELECT 
        TO_CHAR(v.fecha, '${dateFormat}') as periodo,
        COUNT(v.id_venta) as cantidad_ventas,
        SUM(v.total) as total_ventas,
        AVG(v.total) as promedio_venta
      FROM venta v
      JOIN usuario u ON v.id_usuario = u.id_usuario
      WHERE u.id_tienda = $1
        AND v.fecha::date >= $2::date
        AND v.fecha::date <= $3::date
      GROUP BY TO_CHAR(v.fecha, '${dateFormat}')
      ORDER BY periodo
    `;
    
    const result = await pool.query(query, [userTiendaId, startDate, endDate]);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error en getSalesSummary:', error);
    res.status(500).json({ error: 'Error al obtener resumen de ventas' });
  }
};

export const getSalesByPaymentMethod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userTiendaId = req.user.id_tienda;
    
    const query = `
      SELECT 
        mp.nombre as metodo_pago,
        COUNT(v.id_venta) as cantidad_ventas,
        SUM(v.total) as total_ventas,
        ROUND(COUNT(v.id_venta) * 100.0 / SUM(COUNT(v.id_venta)) OVER(), 2) as porcentaje
      FROM venta v
      JOIN pago p ON v.id_venta = p.id_venta
      JOIN metodopago mp ON p.id_metodo = mp.id_metodo
      JOIN usuario u ON v.id_usuario = u.id_usuario
      WHERE u.id_tienda = $1
        AND v.fecha::date >= $2::date
        AND v.fecha::date <= $3::date
      GROUP BY mp.id_metodo, mp.nombre
      ORDER BY total_ventas DESC
    `;
    
    const result = await pool.query(query, [userTiendaId, startDate, endDate]);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error en getSalesByPaymentMethod:', error);
    res.status(500).json({ error: 'Error al obtener ventas por método de pago' });
  }
};

export const getInventoryReport = async (req, res) => {
  try {
    const userTiendaId = req.user.id_tienda;
    
    const query = `
      SELECT 
        p.id_producto,
        p.nombre as producto_nombre,
        p.codigo_barras,
        p.color,
        p.talla,
        p.precio,
        cp.nombre as categoria,
        COALESCE(i.stock_disponible, 0) as stock_actual,
        p.precio * COALESCE(i.stock_disponible, 0) as valor_inventario,
        CASE 
          WHEN i.stock_disponible = 0 OR i.stock_disponible IS NULL THEN 'Sin stock'
          WHEN i.stock_disponible <= 10 THEN 'Stock bajo'
          ELSE 'Stock normal'
        END as estado_stock
      FROM producto p
      LEFT JOIN inventario i ON p.id_producto = i.id_producto AND i.id_tienda = $1
      JOIN categoriaproducto cp ON p.id_categoria = cp.id_categoria
      ORDER BY cp.nombre, p.nombre
    `;
    
    const result = await pool.query(query, [userTiendaId]);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error en getInventoryReport:', error);
    res.status(500).json({ error: 'Error al obtener reporte de inventario' });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    const userTiendaId = req.user.id_tienda;
    
    const query = `
      SELECT 
        p.id_producto,
        p.nombre as producto_nombre,
        p.color,
        p.talla,
        cp.nombre as categoria,
        SUM(dv.cantidad) as cantidad_vendida,
        SUM(dv.cantidad * dv.precio_unitario) as total_ventas,
        COUNT(DISTINCT v.id_venta) as veces_vendido
      FROM venta v
      JOIN detalleventa dv ON v.id_venta = dv.id_venta
      JOIN producto p ON dv.id_producto = p.id_producto
      JOIN categoriaproducto cp ON p.id_categoria = cp.id_categoria
      JOIN usuario u ON v.id_usuario = u.id_usuario
      WHERE u.id_tienda = $1
        AND v.fecha::date >= $2::date
        AND v.fecha::date <= $3::date
      GROUP BY p.id_producto, p.nombre, p.color, p.talla, cp.nombre
      ORDER BY cantidad_vendida DESC
      LIMIT $4
    `;
    
    const result = await pool.query(query, [userTiendaId, startDate, endDate, limit]);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error en getTopProducts:', error);
    res.status(500).json({ error: 'Error al obtener productos más vendidos' });
  }
};

export const getCustomerReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userTiendaId = req.user.id_tienda;
    
    const query = `
      SELECT 
        c.id_cliente,
        c.nombre,
        c.apellido,
        c.documento,
        c.telefono,
        c.email,
        COUNT(v.id_venta) as cantidad_compras,
        SUM(v.total) as total_gastado,
        MAX(v.fecha) as ultima_compra,
        AVG(v.total) as ticket_promedio
      FROM cliente c
      JOIN venta v ON c.id_cliente = v.id_cliente
      JOIN usuario u ON v.id_usuario = u.id_usuario
      WHERE u.id_tienda = $1
        AND v.fecha::date >= $2::date
        AND v.fecha::date <= $3::date
      GROUP BY c.id_cliente, c.nombre, c.apellido, c.documento, c.telefono, c.email
      ORDER BY total_gastado DESC
    `;
    
    const result = await pool.query(query, [userTiendaId, startDate, endDate]);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error en getCustomerReport:', error);
    res.status(500).json({ error: 'Error al obtener reporte de clientes' });
  }
};