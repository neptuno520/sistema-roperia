import API from './api.js';

export const inventoryAPI = {
  // Obtener estadísticas
  getStats: () => API.get('/inventory/stats'),
  
  // Obtener movimientos
  getMovements: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return API.get(`/inventory/movements?${params.toString()}`);
  },
  
  // Obtener productos con stock bajo
  getLowStock: (minStock = 10) => API.get(`/inventory/low-stock?min=${minStock}`),
  
  // Obtener stock de un producto
  getProductStock: (productId) => API.get(`/inventory/product/${productId}/stock`),
  
  // Ajustar stock manualmente
  adjustStock: (adjustmentData) => API.post('/inventory/adjust', adjustmentData)
};