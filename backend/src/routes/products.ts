import { Router } from 'express';
import * as productsController from '../controllers/productsController.js';

const router: Router = Router();

// GET /api/products
router.get('/', productsController.getProducts);

// GET /api/products/categories
router.get('/categories', productsController.getCategories);

// GET /api/products/:id
router.get('/:id', productsController.getProductById);

export default router;
