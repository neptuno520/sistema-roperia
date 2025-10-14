import { Sale } from '../models/Sale.js';
import pool from '../config/database.js';

export const createSale = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id_cliente, items, metodo_pago, total } = req.body;
    
    // 1. Crear la venta principal
    const saleResult = await client.query(
      `INSERT INTO venta (id_cliente, id_usuario, total, estado) 
       VALUES ($1, $2, $3, true) 
       RETURNING *`,
      [id_cliente || null, req.user.id, total]
    );

    const venta = saleResult.rows[0];
    const id_venta = venta.id_venta;

    // 2. Insertar detalles de venta y actualizar inventario
    for (const item of items) {
      // Insertar detalle de venta
      await client.query(
        `INSERT INTO detalleventa (id_venta, id_producto, cantidad, precio_unitario, iva) 
         VALUES ($1, $2, $3, $4, $5)`,
        [id_venta, item.id_producto, item.cantidad, item.precio_unitario, item.iva || 0]
      );

      // Actualizar inventario (restar stock)
      await client.query(
        `UPDATE inventario 
         SET stock_disponible = stock_disponible - $1 
         WHERE id_producto = $2 AND id_tienda = $3`,
        [item.cantidad, item.id_producto, req.user.id_tienda]
      );

      // Actualizar stock general del producto
      await client.query(
        `UPDATE producto SET stock = stock - $1 WHERE id_producto = $2`,
        [item.cantidad, item.id_producto]
      );

      // Registrar movimiento de stock
      await client.query(
        `INSERT INTO movimientostock (id_tipo, id_producto, id_tienda, id_venta, cantidad) 
         VALUES (2, $1, $2, $3, $4)`, // Tipo 2 = Venta a cliente
        [item.id_producto, req.user.id_tienda, id_venta, -item.cantidad]
      );
    }

    // 3. Registrar pago
    await client.query(
      `INSERT INTO pago (id_venta, id_metodo, monto) 
       VALUES ($1, $2, $3)`,
      [id_venta, metodo_pago, total]
    );

    await client.query('COMMIT');

    // 4. Obtener datos completos para el comprobante
    const saleWithDetails = await getSaleDetails(id_venta, req.user.id_tienda);
    
    res.status(201).json({
      ...saleWithDetails,
      message: 'Venta registrada exitosamente'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Error al procesar la venta: ' + error.message });
  } finally {
    client.release();
  }
};

// Función auxiliar para obtener detalles completos de la venta
const getSaleDetails = async (id_venta, id_tienda) => {
  // Obtener datos principales de la venta
  const saleResult = await pool.query(`
    SELECT 
      v.*,
      c.nombre as cliente_nombre,
      c.apellido as cliente_apellido,
      u.nombre as usuario_nombre,
      t.nombre as tienda_nombre,
      mp.nombre as metodo_pago_nombre
    FROM venta v
    LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
    JOIN usuario u ON v.id_usuario = u.id_usuario
    JOIN tienda t ON u.id_tienda = t.id_tienda
    JOIN pago p ON v.id_venta = p.id_venta
    JOIN metodopago mp ON p.id_metodo = mp.id_metodo
    WHERE v.id_venta = $1
  `, [id_venta]);

  // Obtener detalles de los productos vendidos
  const detailsResult = await pool.query(`
    SELECT 
      dv.*,
      p.nombre as producto_nombre,
      p.codigo_barras,
      p.color,
      p.talla,
      cat.nombre as categoria_nombre
    FROM detalleventa dv
    JOIN producto p ON dv.id_producto = p.id_producto
    JOIN categoriaproducto cat ON p.id_categoria = cat.id_categoria
    WHERE dv.id_venta = $1
  `, [id_venta]);

  const venta = saleResult.rows[0];
  const detalles = detailsResult.rows;

  return {
    id_venta: venta.id_venta,
    fecha: venta.fecha,
    total: venta.total,
    cliente_nombre: venta.cliente_nombre ? 
      `${venta.cliente_nombre} ${venta.cliente_apellido}` : 
      'Consumidor Final',
    usuario_nombre: venta.usuario_nombre,
    tienda_nombre: venta.tienda_nombre,
    metodo_pago: venta.metodo_pago_nombre,
    detalles: detalles.map(detalle => ({
      producto_nombre: detalle.producto_nombre,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
      iva: detalle.iva,
      subtotal: detalle.precio_unitario * detalle.cantidad,
      color: detalle.color,
      talla: detalle.talla,
      categoria: detalle.categoria_nombre
    }))
  };
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.getAll(req.user.id_tienda); // Filtrar por tienda
    res.json(sales);
  } catch (error) {
    console.error('Error getting sales:', error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.getById(id, req.user.id_tienda); // Filtrar por tienda
    
    if (!sale.venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    
    res.json(sale);
  } catch (error) {
    console.error('Error getting sale:', error);
    res.status(500).json({ error: 'Error al obtener venta' });
  }
};

export const getPaymentMethods = async (req, res) => {
  try {
    const methods = await Sale.getPaymentMethods();
    res.json(methods);
  } catch (error) {
    console.error('Error getting payment methods:', error);
    res.status(500).json({ error: 'Error al obtener métodos de pago' });
  }
};

export const getClients = async (req, res) => {
  try {
    const clients = await Sale.getClients();
    res.json(clients);
  } catch (error) {
    console.error('Error getting clients:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};