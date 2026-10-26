import { Request, Response } from 'express';
import supabase from '../config/supabase.js';

// POST /api/bulk-orders — submit a bulk order inquiry
export const submitBulkOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, companyName, productName, message, quantity } = req.body;

    if (!name || !email || !productName || !quantity) {
      return res.status(400).json({ success: false, error: 'All required fields (name, email, product, quantity) must be provided' });
    }

    const { data, error } = await supabase
      .from('bulk_orders')
      .insert({
        name,
        email,
        company_name: companyName,
        product_name: productName,
        message,
        quantity: parseInt(quantity.toString()),
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('[BulkOrders] Error inserting into Supabase:', error);
      return res.status(500).json({ success: false, error: 'Failed to submit inquiry' });
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('[BulkOrders] Unexpected error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// GET /api/bulk-orders — get all bulk orders (Admin only)
export const getAllBulkOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('bulk_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[BulkOrders] Error fetching from Supabase:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch bulk orders' });
    }

    res.json({ success: true, data: { bulk_orders: data } });
  } catch (err) {
    console.error('[BulkOrders] Error in getAllBulkOrders:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
