import { Sale } from '../models/Sale.js';

export const createSale = async (req, res) => {
  try {
    const saleData = {
      ...req.body,
      id_usuario: req.user.id,  // ID del usuario autenticado
      id_tienda: 1  // Por ahora tienda fija, luego podemos hacerlo dinámico
    };
    
    const sale = await Sale.create(saleData);
    res.status(201).json(sale);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Error al procesar la venta' });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.getAll();
    res.json(sales);
  } catch (error) {
    console.error('Error getting sales:', error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.getById(id);
    
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