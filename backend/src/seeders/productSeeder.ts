import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

dotenv.config();

const supabase = db;

const productsData = [
  {
    name: 'Geometric Vase',
    description: 'Modern hexagonal pattern vase, perfect for home decor. Printed with high-quality PLA material. Features an intricate lattice design that catches light beautifully from every angle.',
    price: 29.99,
    image: '/products/vase.jpg',
    category: 'Interior',
  },
  {
    name: 'Tech Organizer',
    description: 'Multi-compartment desk organizer for gadgets, cables, and accessories. Navy blue ABS material. Designed for the modern workspace with dedicated slots for every device.',
    price: 34.99,
    image: '/products/organizer.jpg',
    category: 'Corporate / Bulk Gifting',
  },
  {
    name: 'Articulated Desk Lamp',
    description: 'Adjustable arm desk lamp with LED light. Orange and white color scheme. Full 360° rotation with tool-free assembly. Perfect for workstations and reading nooks.',
    price: 49.99,
    image: '/products/lamp.jpg',
    category: 'Drone & Robotics',
  },
  {
    name: 'Self-Watering Plant Pot',
    description: 'Geometric textured plant pot with innovative self-watering feature. Terracotta orange color. Includes a water reservoir that slowly feeds your plants for up to 2 weeks.',
    price: 24.99,
    image: '/products/plant-pot.jpg',
    category: 'Education',
  },
  {
    name: 'Adjustable Phone Stand',
    description: 'Sleek phone stand with adjustable angle. Black PLA with blue accents. Holds any phone from 4" to 7". Foldable for portability. Non-slip base for stability.',
    price: 19.99,
    image: '/products/phone-stand.jpg',
    category: 'Industrial Parts Manufacturing',
  },
  {
    name: 'Cable Management System',
    description: 'Modular cable clips and holders for an organized desk setup. White and gray. Kit includes 12 clips, 4 channel holders and a desk clamp. Adhesive or screw mount.',
    price: 14.99,
    image: '/products/cable-management.jpg',
    category: 'Small Batch Manufacturing',
  },
  {
    name: 'Lattice Pen Holder',
    description: 'Intricate lattice design pen holder. Metallic silver PLA material. Holds up to 20 pens and pencils. The geometric lattice pattern allows you to see contents at a glance.',
    price: 22.99,
    image: '/products/pen-holder.jpg',
    category: 'Rapid Prototyping',
  },
  {
    name: 'Geometric Wall Hooks',
    description: 'Modern wall hooks with geometric design. Matte black finish. Set of 5 hooks with varying sizes. Can hold up to 3kg per hook. Includes all mounting hardware.',
    price: 27.99,
    image: '/products/wall-hooks.jpg',
    category: 'Architectural Scale Down Models',
  },
  {
    name: 'Sculptural Bookends',
    description: 'Abstract sculptural bookends with marble-like texture. White finish. Each bookend weighs 450g, providing enough weight to support even heavy hardcovers. Sold as a pair.',
    price: 39.99,
    image: '/products/bookends.jpg',
    category: 'Marriage Gifts',
  },
];

async function getOrCreateAdmin(): Promise<string> {
  const email = 'admin@gmail.com';
  
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) return existing.id;

  const hashedPassword = await bcrypt.hash('admin123', 12);
  const { data: admin, error } = await supabase
    .from('users')
    .insert({ 
      email, 
      password: hashedPassword, 
      name: 'Admin', 
      role: 'admin' 
    })
    .select('id')
    .single();

  if (error || !admin) throw new Error(`Failed to create admin: ${error?.message}`);
  return admin.id;
}

async function seedProducts() {
  console.log('🚀 Starting Product Seeding...');

  try {
    const adminId = await getOrCreateAdmin();
    console.log(`👤 Admin ID: ${adminId}`);

    // Clear existing products to ensure we only have the new ones
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.warn('⚠️ Warning: Could not clear products table:', deleteError.message);
    } else {
      console.log('🗑️ Cleared existing products.');
    }

    const formattedProducts = productsData.map(p => ({
      ...p,
      stock: 20,
      is_active: true,
      created_by: adminId,
    }));

    const { data, error: insertError } = await supabase
      .from('products')
      .insert(formattedProducts)
      .select('id, name');

    if (insertError) throw insertError;

    console.log('✅ Successfully seeded products.');
    console.log('Generated IDs:', (data as any[])?.map((p: any) => ({ name: p.name, id: p.id })));
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedProducts();
