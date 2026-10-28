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
    const { status } = body;

    const now = new Date().toISOString();
    // Try updating inquiries table
    db.run('UPDATE inquiries SET status = ?, updated_at = ? WHERE id = ?', [status, now, id]);
    // Also try bulk_orders table if it was from there
    db.run('UPDATE bulk_orders SET status = ? WHERE id = ?', [status, id]);

    return NextResponse.json({
      success: true,
      message: `Inquiry status marked as ${status}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { id } = await params;
    db.run('DELETE FROM inquiries WHERE id = ?', [id]);
    db.run('DELETE FROM bulk_orders WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Inquiry record removed',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
