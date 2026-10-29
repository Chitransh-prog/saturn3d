export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    // Check by slug or id
    const product = db.get(
      'SELECT * FROM products WHERE (slug = ? OR id = ?) AND is_deleted = 0',
      [slug, slug]
    );

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    let seo_fields = {};
    let specs = {};
    try {
      seo_fields = product.seo_fields ? (typeof product.seo_fields === 'string' ? JSON.parse(product.seo_fields) : product.seo_fields) : {};
    } catch {}
    try {
      specs = product.specs ? (typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs) : {};
    } catch {}

    return NextResponse.json({
      success: true,
      data: {
        product: {
          ...product,
          is_active: Boolean(product.is_active),
          seo_fields,
          specs,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
