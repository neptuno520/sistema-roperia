import API from './api.js';

export const purchaseAPI = {
  // Obtener todos los proveedores - CORREGIDO para tu estructura de rutas
  getProviders: () => API.get('/purchases/providers'),
  
  // Crear nueva compra - CORREGIDO
  createPurchase: (purchaseData) => API.post('/purchases', purchaseData),
  
  // Obtener todas las compras - CORREGIDO
  getPurchases: () => API.get('/purchases'),
  
  // Obtener compra por ID - CORREGIDO
  getPurchaseById: (id) => API.get(`/purchases/${id}`)
};