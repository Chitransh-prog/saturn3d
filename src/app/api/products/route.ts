export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let whereClause = 'WHERE is_active = 1 AND is_deleted = 0';
    const params: any[] = [];

    if (category && category !== 'All') {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const products = db.query(`SELECT * FROM products ${whereClause} ORDER BY created_at DESC`, params)
      .map(p => ({
        ...p,
        is_active: Boolean(p.is_active),
      }));

    return NextResponse.json(
      {
        success: true,
        data: { products },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/products] GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
