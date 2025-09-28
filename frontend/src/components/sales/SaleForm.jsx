import React, { useState, useEffect } from 'react';
import { saleAPI } from '../../services/saleAPI';
import ProductSearch from './ProductSearch';
import SaleCart from './SaleCart';

const SaleForm = ({ onSaleComplete }) => {
  const [cartItems, setCartItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [loading, setLoading] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState(false);

  useEffect(() => {
    loadClientsAndMethods();
  }, []);

  const loadClientsAndMethods = async () => {
    try {
      const [clientsRes, methodsRes] = await Promise.all([
        saleAPI.getClients(),
        saleAPI.getPaymentMethods()
      ]);
      setClients(clientsRes.data);
      setPaymentMethods(methodsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id_producto === product.id_producto);
      
      if (existingIndex >= 0) {
        // Actualizar cantidad
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], cantidad: product.cantidad };
        return updated;
      } else {
        // Agregar nuevo item
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
    const subtotal = cartItems.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
    const iva = cartItems.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad * item.iva / 100), 0);
    const total = subtotal + iva;

    return { subtotal, iva, total };
  };

  const handleSubmitSale = async () => {
    if (cartItems.length === 0) {
      alert('Agrega productos al carrito antes de realizar la venta');
      return;
    }

    if (!selectedPayment) {
      alert('Selecciona un método de pago');
      return;
    }

    const { total } = calculateTotals();

    try {
      setLoading(true);
      
      const saleData = {
        id_cliente: selectedClient || null,
        items: cartItems.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          iva: item.iva
        })),
        metodo_pago: parseInt(selectedPayment),
        total: total
      };

      await saleAPI.createSale(saleData);
      
      setSaleSuccess(true);
      setCartItems([]);
      setSelectedClient('');
      setSelectedPayment('');
      
      if (onSaleComplete) {
        onSaleComplete();
      }
      
      setTimeout(() => setSaleSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Error al procesar la venta: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, iva, total } = calculateTotals();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nueva Venta</h1>
        <p className="text-gray-600">Procesa una nueva venta en el sistema</p>
      </div>

      {saleSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">✅ Venta procesada exitosamente</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna Izquierda - Búsqueda y Carrito */}
        <div className="space-y-6">
          {/* Búsqueda de Productos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Buscar Productos</h2>
            <ProductSearch 
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
            />
          </div>

          {/* Carrito */}
          <SaleCart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        </div>

        {/* Columna Derecha - Información de Venta */}
        <div className="space-y-6">
          {/* Información del Cliente */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Información del Cliente</h2>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Cliente general (Venta mostrador)</option>
              {clients.map(client => (
                <option key={client.id_cliente} value={client.id_cliente}>
                  {client.nombre} {client.apellido} - {client.documento}
                </option>
              ))}
            </select>
          </div>

          {/* Método de Pago */}
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

          {/* Resumen y Acción */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Resumen de Venta</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA:</span>
                <span>${iva.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleSubmitSale}
              disabled={loading || cartItems.length === 0 || !selectedPayment}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Procesando Venta...' : `Procesar Venta - $${total.toLocaleString()}`}
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