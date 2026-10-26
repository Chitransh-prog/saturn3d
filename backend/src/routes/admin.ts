import { Router } from 'express';
import { body } from 'express-validator';
import * as adminController from '../controllers/adminController.js';
import * as bulkOrdersController from '../controllers/bulkOrdersController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router: Router = Router();



// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// ---- BULK ORDERS ----
// Move this up to ensure it's caught
router.get('/bulk-orders', bulkOrdersController.getAllBulkOrders);

// ---- DASHBOARD ----
router.get('/stats', adminController.adminGetStats);

// ---- PRODUCTS ----
router.get('/products', adminController.adminGetProducts);

router.post(
  '/products',
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('image').trim().notEmpty().withMessage('Image URL is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  validateRequest,
  adminController.adminCreateProduct
);

router.put(
  '/products/:id',
  [
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  validateRequest,
  adminController.adminUpdateProduct
);

router.delete('/products/:id', adminController.adminDeleteProduct);

// ---- ORDERS ----
router.get('/orders', adminController.adminGetOrders);
router.patch('/orders/:id/status', adminController.adminUpdateOrderStatus);
router.post('/orders/:id/refund', adminController.adminRefundOrder);

// ---- USERS ----
router.get('/users', adminController.adminGetUsers);
router.patch('/users/:id/block', adminController.adminToggleUserBlock);

// ---- AUDIT LOGS ----
router.get('/audit-logs', adminController.adminGetAuditLogs);

// ---- STORE SETTINGS ----
router.get('/settings', adminController.adminGetSettings);
router.put('/settings', adminController.adminUpdateSettings);

export default router;
