export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const users = db.query('SELECT id, email, name, role, is_blocked, avatar_url, phone, created_at, updated_at FROM users ORDER BY created_at DESC')
      .map(u => ({ ...u, is_blocked: Boolean(u.is_blocked) }));

    return NextResponse.json({
      success: true,
      data: { users },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
