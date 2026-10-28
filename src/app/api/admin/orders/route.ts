export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      whereClause += ' AND o.status = ?';
      params.push(status.toLowerCase());
    }

    if (search) {
      whereClause += ' AND (o.order_number LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const ordersRaw = db.query(`
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ${whereClause}
      ORDER BY o.created_at DESC
    `, params);

    // Fetch items for these orders
    const orders = ordersRaw.map((ord: any) => {
      const items = db.query('SELECT * FROM order_items WHERE order_id = ?', [ord.id]);
      let shippingAddress = {};
      try {
        shippingAddress = typeof ord.shipping_address === 'string' ? JSON.parse(ord.shipping_address) : (ord.shipping_address || {});
      } catch {
        shippingAddress = {};
      }

      return {
        ...ord,
        shipping_address: shippingAddress,
        order_items: items,
        users: {
          name: ord.customer_name || 'Guest User',
          email: ord.customer_email || 'guest@saturn3d.in',
          phone: ord.customer_phone || '',
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: { orders },
    });
  } catch (error: any) {
    console.error('[API /api/admin/orders] GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
