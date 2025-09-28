import API from './api.js';

export const productAPI = {
  // Obtener todos los productos
  getProducts: () => API.get('/products'),
  
  // Obtener producto por ID
  getProductById: (id) => API.get(`/products/${id}`),
  
  // Crear nuevo producto
  createProduct: (productData) => API.post('/products', productData),
  
  // Actualizar producto
  updateProduct: (id, productData) => API.put(`/products/${id}`, productData),
  
  // Eliminar producto
  deleteProduct: (id) => API.delete(`/products/${id}`),
  
  // Obtener categorías
  getCategories: () => API.get('/products/categories')
};