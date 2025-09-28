import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Hola, {user?.nombre}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Información del Usuario</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Rol:</strong> {user?.rol}</p>
            <p><strong>Tienda:</strong> {user?.tienda}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Acciones Rápidas</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/products')}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Gestionar Productos
              </button>
              <button 
                onClick={() => navigate('/sales')}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Nueva Venta
              </button>
              <button className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600">
                Ver Inventario
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Estadísticas</h3>
            <p>Próximamente...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;