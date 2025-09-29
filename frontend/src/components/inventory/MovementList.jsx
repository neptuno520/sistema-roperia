import React from 'react';

const MovementList = ({ movements, loading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMovementColor = (cantidad) => {
    if (cantidad > 0) return 'text-green-600 bg-green-50 border-green-200';
    if (cantidad < 0) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getMovementIcon = (cantidad) => {
    if (cantidad > 0) return '⬆️';
    if (cantidad < 0) return '⬇️';
    return '➡️';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Cargando movimientos...</div>
      </div>
    );
  }

  if (movements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay movimientos registrados
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Historial de Movimientos</h3>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {movements.map(movement => (
          <div key={movement.id_movimiento} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getMovementColor(movement.cantidad)}`}>
                  <span className="text-sm">{getMovementIcon(movement.cantidad)}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{movement.producto_nombre}</h4>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{movement.descripcion_movimiento}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>Tienda: {movement.tienda_nombre}</span>
                    <span>•</span>
                    <span>Ref: {movement.referencia}</span>
                    <span>•</span>
                    <span>{formatDate(movement.fecha)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-semibold ${movement.cantidad > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {movement.cantidad > 0 ? '+' : ''}{movement.cantidad}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {movement.tipo_movimiento.toLowerCase()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovementList;