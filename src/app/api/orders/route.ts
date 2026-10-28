export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!authUser && !orderNumber) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let ordersRaw: any[] = [];
    if (authUser) {
      ordersRaw = db.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [authUser.userId]
      );
    } else if (orderNumber) {
      ordersRaw = db.query(
        'SELECT * FROM orders WHERE order_number = ?',
        [orderNumber.trim().toUpperCase()]
      );
    }

    const orders = ordersRaw.map((o) => {
      const items = db.query('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
      return {
        ...o,
        order_items: items,
      };
    });

    return NextResponse.json({
      success: true,
      data: { orders },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    const body = await req.json();
    const { items, shippingAddress, notes, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Order must contain at least one item' }, { status: 400 });
    }

    const orderId = crypto.randomUUID();
    const orderNumber = 'SAT-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString();

    let subtotal = 0;
    const validatedItems: any[] = [];

    // Validate products and stock
    for (const item of items) {
      const prod = db.get<{
        id: string;
        name: string;
        price: number;
        stock: number;
      }>('SELECT id, name, price, stock FROM products WHERE id = ?', [item.productId || item.id]);

      const title = prod ? prod.name : (item.name || 'Custom 3D Print Part');
      const price = prod ? prod.price : (parseFloat(item.price) || 0);
      const qty = parseInt(item.quantity) || 1;
      const total = price * qty;
      subtotal += total;

      if (prod && prod.stock < qty) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for product: ${prod.name}` },
          { status: 400 }
        );
      }

      validatedItems.push({
        id: crypto.randomUUID(),
        orderId,
        productId: prod ? prod.id : item.productId || 'custom',
        title,
        price,
        quantity: qty,
        total,
        specs: item.options ? JSON.stringify(item.options) : '{}',
      });
    }

    const shippingAmount = subtotal > 1500 ? 0 : 150;
    const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;
    const totalAmount = subtotal + shippingAmount + taxAmount;

    const userId = authUser ? authUser.userId : (shippingAddress?.email || 'guest');

    // Create Order
    db.run(
      `INSERT INTO orders (id, order_number, user_id, status, total_amount, subtotal, tax_amount, shipping_amount, discount_amount, coupon_code, shipping_address, notes, created_at, updated_at)
       VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`,
      [
        orderId,
        orderNumber,
        userId,
        totalAmount,
        subtotal,
        taxAmount,
        shippingAmount,
        couponCode || null,
        shippingAddress ? JSON.stringify(shippingAddress) : '{}',
        notes || null,
        now,
        now,
      ]
    );

    // Insert Order Items and decrement stock
    const insertItem = (db.raw as any).prepare(`
      INSERT INTO order_items (id, order_id, product_id, title, price, quantity, total, specs, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const decStock = (db.raw as any).prepare('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?');

    for (const v of validatedItems) {
      insertItem.run(v.id, v.orderId, v.productId, v.title, v.price, v.quantity, v.total, v.specs, now);
      if (v.productId !== 'custom') {
        decStock.run(v.quantity, v.productId);
      }
    }

    const createdOrder = db.get('SELECT * FROM orders WHERE id = ?', [orderId]);

    return NextResponse.json({
      success: true,
      data: {
        order: {
          ...createdOrder,
          order_items: validatedItems,
        },
      },
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('[API /api/orders] POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
