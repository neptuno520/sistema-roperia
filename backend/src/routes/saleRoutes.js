import express from 'express';
import { 
  createSale, 
  getSales, 
  getSaleById, 
  getPaymentMethods, 
  getClients 
} from '../controllers/saleController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createSale);
router.get('/', getSales);
router.get('/methods', getPaymentMethods);
router.get('/clients', getClients);
router.get('/:id', getSaleById);

export default router;