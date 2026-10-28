export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import db from '@/lib/db';

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
        subject ? subject.trim() : 'Website Inquiry / Quote Request',
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
      message: 'Your inquiry has been submitted successfully. A Saturn 3D engineer will review it shortly.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
