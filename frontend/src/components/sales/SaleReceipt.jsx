import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const SaleReceipt = ({ sale, onClose }) => {
  console.log('🎯 SaleReceipt renderizado con:', sale);
  const receiptRef = useRef();
  const [loading, setLoading] = useState(false);
  
  const generatePDF = async () => {
    if (!receiptRef.current) return;

    try {
      setLoading(true);
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`venta_${sale.id_venta}.pdf`);
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateLineTotal = (item) => {
    const subtotal = item.precio_unitario * item.cantidad;
    const ivaAmount = subtotal * (item.iva / 100);
    return subtotal + ivaAmount;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
    style={{ zIndex: 99999 }}
  >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Comprobante de Venta</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div ref={receiptRef} className="p-8 bg-white">
          <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900">MI TIENDA</h1>
            <p className="text-gray-600">RUC: 80012345-1</p>
            <p className="text-gray-600">Av. Principal 123, Ciudad del Este</p>
            <p className="text-gray-600">Tel: (061) 123-456</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <p><strong>N° Venta:</strong> {sale.id_venta}</p>
              <p><strong>Fecha:</strong> {new Date(sale.fecha).toLocaleString('es-PY')}</p>
              <p><strong>Vendedor:</strong> {sale.usuario_nombre}</p>
            </div>
            <div className="space-y-2">
              <p><strong>Cliente:</strong> {sale.cliente_nombre} {sale.cliente_apellido}</p>
              <p><strong>Método Pago:</strong> {sale.metodo_pago}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Detalles de la Venta</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Producto</th>
                  <th className="border border-gray-300 p-3 text-center">Cant.</th>
                  <th className="border border-gray-300 p-3 text-right">P. Unit.</th>
                  <th className="border border-gray-300 p-3 text-right">IVA %</th>
                  <th className="border border-gray-300 p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.detalles.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 p-3">{item.producto_nombre}</td>
                    <td className="border border-gray-300 p-3 text-center">{item.cantidad}</td>
                    <td className="border border-gray-300 p-3 text-right">
                      Gs. {parseFloat(item.precio_unitario).toLocaleString('es-PY')}
                    </td>
                    <td className="border border-gray-300 p-3 text-right">{item.iva}%</td>
                    <td className="border border-gray-300 p-3 text-right">
                      Gs. {calculateLineTotal(item).toLocaleString('es-PY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="flex justify-between text-xl font-bold border-t-2 border-gray-300 pt-4">
                <span>TOTAL:</span>
                <span className="text-green-600">Gs. {parseFloat(sale.total).toLocaleString('es-PY')}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 border-t pt-6">
            <p className="text-lg mb-2">¡Gracias por su compra!</p>
            <p>Conserve este comprobante</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            Imprimir
          </button>
          <button
            onClick={generatePDF}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleReceipt;