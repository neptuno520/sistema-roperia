import API from './api.js';

export const saleAPI = {
  // Crear nueva venta
  createSale: (saleData) => API.post('/sales', saleData),
  
  // Obtener todas las ventas
  getSales: () => API.get('/sales'),
  
  // Obtener venta por ID
  getSaleById: (id) => API.get(`/sales/${id}`),
  
  // Obtener métodos de pago
  getPaymentMethods: () => API.get('/sales/methods'),
  
  // Obtener clientes
  getClients: () => API.get('/sales/clients')
};