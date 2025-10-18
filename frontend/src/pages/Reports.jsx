// src/pages/Reports.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SalesReport from '../components/reports/SalesReport';
import PurchasesReport from '../components/reports/PurchasesReport';
import SalesByCategory from '../components/reports/SalesByCategory';

const Reports = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sales');

  const tabs = [
    { id: 'sales', label: 'Ventas', icon: '📊' },
    { id: 'purchases', label: 'Compras', icon: '📦', adminOnly: true },
    { id: 'categories', label: 'Por Categoría', icon: '📋' }
  ];

  const renderReport = () => {
    switch(activeTab) {
      case 'sales':
        return <SalesReport />;
      case 'purchases':
        return <PurchasesReport />;
      case 'categories':
        return <SalesByCategory />;
      default:
        return <SalesReport />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Volver al Dashboard
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="flex">
            {tabs.map(tab => {
              // Si la pestaña es solo para admin y el usuario no es admin, no mostrar
              if (tab.adminOnly && user?.id_rol !== 1) return null;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 focus:outline-none ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderReport()}
      </main>
    </div>
  );
};

export default Reports;