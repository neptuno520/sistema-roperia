import { Product } from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    console.log('[DEBUG] req.user completo:', req.user);
    console.log('[DEBUG] req.user.id_tienda:', req.user?.id_tienda);
    console.log('[DEBUG] Headers authorization:', req.headers.authorization);
    
    // Verificar si el middleware auth está funcionando
    if (!req.user || !req.user.id_tienda) {
      console.log('[DEBUG] NO hay user o id_tienda en request');
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    
    const userTiendaId = req.user.id_tienda;
    console.log('[DEBUG] Tienda ID obtenida:', userTiendaId);
    
    const products = await Product.getAll(userTiendaId);
    
    console.log('[DEBUG] Productos devueltos:', products.length);
    
    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

export const createProduct = async (req, res) => {
  try {
    // Crear producto en la tabla producto
    const product = await Product.create(req.body);

    // Crear inventario para la tienda del usuario (si hay stock inicial)
    const tiendaId = req.user?.id_tienda;
    const stockInicial = req.body.stock ?? 0;
    if (tiendaId && product?.id_producto) {
      await Product.createInventory(tiendaId, product.id_producto, stockInicial);
    }

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.update(id, req.body);

    // Actualizar inventario si se modificó el stock
    const tiendaId = req.user?.id_tienda;
    const nuevoStock = req.body.stock;
    const id_producto = product?.id_producto || id;
    if (tiendaId && nuevoStock !== undefined && id_producto) {
      await Product.updateInventory(tiendaId, id_producto, nuevoStock);
    }

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.delete(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};