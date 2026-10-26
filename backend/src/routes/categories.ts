import { Router } from 'express';
import { body } from 'express-validator';
import * as categoriesController from '../controllers/categoriesController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router: Router = Router();

// Public: Get all categories
router.get('/', categoriesController.getCategories);

// Admin: Create & Delete
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
  ],
  validateRequest,
  categoriesController.adminCreateCategory
);

router.delete('/:id', authenticate, requireAdmin, categoriesController.adminDeleteCategory);

export default router;
