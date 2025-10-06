import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
<<<<<<< Updated upstream
  console.log('🎯 App.jsx se está renderizando'); 
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sales" 
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            } 
          />                    
        </Routes>
      </BrowserRouter>
    </AuthProvider>
=======
  const [backendStatus, setBackendStatus] = useState('🔴 Probando conexión...');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Probar conexión con el backend
  useEffect(() => {
    // Función asíncrona dentro del useEffect
    const testBackend = async () => {
      try {
        setLoading(true);
        
        // Verificar conexión con el backend
  const response = await fetch('http://localhost:5000/api/health');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Verificar que la respuesta tenga contenido JSON
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Backend health response:', data);
        }
        
        setBackendStatus('✅ Backend conectado');
        
        // Cargar productos de prueba
  const productsResponse = await fetch('http://localhost:5000/api/products/test');
        
        if (!productsResponse.ok) {
          throw new Error(`Products API error! status: ${productsResponse.status}`);
        }
        
        // Verificar que la respuesta de productos tenga contenido JSON
        const productsContentType = productsResponse.headers.get('content-type');
        
        if (productsContentType && productsContentType.includes('application/json')) {
          const productsData = await productsResponse.json();
          console.log('Products response:', productsData);
          
          // Verificar que tenga la estructura esperada
          if (productsData && Array.isArray(productsData.products)) {
            setProducts(productsData.products);
          } else if (Array.isArray(productsData)) {
            setProducts(productsData);
          } else {
            console.warn('Estructura de productos inesperada:', productsData);
            setProducts([]);
          }
        } else {
          console.warn('Respuesta de productos no es JSON');
          setProducts([]);
        }
        
      } catch (error) {
        console.error('Error conectando al backend:', error.message);
        
        // Mensajes de error más específicos
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          setBackendStatus('❌ Backend no disponible - Verifica que esté ejecutándose');
        } else if (error.message.includes('HTTP error')) {
          setBackendStatus(`❌ Error del servidor: ${error.message}`);
        } else {
          setBackendStatus(`❌ Error: ${error.message}`);
        }
        
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Ejecutar la función asíncrona
    testBackend();
    
    // Opcional: Configurar un intervalo para verificar la conexión periódicamente
    const interval = setInterval(testBackend, 30000); // Cada 30 segundos
    
    // Cleanup function para limpiar el intervalo
    return () => clearInterval(interval);
  }, []); // Array de dependencias vacío para que solo se ejecute una vez

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧥 Sistema de Ropería Inteligente
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Gestión Integral de Inventario Textil
          </p>
          <div className={`inline-block px-4 py-2 rounded-full transition-colors ${
            backendStatus.includes('✅') ? 'bg-green-100 text-green-800' : 
            backendStatus.includes('🔴') ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {loading ? '⏳ Conectando...' : backendStatus}
          </div>
        </div>

        {/* Sistema Status */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800">Frontend</h3>
            <p className="text-green-600 text-sm">React + Vite + Tailwind</p>
            <span className="text-2xl">✅</span>
          </div>
          
          <div className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800">Hot Reload</h3>
            <p className="text-green-600 text-sm">HMR Activo</p>
            <span className="text-2xl">⚡</span>
          </div>
          
          <div className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800">Estilos</h3>
            <p className="text-green-600 text-sm">Tailwind CSS</p>
            <span className="text-2xl">🎨</span>
          </div>
          
          <div className={`bg-white border-l-4 rounded-lg p-6 shadow hover:shadow-md transition-shadow ${
            backendStatus.includes('✅') ? 'border-green-500' : 
            backendStatus.includes('🔴') ? 'border-yellow-500' :
            'border-red-500'
          }`}>
            <h3 className="font-semibold text-gray-800">Backend API</h3>
            <p className={`text-sm ${
              backendStatus.includes('✅') ? 'text-green-600' : 
              backendStatus.includes('🔴') ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {backendStatus.includes('✅') ? 'Express Conectado' : 
               backendStatus.includes('🔴') ? 'Conectando...' : 'Desconectado'}
            </p>
            <span className="text-2xl">
              {backendStatus.includes('✅') ? '🚀' : 
               backendStatus.includes('🔴') ? '⏳' : '❌'}
            </span>
          </div>
        </div>

        {/* Productos de Prueba desde Backend */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="grid md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🏷️ Inventario de Ropería (Desde Backend)
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-blue-600 font-medium text-lg">${product.price.toLocaleString()}</p>
                  <p className={`text-sm ${
                    product.stock > 10 ? 'text-green-600' : 
                    product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    Stock: {product.stock} {product.stock === 0 ? '⚠️' : '✅'}
                  </p>
                  {product.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                      {product.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-xl text-gray-600 mb-2">📦 Sin productos disponibles</h2>
            <p className="text-gray-500">Verifica que el backend esté ejecutándose correctamente</p>
          </div>
        )}

        {/* Footer con información técnica */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-4 text-center text-sm text-gray-600">
          <p>Sistema de Ropería - Desarrollado para gestión integral de inventario textil</p>
          <p className="text-xs mt-1">Puerto Backend: 5000 | Frontend: 3000</p>
        </div>

      </div>
    </div>
>>>>>>> Stashed changes
  );
}

export default App;