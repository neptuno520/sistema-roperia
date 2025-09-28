import React, { useState, useEffect } from 'react';
import { productAPI } from '../../services/productAPI';

const ProductSearch = ({ onAddToCart, cartItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo_barras?.includes(searchTerm)
      );
      setFilteredProducts(filtered.slice(0, 5)); // Mostrar máximo 5 resultados
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id_producto === product.id_producto);
    
    if (existingItem) {
      // Si ya está en el carrito, aumentar cantidad
      onAddToCart({
        ...product,
        cantidad: existingItem.cantidad + 1
      });
    } else {
      // Si no está, agregar nuevo item
      onAddToCart({
        ...product,
        cantidad: 1,
        precio_unitario: product.precio,
        stock_disponible: product.stock
      });
    }
    
    setSearchTerm('');
    setFilteredProducts([]);
  };

  const getCartQuantity = (productId) => {
    const item = cartItems.find(item => item.id_producto === productId);
    return item ? item.cantidad : 0;
  };

  return (
    <div className="relative">
      <div className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar producto por nombre o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setSearchTerm('')}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Limpiar
        </button>
      </div>

      {/* Resultados de búsqueda */}
      {filteredProducts.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredProducts.map((product) => {
            const inCartQuantity = getCartQuantity(product.id_producto);
            const availableStock = product.stock - inCartQuantity;
            
            return (
              <div
                key={product.id_producto}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => availableStock > 0 && handleAddToCart(product)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{product.nombre}</p>
                    <p className="text-sm text-gray-500">
                      {product.color} - {product.talla} | 
                      Stock: {product.stock} | 
                      ${product.precio.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    {inCartQuantity > 0 && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-1">
                        En carrito: {inCartQuantity}
                      </span>
                    )}
                    <button
                      disabled={availableStock <= 0}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        availableStock > 0
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {availableStock > 0 ? 'Agregar' : 'Sin stock'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading && (
        <p className="text-gray-500 text-sm mt-2">Buscando productos...</p>
      )}
    </div>
  );
};

export default ProductSearch;