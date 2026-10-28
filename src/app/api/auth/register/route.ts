export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import db from '@/lib/db';
import { signJwtToken, attachAuthCookie } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.get('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists' },
        { status: 409 }
      );
    }

    const userId = crypto.randomUUID();
    const passwordHash = bcrypt.hashSync(password, 10);
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO users (id, email, password, name, role, is_blocked, phone, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'user', 0, ?, ?, ?)`,
      [userId, cleanEmail, passwordHash, name.trim(), phone || null, now, now]
    );

    const token = signJwtToken({
      userId,
      email: cleanEmail,
      name: name.trim(),
      role: 'user',
    });

    const userPayload = {
      id: userId,
      email: cleanEmail,
      name: name.trim(),
      role: 'user' as const,
      phone: phone || null,
      created_at: now,
    };

    const res = NextResponse.json({
      success: true,
      data: {
        user: userPayload,
        token,
      },
    });

    return attachAuthCookie(res, token);
  } catch (error: any) {
    console.error('[API /api/auth/register] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
