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

    // Combine inquiries and bulk_orders
    const standardInquiries = db.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    const bulkOrders = db.query('SELECT id, name, email, company_name, description as message, quantity, status, created_at, created_at as updated_at, \'Bulk Order Quote\' as subject, \'\' as phone FROM bulk_orders ORDER BY created_at DESC');

    const allInquiries = [...standardInquiries, ...bulkOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      data: { inquiries: allInquiries },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company_name, phone, subject, message, quantity } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Name, email, and message are required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO inquiries (id, name, email, company_name, phone, subject, message, quantity, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`,
      [
        id,
        name.trim(),
        email.trim().toLowerCase(),
        company_name ? company_name.trim() : null,
        phone ? phone.trim() : null,
        subject ? subject.trim() : 'Custom Quote / Manufacturing Inquiry',
        message.trim(),
        parseInt(quantity) || 1,
        now,
        now,
      ]
    );

    const created = db.get('SELECT * FROM inquiries WHERE id = ?', [id]);
    return NextResponse.json({
      success: true,
      data: { inquiry: created },
      message: 'Inquiry submitted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
