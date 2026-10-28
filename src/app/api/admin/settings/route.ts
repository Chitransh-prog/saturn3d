export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const row = db.get<{ key: string; value: string }>('SELECT value FROM settings WHERE key = \'store_config\'');
    const settings = row ? JSON.parse(row.value) : {
      storeName: 'Saturn 3D Precision Manufacturing',
      supportEmail: 'saturn3d@gmail.com',
      whatsappNumber: '917999824632',
      address: 'Govindpura Industrial Area, Bhopal, MP 462023, India',
      currency: 'INR',
      freeShippingThreshold: 1500,
      defaultShippingCost: 150,
      taxRatePercent: 18,
      gstin: '23AABCS1234F1Z5',
    };

    return NextResponse.json({
      success: true,
      data: { settings },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const body = await req.json();
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO settings (key, value, updated_at) 
       VALUES ('store_config', ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      [JSON.stringify(body), now]
    );

    return NextResponse.json({
      success: true,
      message: 'Store settings saved successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
