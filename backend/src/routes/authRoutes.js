<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
import express from 'express';
import { login, verifyToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', authenticateToken, verifyToken);

<<<<<<< Updated upstream
export default router;
=======
export default router;
>>>>>>> Stashed changes
