import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'saturn-secret-change-in-production-2026';

const extractToken = (req: AuthRequest): string | null => {
  // 1. Check httpOnly cookie
  if (req.cookies?.access_token) {
    return req.cookies.access_token;
  }

  // 2. Fallback to Authorization: Bearer <token> header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
};

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin access required' });
    return;
  }

  next();
};

export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
  } catch {
    // Token invalid — proceed without user
  }

  next();
};
