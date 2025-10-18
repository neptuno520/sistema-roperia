import React, { useState, useEffect } from 'react';
import { productAPI } from '../../services/productAPI';
import { inventoryAPI } from '../../services/inventoryAPI';
import toast from 'react-hot-toast';

const AdjustmentForm = ({ onAdjustmentComplete }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [currentStock, setCurrentStock] = useState(0);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      loadProductStock(selectedProduct);
    }
  }, [selectedProduct]);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await productAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setProductsLoading(false);
    }
  };

  const loadProductStock = async (productId) => {
    try {
      const response = await inventoryAPI.getProductStock(productId);
      // Usar stock_disponible si está disponible, sino usar stock
      const stock = response.data.stock_disponible ?? response.data.stock;
      setCurrentStock(stock);
    } catch (error) {
      console.error('Error loading product stock:', error);
      setCurrentStock(0);
    }
  };

  // Función para determinar color del stock
  const getStockColor = (stock) => {
    if (stock <= 0) return 'text-red-600 bg-red-50 border-red-200';
    if (stock <= 10) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct || !cantidad || !motivo) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (parseInt(cantidad) === 0) {
      toast.error('La cantidad no puede ser cero');
      return;
    }

    const adjustmentData = {
      id_producto: parseInt(selectedProduct),
      id_tienda: 1, // Por ahora tienda fija
      cantidad: parseInt(cantidad),
      motivo: motivo
    };

    try {
      setLoading(true);
      await inventoryAPI.adjustStock(adjustmentData);
      
      // Limpiar formulario
      setSelectedProduct('');
      setCantidad('');
      setMotivo('');
      setCurrentStock(0);
      
      toast.success('Ajuste de inventario registrado exitosamente');
      
      if (onAdjustmentComplete) {
        onAdjustmentComplete();
      }
      
    } catch (error) {
      console.error('Error adjusting stock:', error);
      toast.error('Error al registrar el ajuste: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getNewStock = () => {
    if (!cantidad || currentStock === undefined) return currentStock;
    return currentStock + parseInt(cantidad);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Ajuste Manual de Inventario</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selección de Producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producto *
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={productsLoading}
            >
              <option value="">Seleccionar producto</option>
              {products.map(product => (
                <option key={product.id_producto} value={product.id_producto}>
                  {product.nombre} - {product.color} ({product.talla})
                </option>
              ))}
            </select>
            {productsLoading && (
              <p className="text-sm text-gray-500 mt-1">Cargando productos...</p>
            )}
          </div>

          {/* Stock Actual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Actual
            </label>
            <div className={`p-3 border rounded-md ${getStockColor(currentStock)}`}>
              {selectedProduct ? (
                <div className="flex justify-between items-center">
                  <span className="font-medium">{currentStock} unidades</span>
                  {currentStock <= 10 && currentStock > 0 && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⚠️ Stock bajo
                    </span>
                  )}
                  {currentStock === 0 && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      ❌ Sin stock
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-gray-500">Selecciona un producto</span>
              )}
            </div>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad *
            </label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: +5 o -3"
                required
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setCantidad('5')}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => setCantidad('-3')}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                >
                  -3
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Positivo para entrada, negativo para salida
            </p>
          </div>

          {/* Stock Resultante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Resultante
            </label>
            <div className={`p-3 border rounded-md ${getStockColor(getNewStock())}`}>
              {selectedProduct && cantidad ? (
                <div className="flex justify-between items-center">
                  <span className="font-medium">{getNewStock()} unidades</span>
                  <span className={`text-sm ${parseInt(cantidad) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseInt(cantidad) > 0 ? '↗️' : '↘️'} {parseInt(cantidad) > 0 ? 'Aumentará' : 'Disminuirá'}
                  </span>
                </div>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </div>
          </div>
        </div>

        {/* Motivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo del Ajuste *
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Ajuste por conteo físico, merma, donación, etc."
            required
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setSelectedProduct('');
              setCantidad('');
              setMotivo('');
              setCurrentStock(0);
            }}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={loading || !selectedProduct || !cantidad || !motivo}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Registrar Ajuste'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdjustmentForm;