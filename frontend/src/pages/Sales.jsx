import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SaleForm from '../components/sales/SaleForm';

const Sales = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSaleComplete = () => {
    // Forzar refresh si necesitas actualizar algo después de una venta
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Módulo de Ventas</h1>
            <p className="text-gray-600">Procesa ventas rápidas y eficientes</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Vendedor: {user?.nombre}</span>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <SaleForm 
          key={refreshTrigger}
          onSaleComplete={handleSaleComplete} 
        />
      </main>
    </div>
  );
};

export default Sales;