import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router: Router = Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ],
  validateRequest,
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  authController.login
);

// POST /api/auth/refresh — rotate refresh token & issue new access token
router.post('/refresh', authController.refreshTokens);

// GET /api/auth/me
router.get('/me', authenticate, authController.getMe);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// POST /api/auth/logout-all
router.post('/logout-all', authenticate, authController.logoutAll);

// PATCH /api/auth/profile
router.patch('/profile', authenticate, authController.updateProfile);

export default router;
