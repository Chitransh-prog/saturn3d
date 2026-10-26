import { Router } from 'express';
import { body } from 'express-validator';
import * as ordersController from '../controllers/ordersController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router: Router = Router();

// POST /api/orders/webhook — must be BEFORE authenticate (raw body needed)
router.post('/webhook', ordersController.stripeWebhook);

// All routes below require auth
router.use(authenticate);

// POST /api/orders/checkout — creates order with Razorpay, COD, or Stripe
router.post(
  '/checkout',
  [
    body('items').isArray({ min: 1 }).withMessage('Cart items are required'),
    body('items.*.productId').notEmpty().withMessage('Product ID required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validateRequest,
  ordersController.createCheckout
);

// POST /api/orders/verify-razorpay — HMAC signature check & payment completion
router.post(
  '/verify-razorpay',
  [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('razorpay_payment_id').notEmpty().withMessage('Razorpay payment ID is required'),
  ],
  validateRequest,
  ordersController.verifyRazorpayPayment
);

// GET /api/orders/verify-session/:sessionId (Stripe fallback)
router.get('/verify-session/:sessionId', ordersController.verifyStripeSession);

// GET /api/orders
router.get('/', ordersController.getUserOrders);

// GET /api/orders/:id/invoice — Printable tax invoice
router.get('/:id/invoice', ordersController.getOrderInvoice);

// GET /api/orders/:id
router.get('/:id', ordersController.getOrderById);

export default router;
