export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50'), 1), 200);
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE is_deleted = 0';
    const params: any[] = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category && category !== 'All') {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    const countRow = db.get<{ count: number }>(`SELECT COUNT(*) as count FROM products ${whereClause}`, params);
    const total = countRow?.count || 0;

    const products = db.query(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ).map(p => ({
      ...p,
      is_active: Boolean(p.is_active),
    }));

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
        },
      },
    });
  } catch (error: any) {
    console.error('[API /api/admin/products] GET Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, image, category, stock, is_active } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json({ success: false, error: 'Name, price, and category are required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + id.substring(0, 5);
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO products (id, name, title, slug, description, price, image, category, stock, is_active, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name.trim(),
        name.trim(),
        slug,
        description ? description.trim() : '',
        parseFloat(price) || 0,
        image ? image.trim() : '/products/vase.jpg',
        category.trim(),
        parseInt(stock) || 0,
        is_active !== false ? 1 : 0,
        authUser.userId,
        now,
        now,
      ]
    );

    const product = db.get('SELECT * FROM products WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      data: { product },
      message: 'Product created successfully',
    });
  } catch (error: any) {
    console.error('[API /api/admin/products] POST Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
