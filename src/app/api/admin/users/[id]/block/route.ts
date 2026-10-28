export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/jwt';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { is_blocked } = body;

    const now = new Date().toISOString();
    db.run('UPDATE users SET is_blocked = ?, updated_at = ? WHERE id = ?', [is_blocked ? 1 : 0, now, id]);

    return NextResponse.json({
      success: true,
      message: `User ${is_blocked ? 'suspended' : 'unblocked'} successfully`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
