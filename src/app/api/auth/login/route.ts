export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { signJwtToken, attachAuthCookie } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.get<{
      id: string;
      email: string;
      password: string;
      name: string;
      role: 'admin' | 'user';
      is_blocked: number;
      avatar_url?: string;
      phone?: string;
      created_at: string;
    }>('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.is_blocked) {
      return NextResponse.json(
        { success: false, error: 'Your account has been suspended by administration' },
        { status: 403 }
      );
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const userPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar_url: user.avatar_url,
      phone: user.phone,
      created_at: user.created_at,
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
    console.error('[API /api/auth/login] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
