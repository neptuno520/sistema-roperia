// components/sales/SaleConfirmation.jsx
import React from 'react';

const SaleConfirmation = ({ saleData, onPrint, onNewSale }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header de éxito */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Venta Exitosa!
          </h1>
          <p className="text-gray-600 text-lg">
            La venta se ha procesado correctamente
          </p>
        </div>

        {/* Comprobante */}
        <div id="receipt" className="bg-white border-2 border-gray-300 p-8 rounded-lg shadow-lg mb-8">
          {/* Encabezado */}
          <div className="text-center mb-8 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Moda Express</h2>
            <p className="text-gray-600">Tienda de Ropa y Accesorios</p>
            <p className="text-sm text-gray-500 font-semibold mt-1">COMPROBANTE DE VENTA</p>
          </div>

          {/* Información de la venta */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span className="font-semibold">N° Venta:</span> #{saleData.id_venta}
            </div>
            <div>
              <span className="font-semibold">Fecha:</span> {formatDate(saleData.fecha)}
            </div>
            <div>
              <span className="font-semibold">Cliente:</span> {saleData.cliente_nombre}
            </div>
            <div>
              <span className="font-semibold">Vendedor:</span> {saleData.usuario_nombre}
            </div>
          </div>

          {/* Detalles de productos */}
          <div className="mb-6">
            <h4 className="font-semibold border-b pb-2 mb-4 text-gray-800">Productos Vendidos</h4>
            <div className="space-y-3">
              {saleData.detalles?.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.producto_nombre}</div>
                    <div className="text-gray-500 text-xs mt-1">
                      {item.cantidad} x {formatCurrency(item.precio_unitario)}
                      {item.iva > 0 && ` (IVA ${item.iva}%)`}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(item.precio_unitario * item.cantidad)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>{formatCurrency(saleData.total)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>TOTAL:</span>
              <span className="text-green-600">{formatCurrency(saleData.total)}</span>
            </div>
          </div>

          {/* Pie del comprobante */}
          <div className="text-center mt-8 pt-6 border-t text-xs text-gray-500">
            <p className="font-medium">¡Gracias por su compra!</p>
            <p>Moda Express - Sistema de Gestión</p>
            <p className="mt-1">Comprobante generado automáticamente</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onPrint}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center font-semibold transition"
          >
            <span className="mr-2">🖨️</span>
            Imprimir Comprobante
          </button>
          <button
            onClick={onNewSale}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
          >
            Nueva Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleConfirmation;