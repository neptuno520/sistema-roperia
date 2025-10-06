import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { purchaseAPI, productAPI } from '../services';

const Purchases = () => {
  const { user } = useAuth();
  
  // Estados
  const [providers, setProviders] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [estado, setEstado] = useState('pendiente');

  useEffect(() => {
    if (user?.id_rol === 1) {
      loadData();
      loadPurchases();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [providersRes, productsRes] = await Promise.all([
        purchaseAPI.getProviders(),
        productAPI.getProducts()
      ]);
      setProviders(providersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadPurchases = async () => {
    try {
      const purchasesRes = await purchaseAPI.getPurchases();
      setPurchases(purchasesRes.data);
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
  };

  const handleAddItem = (product) => {
    const existingItem = purchaseItems.find(item => 
      item.id_producto === product.id_producto
    );

    if (existingItem) {
      setPurchaseItems(prev =>
        prev.map(item =>
          item.id_producto === product.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setPurchaseItems(prev => [...prev, {
        id_producto: product.id_producto,
        nombre: product.nombre,
        cantidad: 1,
        precio_unitario: product.precio_compra || product.precio * 0.7,
        talla: product.talla,
        color: product.color
      }]);
    }
  };

  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    setPurchaseItems(prev =>
      prev.map(item =>
        item.id_producto === productId
          ? { ...item, cantidad: newQuantity }
          : item
      )
    );
  };

  const updateItemPrice = (productId, newPrice) => {
    setPurchaseItems(prev =>
      prev.map(item =>
        item.id_producto === productId
          ? { ...item, precio_unitario: parseFloat(newPrice) }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setPurchaseItems(prev =>
      prev.filter(item => item.id_producto !== productId)
    );
  };

  const calculateTotal = () => {
    return purchaseItems.reduce((sum, item) =>
      sum + (item.cantidad * item.precio_unitario), 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProvider || purchaseItems.length === 0) {
      alert('Selecciona un proveedor y agrega productos');
      return;
    }

    try {
      setLoading(true);
      await purchaseAPI.createPurchase({
        id_proveedor: parseInt(selectedProvider),
        id_usuario: user.id_usuario, // Se envía automáticamente el usuario logueado
        fecha: fecha,
        items: purchaseItems,
        total: calculateTotal(),
        estado: estado
      });
      
      alert('Compra registrada exitosamente');
      setPurchaseItems([]);
      setSelectedProvider('');
      setFecha(new Date().toISOString().split('T')[0]);
      setEstado('pendiente');
      setShowForm(false);
      loadPurchases(); // Recargar la lista de compras
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPurchaseItems([]);
    setSelectedProvider('');
    setFecha(new Date().toISOString().split('T')[0]);
    setEstado('pendiente');
    setShowForm(false);
  };

  if (user?.id_rol !== 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
          <p>No tienes permisos para acceder a este módulo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Módulo de Compras</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          + Nueva Compra
        </button>
      </div>

      {/* Lista de Compras Existentes */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Historial de Compras</h2>
          {purchases.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay compras registradas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Proveedor</th>
                    <th className="px-4 py-2 text-left">Fecha</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map(purchase => (
                    <tr key={purchase.id_compra} className="border-b">
                      <td className="px-4 py-2">{purchase.id_compra}</td>
                      <td className="px-4 py-2">{purchase.proveedor_nombre}</td>
                      <td className="px-4 py-2">{purchase.fecha}</td>
                      <td className="px-4 py-2">${purchase.total}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          purchase.estado === 'completada' ? 'bg-green-100 text-green-800' :
                          purchase.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {purchase.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de Nueva Compra (solo se muestra al hacer clic en el botón) */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Nueva Compra</h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Campos principales de la compra */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block mb-2 font-medium">Proveedor *</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Seleccionar proveedor</option>
                  {providers.map(p => (
                    <option key={p.id_proveedor} value={p.id_proveedor}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Fecha *</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Estado</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            {/* Sección de productos */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Agregar Productos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto p-3 border rounded">
                {products.map(product => (
                  <div key={product.id_producto} className="flex justify-between items-center p-2 border-b">
                    <div className="flex-1">
                      <h4 className="font-medium">{product.nombre}</h4>
                      <p className="text-sm text-gray-600">
                        {product.talla} - {product.color} - Stock: {product.stock}
                      </p>
                      <p className="text-sm">Precio: ${product.precio}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddItem(product)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 ml-2"
                    >
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Items agregados a la compra */}
            {purchaseItems.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Productos en la compra:</h3>
                <div className="space-y-3">
                  {purchaseItems.map((item, index) => (
                    <div key={index} className="border p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.nombre}</h4>
                          <p className="text-sm text-gray-600">
                            {item.talla} - {item.color}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id_producto)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕ Eliminar
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm">Cantidad</label>
                          <input
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) => updateItemQuantity(item.id_producto, parseInt(e.target.value))}
                            className="w-full border px-2 py-1 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm">Precio Unitario</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.precio_unitario}
                            onChange={(e) => updateItemPrice(item.id_producto, e.target.value)}
                            className="w-full border px-2 py-1 rounded text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm font-medium">
                        Subtotal: ${(item.cantidad * item.precio_unitario).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total de la Compra:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !selectedProvider || purchaseItems.length === 0}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Registrar Compra'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Purchases;