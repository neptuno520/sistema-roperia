import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { inventoryAPI } from '../services/inventoryAPI';
import InventoryDashboard from '../components/inventory/InventoryDashboard';
import MovementList from '../components/inventory/MovementList';
import AdjustmentForm from '../components/inventory/AdjustmentForm';
import toast from 'react-hot-toast';

const Inventory = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [movements, setMovements] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadInventoryData();
  }, [refreshTrigger]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, movementsRes, lowStockRes] = await Promise.all([
        inventoryAPI.getStats(),
        inventoryAPI.getMovements(),
        inventoryAPI.getLowStock()
      ]);

      setStats(statsRes.data);
      setMovements(movementsRes.data);
      setLowStockProducts(lowStockRes.data);
      
    } catch (error) {
      console.error('Error loading inventory data:', error);
      toast.error('Error al cargar datos del inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAdjustmentComplete = () => {
    handleRefresh(); // Recargar datos después de un ajuste
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'movements', name: 'Movimientos', icon: '📝' },
    { id: 'adjust', name: 'Ajustes', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
            <p className="text-gray-600">
              {user?.rol === 'Inventario' ? 'Encargado de Inventario' : user?.nombre} - {user?.tienda}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center"
            >
              <span className="mr-2">🔄</span>
              Actualizar
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <InventoryDashboard 
            stats={stats}
            lowStockProducts={lowStockProducts}
            loading={loading}
          />
        )}

        {activeTab === 'movements' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Historial de Movimientos</h2>
              <div className="text-sm text-gray-500">
                {movements.length} movimientos registrados
              </div>
            </div>
            <MovementList 
              movements={movements}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'adjust' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Ajustes Manuales</h2>
              <div className="text-sm text-gray-500">
                Última actualización: {new Date().toLocaleDateString('es-PY')}
              </div>
            </div>
            <AdjustmentForm 
              onAdjustmentComplete={handleAdjustmentComplete}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Inventory;