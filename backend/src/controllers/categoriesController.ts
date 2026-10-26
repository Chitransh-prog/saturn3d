import { Request, Response } from 'express';
import { AuthRequest } from '../types/index.js';
import supabase from '../config/supabase.js';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      // Fallback local list of categories
      res.json({
        success: true,
        data: {
          categories: [
            { id: '1', name: 'Aerospace & Drone', slug: 'aerospace-drone', description: 'Carbon-X structural airframes' },
            { id: '2', name: 'Medical & Bio-Models', slug: 'medical-bio', description: 'Surgical planning & anatomical models' },
            { id: '3', name: 'Automotive & EV', slug: 'automotive-ev', description: 'High-temp manifolds & ducting' },
            { id: '4', name: 'Consumer Electronics', slug: 'consumer-electronics', description: 'Snap-fit enclosures & housings' },
            { id: '5', name: 'Architecture & Facades', slug: 'architectural-models', description: 'Monocoque scale structures' },
            { id: '6', name: 'Tooling & Fixtures', slug: 'tooling-fixtures', description: 'Assembly jigs & robotic EOAT' },
          ],
        },
      });
      return;
    }

    res.json({ success: true, data: { categories: categories || [] } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const adminCreateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, description, image } = req.body;
    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name: name.trim(),
        slug: cleanSlug,
        description: description?.trim() || '',
        image: image || null,
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(201).json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const adminDeleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
