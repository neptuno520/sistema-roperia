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
          {/* Card 1 - Información del Usuario */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Información del Usuario</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Rol:</strong> {user?.rol}</p>
            <p><strong>Tienda:</strong> {user?.tienda}</p>
          </div>

          {/* Card 2 - Módulos Principales */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Módulos Principales</h3>
            <div className="space-y-2">
              {/* Solo Administrador puede gestionar productos */}
              {user?.id_rol === 1 && (
                <button 
                  onClick={() => navigate('/products')}
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  📦 Gestionar Productos
                </button>
              )}
              
              {/* Administrador y Vendedor pueden ver ventas */}
              {(user?.id_rol === 1 || user?.id_rol === 2) && (
                <button 
                  onClick={() => navigate('/sales')}
                  className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
                >
                  🛒 Nueva Venta
                </button>
              )}
              
              {/* Administrador e Inventario pueden ver inventario */}
              {(user?.id_rol === 1 || user?.id_rol === 3) && (
                <button 
                  onClick={() => navigate('/inventory')}
                  className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                >
                  📊 Gestión de Inventario
                </button>
              )}
              
              {/* Solo Administrador puede gestionar compras */}
              {user?.id_rol === 1 && (
                <button 
                  onClick={() => navigate('/purchases')}
                  className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
                >
                  📥 Gestión de Compras
                </button>
              )}
            </div>
          </div>

          {/* Card 3 - Reportes y Análisis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Reportes y Análisis</h3>
            <div className="space-y-2">
              {/* Todos pueden ver reportes de ventas */}
              {(user?.id_rol === 1 || user?.id_rol === 2 || user?.id_rol === 3) && (
                <button 
                  onClick={() => navigate('/reports')}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  📈 Ver Reportes
                </button>
              )}
              
              {/* Botones específicos de reportes rápidos */}
              {(user?.id_rol === 1 || user?.id_rol === 2) && (
                <>
                  <button 
                    onClick={() => navigate('/reports?tab=sales')}
                    className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
                  >
                    💰 Reporte de Ventas
                  </button>
                  
                  <button 
                    onClick={() => navigate('/reports?tab=categories')}
                    className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600"
                  >
                    📋 Ventas por Categoría
                  </button>
                </>
              )}
              
              {/* Solo administrador ve reporte de compras */}
              {user?.id_rol === 1 && (
                <button 
                  onClick={() => navigate('/reports?tab=purchases')}
                  className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  📦 Reporte de Compras
                </button>
              )}
            </div>
          </div>

          {/* Card 4 - Estadísticas Rápidas (ocupando todo el ancho) */}
          <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Estadísticas Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">--</div>
                <div className="text-sm text-gray-600">Ventas Hoy</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">--</div>
                <div className="text-sm text-gray-600">Productos</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600">--</div>
                <div className="text-sm text-gray-600">Stock Bajo</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">--</div>
                <div className="text-sm text-gray-600">Clientes</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Las estadísticas en tiempo real estarán disponibles próximamente
            </p>
          </div>
        </div>

        {/* Accesos Rápidos adicionales */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Accesos Rápidos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(user?.id_rol === 1 || user?.id_rol === 2) && (
              <button
                onClick={() => navigate('/sales')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="text-2xl mb-2">➕</div>
                <div className="text-sm font-medium">Nueva Venta</div>
              </button>
            )}
            
            {user?.id_rol === 1 && (
              <button
                onClick={() => navigate('/products')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="text-2xl mb-2">📦</div>
                <div className="text-sm font-medium">Agregar Producto</div>
              </button>
            )}
            
            {(user?.id_rol === 1 || user?.id_rol === 3) && (
              <button
                onClick={() => navigate('/inventory')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium">Ver Inventario</div>
              </button>
            )}
            
            <button
              onClick={() => navigate('/reports')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-medium">Ver Reportes</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;