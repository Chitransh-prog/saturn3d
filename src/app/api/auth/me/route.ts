export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Session expired or invalid' },
        { status: 401 }
      );
    }

    const user = db.get<{
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'user';
      is_blocked: number;
      avatar_url?: string;
      phone?: string;
      created_at: string;
    }>('SELECT id, email, name, role, is_blocked, avatar_url, phone, created_at FROM users WHERE id = ?', [authUser.userId]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account not found' },
        { status: 404 }
      );
    }

    if (user.is_blocked) {
      return NextResponse.json(
        { success: false, error: 'Account suspended' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar_url: user.avatar_url,
          phone: user.phone,
          created_at: user.created_at,
        },
      },
    });
  } catch (error: any) {
    console.error('[API /api/auth/me] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
