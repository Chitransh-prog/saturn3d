import { Request, Response } from 'express';
import { AuthRequest } from '../types/index.js';
import supabase from '../config/supabase.js';

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'flat';
  value: number;
  max_discount_cap?: number;
  min_order_value?: number;
  usage_limit_total?: number;
  usage_limit_per_customer?: number;
  times_used: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

// ---------------------------------------------------------------------------
// Storefront: Server-Side Coupon Validation
// ---------------------------------------------------------------------------
export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, cartSubtotal } = req.body as { code: string; cartSubtotal: number };

    if (!code || typeof cartSubtotal !== 'number') {
      res.status(400).json({ success: false, error: 'Coupon code and cart subtotal are required' });
      return;
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Query coupon from DB
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', cleanCode)
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      // Mock / fallback support for standard demo codes if database is empty
      if (cleanCode === 'PRECISION10' || cleanCode === 'SATURN20') {
        const discountPercent = cleanCode === 'SATURN20' ? 20 : 10;
        const discount = Number(((cartSubtotal * discountPercent) / 100).toFixed(2));
        res.json({
          success: true,
          data: {
            code: cleanCode,
            type: 'percent',
            value: discountPercent,
            discountAmount: discount,
            finalSubtotal: Number((cartSubtotal - discount).toFixed(2)),
            message: `${discountPercent}% discount applied successfully`,
          },
        });
        return;
      }

      res.status(404).json({ success: false, error: 'Invalid or expired coupon code' });
      return;
    }

    // 2. Date checks
    const now = new Date();
    if (coupon.start_date && new Date(coupon.start_date) > now) {
      res.status(400).json({ success: false, error: 'Coupon promotion has not started yet' });
      return;
    }
    if (coupon.end_date && new Date(coupon.end_date) < now) {
      res.status(400).json({ success: false, error: 'Coupon promotion has expired' });
      return;
    }

    // 3. Minimum order value
    if (coupon.min_order_value && cartSubtotal < coupon.min_order_value) {
      res.status(400).json({
        success: false,
        error: `Minimum order value of ₹${coupon.min_order_value} required for this coupon`,
      });
      return;
    }

    // 4. Usage limit check
    if (coupon.usage_limit_total && coupon.times_used >= coupon.usage_limit_total) {
      res.status(400).json({ success: false, error: 'Coupon usage limit has been reached' });
      return;
    }

    // 5. Server-side discount computation
    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = (cartSubtotal * coupon.value) / 100;
      if (coupon.max_discount_cap && discountAmount > coupon.max_discount_cap) {
        discountAmount = coupon.max_discount_cap;
      }
    } else {
      discountAmount = Math.min(coupon.value, cartSubtotal);
    }

    discountAmount = Number(discountAmount.toFixed(2));
    const finalSubtotal = Number(Math.max(0, cartSubtotal - discountAmount).toFixed(2));

    res.json({
      success: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
        finalSubtotal,
        message: `Coupon ${coupon.code} applied successfully! Saved ₹${discountAmount}`,
      },
    });
  } catch (err) {
    console.error('[Coupons] Validate error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// ---------------------------------------------------------------------------
// Admin: Coupons CRUD
// ---------------------------------------------------------------------------
export const adminGetCoupons = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch coupons' });
      return;
    }

    res.json({ success: true, data: { coupons: coupons || [] } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const adminCreateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      code,
      type,
      value,
      max_discount_cap,
      min_order_value,
      usage_limit_total,
      start_date,
      end_date,
    } = req.body;

    const { data: coupon, error } = await supabase
      .from('coupons')
      .insert({
        code: code.trim().toUpperCase(),
        type,
        value: parseFloat(value),
        max_discount_cap: max_discount_cap ? parseFloat(max_discount_cap) : null,
        min_order_value: min_order_value ? parseFloat(min_order_value) : 0,
        usage_limit_total: usage_limit_total ? parseInt(usage_limit_total) : null,
        start_date: start_date || null,
        end_date: end_date || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(201).json({ success: true, data: { coupon } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const adminDeleteCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('coupons').delete().eq('id', id);

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
