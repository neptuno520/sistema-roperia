import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
<<<<<<< Updated upstream
import productRoutes from './routes/productRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
=======
>>>>>>> Stashed changes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
<<<<<<< Updated upstream
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/inventory', inventoryRoutes);
=======
>>>>>>> Stashed changes

// Ruta de verificación de servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'Servidor funcionando', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de autenticación en http://localhost:${PORT}`);
});