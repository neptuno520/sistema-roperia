import React from 'react';

const SaleCart = ({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
    const iva = cartItems.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad * item.iva / 100), 0);
    const total = subtotal + iva;

    return { subtotal, iva, total };
  };

  const { subtotal, iva, total } = calculateTotals();

  if (cartItems.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">El carrito está vacío</p>
        <p className="text-yellow-600 text-sm mt-1">Agrega productos para comenzar una venta</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Carrito de Venta</h3>
        <button
          onClick={onClearCart}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Vaciar Carrito
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {cartItems.map((item) => (
          <div key={item.id_producto} className="px-6 py-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.nombre}</h4>
                <p className="text-sm text-gray-500">
                  {item.color} - {item.talla} | {formatPrice(item.precio_unitario)} c/u
                </p>
                <p className="text-xs text-gray-400">IVA: {item.iva}%</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id_producto, item.cantidad - 1)}
                    disabled={item.cantidad <= 1}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.cantidad}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id_producto, item.cantidad + 1)}
                    disabled={item.cantidad >= item.stock_disponible}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right min-w-20">
                  <p className="font-medium text-gray-900">
                    {formatPrice(item.precio_unitario * item.cantidad)}
                  </p>
                </div>
                
                <button
                  onClick={() => onRemoveItem(item.id_producto)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {item.cantidad >= item.stock_disponible && (
              <p className="text-xs text-red-600 mt-1">
                Stock máximo: {item.stock_disponible} unidades
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>IVA:</span>
            <span>{formatPrice(iva)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
            <span>Total:</span>
            <span className="text-green-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleCart;