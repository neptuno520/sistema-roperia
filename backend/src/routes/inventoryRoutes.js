import express from 'express';
import { 
  getMovements, 
  getLowStock, 
  adjustStock, 
  getStats,
  getProductStock
} from '../controllers/inventoryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/movements', getMovements);
router.get('/low-stock', getLowStock);
router.get('/stats', getStats);
router.get('/product/:productId/stock', getProductStock);
router.post('/adjust', adjustStock);

export default router;