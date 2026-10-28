import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'saturn3d_hyper_secure_jwt_secret_key_2026_precision';
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

/**
 * Sign JWT Token with user payload
 */
export function signJwtToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT Token
 */
export function verifyJwtToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Extract auth token from Request (Bearer header or cookie)
 */
export function getTokenFromRequest(req: Request | NextRequest): string | null {
  // 1. Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Check Cookie
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const c of cookies) {
      if (c.startsWith('saturn3d_token=')) {
        return decodeURIComponent(c.substring('saturn3d_token='.length));
      }
    }
  }

  return null;
}

/**
 * Get current authenticated user from request
 */
export function getAuthUser(req: Request | NextRequest): TokenPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyJwtToken(token);
}

/**
 * Helper to attach JWT cookie to a NextResponse
 */
export function attachAuthCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set('saturn3d_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

/**
 * Helper to clear JWT cookie from a NextResponse
 */
export function clearAuthCookie(res: NextResponse): NextResponse {
  res.cookies.set('saturn3d_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
