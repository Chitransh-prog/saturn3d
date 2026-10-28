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

    const totalProducts = (db.get<{ count: number }>('SELECT COUNT(*) as count FROM products WHERE is_deleted = 0') || { count: 0 }).count;
    const totalUsers = (db.get<{ count: number }>('SELECT COUNT(*) as count FROM users WHERE role = \'user\'') || { count: 0 }).count;
    const totalOrders = (db.get<{ count: number }>('SELECT COUNT(*) as count FROM orders') || { count: 0 }).count;
    const revenueRow = db.get<{ sum: number | null }>('SELECT SUM(total_amount) as sum FROM orders WHERE status NOT IN (\'cancelled\', \'refunded\')');
    const totalRevenue = revenueRow?.sum || 0;
    const inventoryRow = db.get<{ sum: number | null }>('SELECT SUM(stock) as sum FROM products WHERE is_deleted = 0');
    const activeInventory = inventoryRow?.sum || 0;
    const totalInquiries = (db.get<{ count: number }>('SELECT COUNT(*) as count FROM inquiries') || { count: 0 }).count;

    const recentOrders = db.query(`
      SELECT o.*, u.name as customer_name, u.email as customer_email 
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `).map(o => ({
      ...o,
      users: { name: o.customer_name || 'Guest User', email: o.customer_email || 'guest@saturn3d.in' }
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalUsers,
          totalOrders,
          totalRevenue,
          activeInventory,
          orderVolume: totalOrders,
          totalInquiries,
        },
        recentOrders,
      },
    });
  } catch (error: any) {
    console.error('[API /api/admin/stats] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
