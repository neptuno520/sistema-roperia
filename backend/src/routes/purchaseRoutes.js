import express from 'express';
import { 
  createPurchase, 
  getPurchases, 
  getPurchaseById,
  getProviders
} from '../controllers/purchaseController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createPurchase);
router.get('/', getPurchases);
router.get('/providers', getProviders);
router.get('/:id', getPurchaseById);

export default router;