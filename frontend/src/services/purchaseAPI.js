import API from './api.js';

export const purchaseAPI = {
  // Obtener todos los proveedores - CORREGIDO
  getProviders: () => API.get('/proveedores'),
  
  // Obtener proveedor por ID
  getProviderById: (id) => API.get(`/proveedores/${id}`),
  
  // Crear nueva compra - CORREGIDO
  createPurchase: (purchaseData) => API.post('/compras', purchaseData),
  
  // Obtener todas las compras - CORREGIDO
  getPurchases: () => API.get('/compras'),
  
  // Obtener compra por ID
  getPurchaseById: (id) => API.get(`/compras/${id}`),
  
  // Actualizar compra
  updatePurchase: (id, purchaseData) => API.put(`/compras/${id}`, purchaseData),
  
  // Eliminar compra
  deletePurchase: (id) => API.delete(`/compras/${id}`)
};