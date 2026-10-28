export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/jwt';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = db.get('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [id]);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { product } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, description, price, image, category, stock, is_active } = body;

    const existing = db.get('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    db.run(
      `UPDATE products 
       SET name = COALESCE(?, name),
           title = COALESCE(?, title),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           image = COALESCE(?, image),
           category = COALESCE(?, category),
           stock = COALESCE(?, stock),
           is_active = COALESCE(?, is_active),
           updated_at = ?
       WHERE id = ?`,
      [
        name ? name.trim() : null,
        name ? name.trim() : null,
        description !== undefined ? description.trim() : null,
        price !== undefined ? parseFloat(price) : null,
        image ? image.trim() : null,
        category ? category.trim() : null,
        stock !== undefined ? parseInt(stock) : null,
        is_active !== undefined ? (is_active ? 1 : 0) : null,
        now,
        id,
      ]
    );

    const updated = db.get('SELECT * FROM products WHERE id = ?', [id]);
    return NextResponse.json({
      success: true,
      data: { product: updated },
      message: 'Product updated successfully',
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
    const now = new Date().toISOString();
    db.run('UPDATE products SET is_deleted = 1, updated_at = ? WHERE id = ?', [now, id]);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
