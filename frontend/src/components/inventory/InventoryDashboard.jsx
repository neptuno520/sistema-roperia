import React from 'react';

const InventoryDashboard = ({ stats, lowStockProducts, loading }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-PY').format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  // Función para obtener el stock a mostrar
  const getDisplayStock = (product) => {
    return product.stock_disponible ?? product.stock;
  };

  // Función para determinar el color según el stock
  const getStockColor = (stock) => {
    if (stock <= 0) return 'text-red-600';
    if (stock <= 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <span className="text-blue-600 text-xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.total_productos)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <span className="text-green-600 text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.total_stock)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <span className="text-purple-600 text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.valor_total)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <span className="text-yellow-600 text-xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.stock_bajo)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3">
              <span className="text-red-600 text-xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sin Stock</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.sin_stock)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de Stock Bajo */}
      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="text-yellow-600 text-xl mr-2">⚠️</span>
            <h3 className="text-lg font-semibold text-yellow-800">
              Alertas de Stock Bajo ({lowStockProducts.length} productos)
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.slice(0, 6).map(product => {
              const displayStock = getDisplayStock(product);
              return (
                <div key={product.id_producto} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{product.nombre}</h4>
                      <p className="text-sm text-gray-500">{product.categoria_nombre}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      displayStock === 0 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {displayStock} unidades
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Stock mínimo recomendado: 10 unidades
                  </p>
                </div>
              );
            })}
          </div>

          {lowStockProducts.length > 6 && (
            <p className="text-sm text-yellow-700 mt-4 text-center">
              +{lowStockProducts.length - 6} productos más con stock bajo
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;