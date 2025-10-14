import { Sale } from '../models/Sale.js';
import pool from '../config/database.js';

export const createSale = async (req, res) => {
  const client = await pool.connect();
  
  try {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    console.log('\n🔹 ========== INICIANDO PROCESO DE VENTA ==========');
    console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
    console.log('👤 Usuario autenticado:', req.user);
    
    // Validaciones básicas
    if (!req.body.items || req.body.items.length === 0) {
      console.log('❌ Error: No hay productos');
      return res.status(400).json({ error: 'No hay productos en la venta' });
    }
    
    if (!req.body.metodo_pago) {
      console.log('❌ Error: No hay método de pago');
      return res.status(400).json({ error: 'Método de pago requerido' });
    }

    // Verificar que el usuario existe
    console.log('\n🔍 Verificando usuario...');
    const userCheck = await client.query(
      'SELECT id_usuario, nombre FROM usuario WHERE id_usuario = $1',
      [req.user.id]
    );
    
    if (userCheck.rows.length === 0) {
      console.log(`❌ Usuario ${req.user.id} no existe`);
      return res.status(400).json({ 
        error: `Usuario ID ${req.user.id} no existe en la base de datos`,
        sugerencia: 'Verifica que el token de autenticación sea válido'
      });
    }
    console.log('✅ Usuario encontrado:', userCheck.rows[0].nombre);

    // Verificar que el método de pago existe
    console.log('\n🔍 Verificando método de pago...');
    const metodoPagoCheck = await client.query(
      'SELECT id_metodo, nombre FROM metodopago WHERE id_metodo = $1',
      [parseInt(req.body.metodo_pago)]
    );
    
    if (metodoPagoCheck.rows.length === 0) {
      console.log(`❌ Método de pago ${req.body.metodo_pago} no existe`);
      
      // Mostrar métodos disponibles
      const metodosDisponibles = await client.query('SELECT * FROM metodopago');
      console.log('📋 Métodos disponibles:', metodosDisponibles.rows);
      
      return res.status(400).json({ 
        error: `Método de pago ID ${req.body.metodo_pago} no existe`,
        metodosDisponibles: metodosDisponibles.rows
      });
    }
    console.log('✅ Método de pago encontrado:', metodoPagoCheck.rows[0].nombre);

    // Verificar cliente si se proporciona
    if (req.body.id_cliente) {
      console.log('\n🔍 Verificando cliente...');
      const clienteCheck = await client.query(
        'SELECT id_cliente, nombre, apellido FROM cliente WHERE id_cliente = $1',
        [parseInt(req.body.id_cliente)]
      );
      
      if (clienteCheck.rows.length === 0) {
        console.log(`❌ Cliente ${req.body.id_cliente} no existe`);
        return res.status(400).json({ 
          error: `Cliente ID ${req.body.id_cliente} no existe`
        });
      }
      console.log('✅ Cliente encontrado:', clienteCheck.rows[0].nombre, clienteCheck.rows[0].apellido);
    } else {
      console.log('ℹ️ Venta sin cliente (venta mostrador)');
    }

    // Verificar productos y stock
    console.log('\n🔍 Verificando productos...');
    for (const item of req.body.items) {
      const prodId = item.id_producto || item.id;
      
      const productoCheck = await client.query(
        'SELECT id_producto, nombre, stock, precio FROM producto WHERE id_producto = $1',
        [prodId]
      );
      
      if (productoCheck.rows.length === 0) {
        console.log(`❌ Producto ${prodId} no existe`);
        return res.status(400).json({ 
          error: `Producto ID ${prodId} no existe en la base de datos`
        });
      }
      
      const producto = productoCheck.rows[0];
      console.log(`✅ Producto: ${producto.nombre} | Stock: ${producto.stock} | Solicitado: ${item.cantidad}`);
      
      if (producto.stock < item.cantidad) {
        console.log(`❌ Stock insuficiente para ${producto.nombre}`);
        return res.status(400).json({ 
          error: `Stock insuficiente para ${producto.nombre}`,
          disponible: producto.stock,
          solicitado: item.cantidad
        });
      }
    }

    // Verificar tipo de movimiento
    console.log('\n🔍 Verificando tipo de movimiento...');
    const tipoMovCheck = await client.query(
      'SELECT * FROM tipomovimiento WHERE id_tipo = 2'
    );
    
    if (tipoMovCheck.rows.length === 0) {
      console.log('❌ Tipo de movimiento 2 (Salida) no existe');
      return res.status(400).json({ 
        error: 'Tipo de movimiento de salida no configurado',
        sugerencia: 'Ejecuta: INSERT INTO tipomovimiento (id_tipo, nombre) VALUES (2, \'Salida\')'
      });
    }
    console.log('✅ Tipo de movimiento encontrado');

    // Preparar datos para inserción
    const saleData = {
      id_cliente: req.body.id_cliente ? parseInt(req.body.id_cliente) : null,
      id_usuario: req.user.id,
      total: parseFloat(req.body.total),
      id_tienda: req.body.id_tienda || 1,
      items: req.body.items.map(item => ({
        id_producto: item.id_producto || item.id,
        cantidad: parseInt(item.cantidad),
        precio_unitario: parseFloat(item.precio_unitario || item.precio),
        iva: parseFloat(item.iva || 0)
      })),
      metodo_pago: parseInt(req.body.metodo_pago)
    };
    
    console.log('\n📝 Datos finales a insertar:', JSON.stringify(saleData, null, 2));
    console.log('\n💾 Insertando venta en la base de datos...');
    
    const sale = await Sale.create(saleData);
    
    console.log('✅ ¡VENTA CREADA EXITOSAMENTE!');
    console.log('🎉 ID de venta:', sale.id_venta);
    console.log('🔹 ========== FIN DEL PROCESO ==========\n');
    
    res.status(201).json({ 
      success: true,
      message: 'Venta registrada exitosamente',
      venta: sale 
    });
    
  } catch (error) {
    console.error('\n❌ ========== ERROR EN LA VENTA ==========');
    console.error('Tipo de error:', error.name);
    console.error('Mensaje:', error.message);
    console.error('Código PostgreSQL:', error.code);
    console.error('Detalle:', error.detail);
    console.error('Constraint:', error.constraint);
    console.error('Stack completo:', error.stack);
    console.error('========================================\n');
    
    let errorMessage = 'Error al procesar la venta';
    let errorDetails = {};
    
    if (error.code === '23503') {
      errorMessage = 'Error de clave foránea';
      errorDetails = {
        constraint: error.constraint,
        detail: error.detail,
        sugerencia: 'Uno de los IDs no existe en la base de datos'
      };
    } else if (error.code === '23514') {
      errorMessage = 'Error de restricción de validación';
      errorDetails = {
        detail: error.detail
      };
    } else if (error.code === '23505') {
      errorMessage = 'Error de duplicación';
      errorDetails = {
        detail: error.detail
      };
    }
    
    res.status(500).json({ 
      error: errorMessage,
      detalle: error.message,
      codigo: error.code,
      ...errorDetails
    });
=======
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
>>>>>>> Stashed changes
=======
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
>>>>>>> Stashed changes
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