import { Router } from 'express';
import { body } from 'express-validator';
import * as bulkOrdersController from '../controllers/bulkOrdersController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router: Router = Router();

// POST /api/bulk-orders — accessible to everyone
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validateRequest,
  bulkOrdersController.submitBulkOrder
);

// Admin retrieval is actually handled in admin.ts routes to keep things clean
// but I'll add it here for completeness if needed, or just let admin.ts use the controller.

export default router;
