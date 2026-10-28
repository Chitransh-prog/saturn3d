export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const categories = db.query('SELECT * FROM categories ORDER BY name ASC');
    return NextResponse.json({
      success: true,
      data: { categories },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, image } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const now = new Date().toISOString();

    // Check slug uniqueness
    const existing = db.get('SELECT id FROM categories WHERE slug = ?', [slug]);
    const finalSlug = existing ? `${slug}-${id.substring(0, 4)}` : slug;

    db.run(
      `INSERT INTO categories (id, name, slug, description, image, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name.trim(), finalSlug, description ? description.trim() : '', image || '/products/vase.jpg', now, now]
    );

    const category = db.get('SELECT * FROM categories WHERE id = ?', [id]);
    return NextResponse.json({
      success: true,
      data: { category },
      message: 'Category created successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
