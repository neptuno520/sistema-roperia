import { Purchase } from '../models/Purchase.js';

export const createPurchase = async (req, res) => {
  try {
    // Verificar que el usuario sea administrador
    if (req.user.id_rol !== 1) {
      return res.status(403).json({ error: 'No tienes permisos para realizar compras' });
    }

    const purchaseData = {
      ...req.body,
      id_usuario: req.user.id
    };
    
    const purchase = await Purchase.create(purchaseData);
    res.status(201).json({ success: true, compra: purchase });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
};

export const getPurchases = async (req, res) => {
  try {
    if (req.user.id_rol !== 1) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }
    
    const purchases = await Purchase.getAll();
    res.json(purchases);
  } catch (error) {
    console.error('Error getting purchases:', error);
    res.status(500).json({ error: 'Error al obtener compras' });
  }
};

export const getPurchaseById = async (req, res) => {
  try {
    if (req.user.id_rol !== 1) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }
    
    const { id } = req.params;
    const purchase = await Purchase.getById(id);
    
    if (!purchase.compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    
    res.json(purchase);
  } catch (error) {
    console.error('Error getting purchase:', error);
    res.status(500).json({ error: 'Error al obtener compra' });
  }
};

export const getProviders = async (req, res) => {
  try {
    if (req.user.id_rol !== 1) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }
    
    const providers = await Purchase.getProviders();
    res.json(providers);
  } catch (error) {
    console.error('Error getting providers:', error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
};