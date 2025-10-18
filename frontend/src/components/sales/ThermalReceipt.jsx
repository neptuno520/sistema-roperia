// frontend/src/components/sales/ThermalReceipt.jsx
import React, { useRef } from 'react';

const ThermalReceipt = ({ sale, companyInfo, onClose }) => {
  const receiptRef = useRef();
  
  // Configuración de empresa (puedes moverlo a un archivo de config)
  const company = companyInfo || {
    name: 'FACCILAN S.A.',
    ruc: '80012345-1',
    address: 'Av. Principal 123',
    city: 'Ciudad del Este',
    phone: '(061) 123-456',
    timbrado: '12345678',
    timbradoVencimiento: '31/12/2024',
    facturaNro: `001-001-${String(sale.id_venta).padStart(7, '0')}`
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PY', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-PY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalIVA10 = 0;
    let totalIVA5 = 0;
    let totalExento = 0;

    sale.detalles.forEach(item => {
      const itemTotal = item.cantidad * item.precio_unitario;
      
      if (item.iva === 10) {
        const baseImponible = itemTotal / 1.1;
        totalIVA10 += itemTotal - baseImponible;
        subtotal += baseImponible;
      } else if (item.iva === 5) {
        const baseImponible = itemTotal / 1.05;
        totalIVA5 += itemTotal - baseImponible;
        subtotal += baseImponible;
      } else {
        totalExento += itemTotal;
        subtotal += itemTotal;
      }
    });

    return {
      subtotal,
      totalIVA10,
      totalIVA5,
      totalExento,
      totalIVA: totalIVA10 + totalIVA5,
      total: subtotal + totalIVA10 + totalIVA5
    };
  };

  const totals = calculateTotals();

  const handlePrint = () => {
    const printContent = receiptRef.current.innerHTML;
    const printWindow = window.open('', '_blank', 'width=302,height=600');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Boleta - ${company.facturaNro}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.3;
            margin: 0;
            padding: 5mm;
            width: 70mm;
          }
          .header {
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 5px;
            margin-bottom: 5px;
          }
          .company-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 3px;
          }
          .info-line {
            font-size: 10px;
            margin: 2px 0;
          }
          .section {
            margin: 8px 0;
            border-bottom: 1px dashed #000;
            padding-bottom: 5px;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
            font-size: 11px;
          }
          .item-desc {
            flex: 1;
          }
          .item-qty {
            width: 30px;
            text-align: center;
          }
          .item-price {
            width: 60px;
            text-align: right;
          }
          .item-total {
            width: 70px;
            text-align: right;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }
          .total-label {
            font-weight: normal;
          }
          .total-amount {
            text-align: right;
            min-width: 80px;
          }
          .grand-total {
            font-size: 14px;
            font-weight: bold;
            border-top: 1px solid #000;
            border-bottom: 3px double #000;
            padding: 5px 0;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 10px;
            font-size: 10px;
          }
          .barcode {
            text-align: center;
            font-family: 'Libre Barcode 39', monospace;
            font-size: 32px;
            margin: 10px 0;
          }
          @media print {
            body { margin: 0; padding: 2mm; }
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        {/* Cabecera del modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Vista Previa - Boleta</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Contenido de la boleta */}
        <div className="p-4 bg-gray-50">
          <div 
            ref={receiptRef} 
            className="bg-white p-4 font-mono text-xs"
            style={{ width: '280px', margin: '0 auto' }}
          >
            {/* Encabezado */}
            <div className="text-center border-b border-dashed border-gray-400 pb-2 mb-2">
              <div className="font-bold text-sm">{company.name}</div>
              <div className="text-xs">RUC: {company.ruc}</div>
              <div className="text-xs">{company.address}</div>
              <div className="text-xs">{company.city}</div>
              <div className="text-xs">Tel: {company.phone}</div>
              <div className="text-xs mt-1">
                Timbrado: {company.timbrado}
              </div>
              <div className="text-xs">
                Vence: {company.timbradoVencimiento}
              </div>
            </div>

            {/* Número de factura */}
            <div className="text-center font-bold my-2">
              FACTURA {company.facturaNro}
            </div>

            {/* Información de la venta */}
            <div className="border-b border-dashed border-gray-400 pb-2 mb-2">
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span>{formatDate(sale.fecha)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cliente:</span>
                <span>{sale.cliente_nombre || 'Consumidor Final'}</span>
              </div>
              {sale.cliente_documento && (
                <div className="flex justify-between">
                  <span>RUC/CI:</span>
                  <span>{sale.cliente_documento}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Vendedor:</span>
                <span>{sale.usuario_nombre}</span>
              </div>
              <div className="flex justify-between">
                <span>Cond.Venta:</span>
                <span>CONTADO</span>
              </div>
            </div>

            {/* Detalles de productos */}
            <div className="border-b border-dashed border-gray-400 pb-2 mb-2">
              <div className="flex justify-between font-bold text-xs mb-1">
                <span className="flex-1">Descripción</span>
                <span className="w-8 text-center">Cant</span>
                <span className="w-16 text-right">P.Unit</span>
                <span className="w-16 text-right">Total</span>
              </div>
              
              {sale.detalles.map((item, index) => (
                <div key={index} className="mb-1">
                  <div className="text-xs">{item.producto_nombre}</div>
                  <div className="flex justify-between text-xs">
                    <span className="flex-1">
                      {item.color && item.talla && `${item.color} - ${item.talla}`}
                    </span>
                    <span className="w-8 text-center">{item.cantidad}</span>
                    <span className="w-16 text-right">
                      {formatCurrency(item.precio_unitario)}
                    </span>
                    <span className="w-16 text-right">
                      {formatCurrency(item.cantidad * item.precio_unitario)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Gs. {formatCurrency(totals.subtotal)}</span>
              </div>
              
              {totals.totalExento > 0 && (
                <div className="flex justify-between">
                  <span>Exento:</span>
                  <span>Gs. {formatCurrency(totals.totalExento)}</span>
                </div>
              )}
              
              {totals.totalIVA5 > 0 && (
                <div className="flex justify-between">
                  <span>IVA 5%:</span>
                  <span>Gs. {formatCurrency(totals.totalIVA5)}</span>
                </div>
              )}
              
              {totals.totalIVA10 > 0 && (
                <div className="flex justify-between">
                  <span>IVA 10%:</span>
                  <span>Gs. {formatCurrency(totals.totalIVA10)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-sm border-t border-double border-gray-800 pt-2">
                <span>TOTAL:</span>
                <span>Gs. {formatCurrency(sale.total)}</span>
              </div>
            </div>

            {/* Liquidación del IVA */}
            <div className="mt-3 pt-2 border-t border-dashed border-gray-400 text-xs">
              <div className="text-center font-bold mb-1">LIQUIDACIÓN DEL IVA</div>
              <div className="flex justify-between">
                <span>(5%):</span>
                <span>Gs. {formatCurrency(totals.totalIVA5)}</span>
              </div>
              <div className="flex justify-between">
                <span>(10%):</span>
                <span>Gs. {formatCurrency(totals.totalIVA10)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>TOTAL IVA:</span>
                <span>Gs. {formatCurrency(totals.totalIVA)}</span>
              </div>
            </div>

            {/* Código de barras (simulado) */}
            <div className="text-center my-3">
              <div className="text-xs">||||| |||| | |||| ||||| |||||</div>
              <div className="text-xs">{company.facturaNro}</div>
            </div>

            {/* Pie de página */}
            <div className="text-center border-t border-dashed border-gray-400 pt-2 mt-2">
              <div className="text-xs font-bold">¡GRACIAS POR SU COMPRA!</div>
              <div className="text-xs mt-1">
                Original: Cliente | Duplicado: Archivo Tributario
              </div>
              <div className="text-xs mt-1">
                Sistema de Gestión FACCILAN
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            🖨️ Imprimir Boleta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThermalReceipt;