import { useState, useEffect } from 'react';

function App() {
  const [backendStatus, setBackendStatus] = useState('🔴 Probando conexión...');
  const [products, setProducts] = useState([]);

  // Probar conexión con el backend
  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        const data = await response.json();
        setBackendStatus('✅ Backend conectado');
        
        // Cargar productos de prueba
        const productsResponse = await fetch('http://localhost:5000/api/products/test');
        const productsData = await productsResponse.json();
        setProducts(productsData.products);
      } catch (error) {
        setBackendStatus('❌ Error conectando al backend');
      }
    };

    testBackend();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🛍️ Sistema de Tienda de Ropa
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Estado del Sistema - Prueba Completa
          </p>
          <div className={`inline-block px-4 py-2 rounded-full ${
            backendStatus.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {backendStatus}
          </div>
        </div>

        {/* Sistema Status */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow">
            <h3 className="font-semibold text-gray-800">Frontend</h3>
            <p className="text-green-600 text-sm">React + Vite + Tailwind</p>
            <span className="text-2xl">✅</span>
          </div>
          
          <div className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow">
            <h3 className="font-semibold text-gray-800">Hot Reload</h3>
            <p className="text-green-600 text-sm">HMR Activo</p>
            <span className="text-2xl">⚡</span>
          </div>
          
          <div className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow">
            <h3 className="font-semibold text-gray-800">Estilos</h3>
            <p className="text-green-600 text-sm">Tailwind CSS</p>
            <span className="text-2xl">🎨</span>
          </div>
          
          <div className={`bg-white border-l-4 rounded-lg p-6 shadow ${
            backendStatus.includes('✅') ? 'border-green-500' : 'border-yellow-500'
          }`}>
            <h3 className="font-semibold text-gray-800">Backend</h3>
            <p className={backendStatus.includes('✅') ? 'text-green-600' : 'text-yellow-600'}>
              {backendStatus.includes('✅') ? 'Express Conectado' : 'Conectando...'}
            </p>
            <span className="text-2xl">{backendStatus.includes('✅') ? '🚀' : '⏳'}</span>
          </div>
        </div>

        {/* Productos de Prueba desde Backend */}
        {products.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 Productos de Prueba (Desde Backend)</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-blue-600 font-medium">${product.price.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;