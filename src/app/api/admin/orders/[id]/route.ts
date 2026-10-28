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
    const { status, notes } = body;

    const existing = db.get('SELECT id FROM orders WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    db.run(
      `UPDATE orders 
       SET status = COALESCE(?, status),
           notes = COALESCE(?, notes),
           updated_at = ?
       WHERE id = ?`,
      [status ? status.toLowerCase() : null, notes !== undefined ? notes : null, now, id]
    );

    const updated = db.get('SELECT * FROM orders WHERE id = ?', [id]);
    return NextResponse.json({
      success: true,
      data: { order: updated },
      message: `Order status updated to ${status}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
