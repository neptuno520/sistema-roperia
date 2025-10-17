// backend/src/middleware/validators.js
import { body, validationResult } from 'express-validator';

export const validateProduct = [
  body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
  body('precio').isFloat({ min: 0 }).withMessage('Precio debe ser positivo'),
  body('stock').isInt({ min: 0 }).withMessage('Stock debe ser entero positivo'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];