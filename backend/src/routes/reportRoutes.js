// backend/src/routes/reportRoutes.js (corrección del nombre del archivo)
import express from 'express';
import { 
  getSalesReport, 
  getPurchasesReport, 
  getSalesByCategory, 
  getSalesSummary, 
  getSalesByPaymentMethod,
  getInventoryReport,
  getTopProducts,
  getCustomerReport
} from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/sales', getSalesReport);
router.get('/purchases', getPurchasesReport);
router.get('/sales-by-category', getSalesByCategory);
router.get('/sales-summary', getSalesSummary);
router.get('/sales-by-payment', getSalesByPaymentMethod);
router.get('/inventory', getInventoryReport);
router.get('/top-products', getTopProducts);
router.get('/customers', getCustomerReport);

export default router;