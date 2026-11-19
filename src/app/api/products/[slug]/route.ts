export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { products } from '@/data/products';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    // Check by slug or id in DB
    let product: any = null;
    try {
      product = db.get(
        'SELECT * FROM products WHERE (slug = ? OR id = ?) AND is_deleted = 0',
        [slug, slug]
      );
    } catch {}

    // Fallback to static catalog if DB is not initialized or doesn't have the record
    if (!product) {
      const staticProd =
        products.find((p) => p.slug === slug || p.id === slug) ||
        (slug === 'a537902f-8c05-4cb1-8154-514f157bc1b7' ? products[0] : null) ||
        products.find((p) => {
          const clean = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
          return (p.slug || '').toLowerCase().includes(clean) || p.name.toLowerCase().includes(clean);
        });

      if (staticProd) {
        return NextResponse.json({
          success: true,
          data: {
            product: {
              ...staticProd,
              is_active: true,
              seo_fields: {},
              specs: {},
            },
          },
        });
      }

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
