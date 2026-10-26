import { Router } from 'express';
import { body } from 'express-validator';
import * as couponsController from '../controllers/couponsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router: Router = Router();

// Storefront: Server-side validation
router.post(
  '/validate',
  [
    body('code').trim().notEmpty().withMessage('Coupon code is required'),
    body('cartSubtotal').isFloat({ min: 0 }).withMessage('Cart subtotal must be a positive number'),
  ],
  validateRequest,
  couponsController.validateCoupon
);

// Admin routes (require auth + admin role)
router.get('/', authenticate, requireAdmin, couponsController.adminGetCoupons);

router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('code').trim().notEmpty().withMessage('Coupon code is required'),
    body('type').isIn(['percent', 'flat']).withMessage('Type must be percent or flat'),
    body('value').isFloat({ min: 0.01 }).withMessage('Value must be greater than 0'),
  ],
  validateRequest,
  couponsController.adminCreateCoupon
);

router.delete('/:id', authenticate, requireAdmin, couponsController.adminDeleteCoupon);

export default router;
