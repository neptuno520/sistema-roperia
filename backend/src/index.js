import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba simple
app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ Backend funcionando',
    message: 'Conexión exitosa con el frontend',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Ruta para probar con el frontend
app.get('/api/products/test', (req, res) => {
  res.json({
    products: [
      { id: 1, name: "Camiseta Básica", price: 25000, stock: 15 },
      { id: 2, name: "Jeans Clásico", price: 45000, stock: 8 },
      { id: 3, name: "Zapatos Deportivos", price: 89000, stock: 5 }
    ],
    message: "Datos de prueba para el módulo de productos"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});