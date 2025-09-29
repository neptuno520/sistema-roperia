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
    const minStock = parseInt(req.query.min) || 10;
    const products = await Inventory.getLowStockProducts(minStock);
    res.json(products);
  } catch (error) {
    console.error('Error getting low stock:', error);
    res.status(500).json({ error: 'Error al obtener productos con stock bajo' });
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
    const stats = await Inventory.getInventoryStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

export const getProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const stock = await Inventory.getCurrentStock(productId);
    res.json({ stock });
  } catch (error) {
    console.error('Error getting product stock:', error);
    res.status(500).json({ error: 'Error al obtener stock del producto' });
  }
};