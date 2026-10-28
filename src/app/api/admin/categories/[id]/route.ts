export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/jwt';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, description, image } = body;

    const existing = db.get('SELECT id FROM categories WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    db.run(
      `UPDATE categories 
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           image = COALESCE(?, image),
           updated_at = ?
       WHERE id = ?`,
      [name ? name.trim() : null, description !== undefined ? description.trim() : null, image || null, now, id]
    );

    const category = db.get('SELECT * FROM categories WHERE id = ?', [id]);
    return NextResponse.json({ success: true, data: { category }, message: 'Category updated successfully' });
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
    db.run('DELETE FROM categories WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
