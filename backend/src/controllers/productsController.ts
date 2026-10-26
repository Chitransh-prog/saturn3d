import { Response } from 'express';
import { AuthRequest } from '../types/index.js';
import supabase from '../config/supabase.js';

// GET /api/products — public, with optional ?category=X&search=Y&limit=N&page=N
export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, search, limit = '20', page = '1' } = req.query as Record<string, string>;
    const limitNum = Math.min(parseInt(limit) || 20, 100);
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: products, error, count } = await query;

    if (error) {
      console.error('[Products] Get error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch products' });
      return;
    }

    res.json({
      success: true,
      data: {
        products: products || [],
        pagination: {
          total: count || 0,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil((count || 0) / limitNum),
        },
      },
    });
  } catch (err) {
    console.error('[Products] GetAll error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// GET /api/products/categories
export const getCategories = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true);

    if (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch categories' });
      return;
    }

    const unique = ['All', ...new Set(((data as any[]) || []).map((p: any) => p.category as string))];

    res.json({ success: true, data: { categories: unique } });
  } catch (err) {
    console.error('[Products] GetCategories error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// GET /api/products/:id
export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    // Fetch related products (same category, excluding current)
    const { data: related } = await supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .eq('is_active', true)
      .neq('id', id)
      .limit(3);

    res.json({ success: true, data: { product, related: related || [] } });
  } catch (err) {
    console.error('[Products] GetById error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
