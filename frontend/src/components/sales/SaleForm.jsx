import React, { useState, useEffect } from 'react';
import { saleAPI } from '../../services/saleAPI';
import ProductSearch from './ProductSearch';
import ClientSearch from './ClientSearch'; // Importamos el nuevo componente
import SaleCart from './SaleCart';
import ThermalReceipt from './ThermalReceipt';
import toast from 'react-hot-toast';

import SaleReceipt from './SaleReceipt';

import SaleConfirmation from './SaleConfirmation'; // Nuevo componente

const SaleForm = ({ onSaleComplete }) => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null); // Cambiado a null
  const [selectedPayment, setSelectedPayment] = useState('');
  const [loading, setLoading] = useState(false);

  const [saleCompleted, setSaleCompleted] = useState(false);
  const [saleData, setSaleData] = useState(null);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methodsRes = await saleAPI.getPaymentMethods();
        setPaymentMethods(methodsRes.data);
      } catch (error) {
        console.error('Error loading payment methods:', error);
      }
    };
    loadPaymentMethods();
  }, []);

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id_producto === product.id_producto);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], cantidad: product.cantidad };
        return updated;
      } else {
        return [...prev, product];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev =>
      prev.map(item =>
        item.id_producto === productId
          ? { ...item, cantidad: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.id_producto !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const iva = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad * (item.iva || 0) / 100), 0);
    const total = subtotal + iva;

    return { subtotal, iva, total };
  };

  // Función para imprimir comprobante
  const handlePrintReceipt = () => {
    const receiptElement = document.getElementById('receipt');
    if (!receiptElement) {
      console.error('No se encontró el elemento del comprobante');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=600,height=700');
    
    // Crear el contenido HTML de forma segura
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprobante de Venta - Moda Express</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0;
              padding: 20px;
              color: #000;
              background: white;
            }
            .receipt { 
              max-width: 400px; 
              margin: 0 auto;
              border: 1px solid #000;
              padding: 20px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .document-type {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .product-row { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 8px;
              font-size: 14px;
              border-bottom: 1px dashed #ccc;
              padding-bottom: 5px;
            }
            .product-name {
              flex: 2;
            }
            .product-price {
              flex: 1;
              text-align: right;
            }
            .totals { 
              border-top: 2px solid #000; 
              padding-top: 10px;
              margin-top: 15px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .grand-total {
              font-weight: bold;
              font-size: 18px;
            }
            .footer { 
              text-align: center; 
              margin-top: 20px;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .no-print { display: none !important; }
              .receipt { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${receiptElement.innerHTML}
          </div>
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">🖨️ Imprimir</button>
            <button onclick="window.close()" style="padding: 10px 20px; margin: 5px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">❌ Cerrar</button>
          </div>
          <script>
            // Auto-imprimir si se desea
            // window.print();
          </script>
        </body>
      </html>
    `;

    // Usar document.write de forma segura
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Enfocar la ventana
    printWindow.focus();
  };

  // Nueva función para procesar venta con confirmación
  const handleSubmitSale = async () => {
  if (cartItems.length === 0) {
    toast.error('Agrega productos al carrito antes de realizar la venta');
    return;
  }

  if (!selectedPayment) {
    toast.error('Selecciona un método de pago');
    return;
  }

  const { total } = calculateTotals();

  try {
    setLoading(true);
    
    const saleData = {
      id_cliente: selectedClient ? selectedClient.id_cliente : null,
      items: cartItems.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: parseFloat(item.precio_unitario),
        iva: parseFloat(item.iva || 0)
      })),
      metodo_pago: parseInt(selectedPayment),
      total: parseFloat(total.toFixed(2))
    };

    const response = await saleAPI.createSale(saleData);
    
    const clienteSeleccionado = selectedClient;
    
    const metodoPagoSeleccionado = paymentMethods.find(
      m => m.id_metodo === parseInt(selectedPayment)
    );
    
    const ventaId = response.data?.venta?.id_venta || response.data?.id_venta || 1;
    
    const completedSaleData = {
      id_venta: ventaId,
      fecha: new Date(),
      total: total,
      usuario_nombre: 'Vendedor',
      cliente_nombre: clienteSeleccionado?.nombre || 'Cliente',
      cliente_apellido: clienteSeleccionado?.apellido || 'General',
      metodo_pago: metodoPagoSeleccionado?.nombre || 'N/A',
      detalles: cartItems.map(item => ({
        producto_nombre: item.nombre || 'Producto',
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        iva: item.iva || 0
      }))
    };
    
    // Actualizar estados después de una venta exitosa
    setSaleData(completedSaleData);
    setSaleCompleted(true);
    
    // Limpiar el formulario
    setCartItems([]);
    setSelectedClient(null);
    setSelectedPayment('');
    
    if (onSaleComplete) {
      onSaleComplete(completedSaleData);
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al procesar la venta: ' + (error.response?.data?.error || error.message));
  } finally {
    setLoading(false);
  }
};


  // Función para nueva venta
  const handleNewSale = () => {
    setSaleCompleted(false);
    setSaleData(null);
    setCartItems([]);
    setSelectedClient(null);
    setSelectedPayment('');
  };



  const { subtotal, iva, total } = calculateTotals();

  // Si la venta está completada, mostrar confirmación
  if (saleCompleted && saleData) {
    return (
      <SaleConfirmation
        saleData={saleData}
        onPrint={handlePrintReceipt}
        onNewSale={handleNewSale}
      />
    );
  }

  // Formulario normal de venta
  return (
    <div className="max-w-6xl mx-auto p-6">
      {saleCompleted && saleData && (
        <ThermalReceipt 
          sale={saleData} 
          onClose={() => {
            setSaleCompleted(false);
            setSaleData(null);
          }}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nueva Venta</h1>
        <p className="text-gray-600">Procesa una nueva venta en el sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Buscar Productos</h2>
            <ProductSearch 
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
            />
          </div>

          <SaleCart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <ClientSearch 
              onClientSelect={setSelectedClient}
              selectedClient={selectedClient}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Método de Pago *</h2>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(method => (
                <label key={method.id_metodo} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id_metodo}
                    checked={selectedPayment === method.id_metodo.toString()}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{method.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Resumen de Venta</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Gs. {subtotal.toLocaleString('es-PY')}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA:</span>
                <span>Gs. {iva.toLocaleString('es-PY')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">Gs. {total.toLocaleString('es-PY')}</span>
              </div>
            </div>

            <button
              onClick={handleSubmitSale}
              disabled={loading || cartItems.length === 0 || !selectedPayment}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Procesando Venta...' : `Procesar Venta - Gs. ${total.toLocaleString('es-PY')}`}
            </button>

            {(cartItems.length === 0 || !selectedPayment) && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {cartItems.length === 0 && 'Agrega productos al carrito • '}
                {!selectedPayment && 'Selecciona método de pago'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleForm;