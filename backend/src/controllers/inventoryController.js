import { Inventory } from '../models/Inventory.js';

export const getMovements = async (req, res) => {
  try {
    const movements = await Inventory.getMovements(req.query);
    res.json(movements);
  } catch (error) {
    console.error('Error getting movements:', error);
    res.status(500).json({ error: 'Error al obtener movimientos' });
  }
};

export const getLowStock = async (req, res) => {
  try {
    const { minStock = 10 } = req.query;
    const userTiendaId = req.user.id_tienda; // ← FILTRAR POR TIENDA
    const products = await Inventory.getLowStockProducts(minStock, userTiendaId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const adjustStock = async (req, res) => {
  try {
    const adjustment = await Inventory.registerManualAdjustment({
      ...req.body,
      id_usuario: req.user.id
    });
    res.status(201).json(adjustment);
  } catch (error) {
    console.error('Error adjusting stock:', error);
    res.status(500).json({ error: 'Error al ajustar inventario' });
  }
};

export const getStats = async (req, res) => {
  try {
    const userTiendaId = req.user.id_tienda; // ← FILTRAR POR TIENDA
    const stats = await Inventory.getInventoryStats(userTiendaId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const userTiendaId = req.user.id_tienda; // ← OBTENER TIENDA DEL USUARIO
    
    const stock = await Inventory.getProductStock(productId, userTiendaId);
    
    if (!stock) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};