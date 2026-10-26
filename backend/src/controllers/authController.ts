import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AuthRequest, JwtPayload } from '../types/index.js';
import supabase from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'saturn-secret-change-in-production-2026';
const ACCESS_TOKEN_EXPIRY = '15m'; // Short-lived access token
const REFRESH_TOKEN_DAYS = 30; // 30-day rotating refresh token

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const generateAccessToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY } as jwt.SignOptions);
};

interface TokenSetResult {
  accessToken: string;
  refreshToken: string;
}

/**
 * Creates an access token and a rotating refresh token, hashes the refresh token,
 * stores it in Supabase, and sets httpOnly secure cookies.
 */
const issueTokenFamily = async (
  user: { id: string; email: string; role: 'user' | 'admin' },
  res: Response,
  existingFamilyId?: string
): Promise<TokenSetResult> => {
  const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });

  // Generate a random 64-character refresh token
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = hashToken(refreshToken);
  const familyId = existingFamilyId || crypto.randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  // Store refresh token hash in DB
  try {
    await supabase.from('refresh_tokens').insert({
      user_id: user.id,
      token_hash: tokenHash,
      family_id: familyId,
      expires_at: expiresAt.toISOString(),
      is_revoked: false,
    });
  } catch (err) {
    console.warn('[Auth] Note on refresh token persistence:', err);
  }

  // Set httpOnly, Secure, SameSite=Lax cookies
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 mins
    path: '/',
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    path: '/',
  });

  return { accessToken, refreshToken };
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
};

// POST /api/auth/register
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body as { email: string; password: string; name: string };

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingUser) {
      res.status(409).json({ success: false, error: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name.trim(),
        role: 'user',
        is_blocked: false,
      })
      .select('id, email, name, role, created_at')
      .single();

    if (error || !user) {
      console.error('[Auth] Register error:', error);
      res.status(500).json({ success: false, error: 'Failed to create account' });
      return;
    }

    const { accessToken, refreshToken } = await issueTokenFamily(user, res);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        token: accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (err) {
    console.error('[Auth] Register error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// POST /api/auth/login
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password, name, role, avatar_url, is_blocked')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !user) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    if (user.is_blocked) {
      res.status(403).json({ success: false, error: 'Your account has been suspended. Please contact support.' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const { accessToken, refreshToken } = await issueTokenFamily(user, res);

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token: accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar_url: user.avatar_url,
        },
      },
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// POST /api/auth/refresh — Rotating refresh token
export const refreshTokens = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const incomingToken = req.cookies?.refresh_token || req.body?.refreshToken;

    if (!incomingToken) {
      clearAuthCookies(res);
      res.status(401).json({ success: false, error: 'Refresh token required' });
      return;
    }

    const tokenHash = hashToken(incomingToken);

    // Look up token in DB
    const { data: storedToken, error } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .single();

    if (error || !storedToken) {
      clearAuthCookies(res);
      res.status(401).json({ success: false, error: 'Invalid refresh token' });
      return;
    }

    // Reuse detection: If token was already revoked, revoke the ENTIRE token family!
    if (storedToken.is_revoked) {
      console.warn(`[Security Alert] Reused refresh token detected for family ${storedToken.family_id}. Revoking family.`);
      await supabase
        .from('refresh_tokens')
        .update({ is_revoked: true })
        .eq('family_id', storedToken.family_id);

      clearAuthCookies(res);
      res.status(401).json({ success: false, error: 'Session compromised. Please sign in again.' });
      return;
    }

    // Check expiration
    if (new Date(storedToken.expires_at) < new Date()) {
      clearAuthCookies(res);
      res.status(401).json({ success: false, error: 'Refresh token expired' });
      return;
    }

    // Mark current token as revoked (single-use)
    await supabase
      .from('refresh_tokens')
      .update({ is_revoked: true })
      .eq('id', storedToken.id);

    // Fetch user to ensure still active & not blocked
    const { data: user } = await supabase
      .from('users')
      .select('id, email, name, role, is_blocked')
      .eq('id', storedToken.user_id)
      .single();

    if (!user || user.is_blocked) {
      clearAuthCookies(res);
      res.status(403).json({ success: false, error: 'Account inactive or suspended' });
      return;
    }

    // Issue new pair in the same rotation family
    const { accessToken, refreshToken } = await issueTokenFamily(user, res, storedToken.family_id);

    res.json({
      success: true,
      message: 'Tokens refreshed',
      data: {
        token: accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (err) {
    console.error('[Auth] Refresh error:', err);
    clearAuthCookies(res);
    res.status(500).json({ success: false, error: 'Token refresh failed' });
  }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, avatar_url, is_blocked, created_at')
      .eq('id', req.user!.userId)
      .single();

    if (error || !user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({ success: true, data: { user } });
  } catch (err) {
    console.error('[Auth] GetMe error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// POST /api/auth/logout — Revoke current token and clear cookies
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const incomingToken = req.cookies?.refresh_token || req.body?.refreshToken;
    if (incomingToken) {
      const tokenHash = hashToken(incomingToken);
      await supabase
        .from('refresh_tokens')
        .update({ is_revoked: true })
        .eq('token_hash', tokenHash);
    }
    clearAuthCookies(res);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    clearAuthCookies(res);
    res.json({ success: true, message: 'Logged out' });
  }
};

// POST /api/auth/logout-all — Revoke ALL refresh tokens for the user
export const logoutAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.userId) {
      await supabase
        .from('refresh_tokens')
        .update({ is_revoked: true })
        .eq('user_id', req.user.userId);
    }
    clearAuthCookies(res);
    res.json({ success: true, message: 'Logged out of all devices successfully' });
  } catch (err) {
    clearAuthCookies(res);
    res.json({ success: true, message: 'Logged out' });
  }
};

// PATCH /api/auth/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, avatar_url } = req.body as { name?: string; avatar_url?: string };

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name.trim();
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user!.userId)
      .select('id, email, name, role, avatar_url')
      .single();

    if (error || !user) {
      res.status(500).json({ success: false, error: 'Failed to update profile' });
      return;
    }

    res.json({ success: true, message: 'Profile updated', data: { user } });
  } catch (err) {
    console.error('[Auth] UpdateProfile error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
