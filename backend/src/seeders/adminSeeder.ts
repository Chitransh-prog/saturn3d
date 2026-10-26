/**
 * Admin Seeder — Creates admin user + sample products
 * Run: npm run seed
 * 
 * Admin credentials:
 *   Email:    admin@gmail.com
 *   Password: admin123
 */

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

dotenv.config();

const supabase = db;

async function seedAdmin(): Promise<string> {
  console.log('\n👤 Creating admin user...');

  const email = 'admin@gmail.com';
  const password = 'admin123';
  const name = 'Admin';

  // Check if already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single();

  if (existing) {
    console.log(`  ⏭  Admin already exists (id: ${existing.id})`);
    return existing.id as string;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { data: admin, error } = await supabase
    .from('users')
    .insert({ email, password: hashedPassword, name, role: 'admin' })
    .select('id')
    .single();

  if (error || !admin) {
    console.error('  ❌ Failed to create admin:', error?.message);
    throw error;
  }

  console.log(`  ✅ Admin created: ${email} / ${password} (id: ${admin.id})`);
  return admin.id as string;
}

async function seedProducts(adminId: string): Promise<void> {
  console.log('\n📦 Seeding products...');

  const products = [
    {
      name: 'Geometric Vase',
      description: 'Modern hexagonal pattern vase, perfect for home decor. Printed with high-quality PLA material. Features an intricate lattice design that catches light beautifully from every angle.',
      price: 29.99,
      image: 'https://picsum.photos/seed/vase/600/450',
      category: 'Home Decor',
      stock: 15,
      is_active: true,
      created_by: adminId,
    },
    {
      name: 'Tech Organizer',
      description: 'Multi-compartment desk organizer for gadgets, cables, and accessories. Navy blue ABS material. Designed for the modern workspace with dedicated slots for every device.',
      price: 34.99,
      image: 'https://picsum.photos/seed/organizer/600/450',
      category: 'Desk Accessories',
      stock: 20,
      is_active: true,
      created_by: adminId,
    },
    {
      name: 'Articulated Desk Lamp',
      description: 'Adjustable arm desk lamp with LED light. Orange and white color scheme. Full 360° rotation with tool-free assembly. Perfect for workstations and reading nooks.',
      price: 49.99,
      image: 'https://picsum.photos/seed/lamp/600/450',
      category: 'Lighting',
      stock: 8,
      is_active: true,
      created_by: adminId,
    },
    {
      name: 'Self-Watering Plant Pot',
      description: 'Geometric textured plant pot with innovative self-watering feature. Terracotta orange color. Includes a water reservoir that slowly feeds your plants for up to 2 weeks.',
      price: 24.99,
      image: 'https://picsum.photos/seed/plantpot/600/450',
      category: 'Home Decor',
      stock: 12,
      is_active: true,
      created_by: adminId,
    },
    {
      name: 'Adjustable Phone Stand',
      description: 'Sleek phone stand with adjustable angle. Black PLA with blue accents. Holds any phone from 4" to 7". Foldable for portability. Non-slip base for stability.',
      price: 19.99,
      image: 'https://picsum.photos/seed/phonestand/600/450',
      category: 'Tech Accessories',
      stock: 25,
      is_active: true,
      created_by: adminId,
    },
    {
      name: 'Cable Management System',
      description: 'Modular cable clips and holders for an organized desk setup. White and gray. Kit includes 12 clips, 4 channel holders and a desk clamp. Adhesive or screw mount.',
      price: 14.99,
      image: 'https://picsum.photos/seed/cables/600/450',
      category: 'Desk Accessories',
      stock: 30,
      is_active: true,
      created_by: adminId,
    },
    {
      name: 'Lattice Pen Holder',
      description: 'Intricate lattice design pen holder. Metallic silver PLA material. Holds up to 20 pens and pencils. The geometric lattice pattern allows you to see contents at a glance.',
      price: 22.99,
      image: 'https://picsum.photos/seed/penholder/600/450',
      category: 'Desk Accessories',
      stock: 18,
      is_active: true,
      created_by: adminId,
    },
    {
      name: 'Geometric Wall Hooks',
      description: 'Modern wall hooks with geometric design. Matte black finish. Set of 5 hooks with varying sizes. Can hold up to 3kg per hook. Includes all mounting hardware.',
      price: 27.99,
      image: 'https://picsum.photos/seed/hooks/600/450',
      category: 'Home Decor',
      stock: 22,
      is_active: true,
      created_by: adminId,
    },
    {
      name: 'Sculptural Bookends',
      description: 'Abstract sculptural bookends with marble-like texture. White finish. Each bookend weighs 450g, providing enough weight to support even heavy hardcovers. Sold as a pair.',
      price: 39.99,
      image: 'https://picsum.photos/seed/bookends/600/450',
      category: 'Home Decor',
      stock: 10,
      is_active: true,
      created_by: adminId,
    },
  ];

  // Clear existing products
  const { count: existingCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if ((existingCount || 0) > 0) {
    console.log(`  ⏭  ${existingCount} products already exist, skipping seed`);
    return;
  }

  const { error } = await supabase.from('products').insert(products);

  if (error) {
    console.error('  ❌ Failed to seed products:', error.message);
    throw error;
  }

  console.log(`  ✅ ${products.length} products seeded successfully`);
}

async function main(): Promise<void> {
  console.log('🌱 Saturn3D Database Seeder\n================================');

  try {
    const adminId = await seedAdmin();
    await seedProducts(adminId);
    console.log('\n✅ Seeding complete!\n');
    console.log('📋 Admin Credentials:');
    console.log('   Email:    admin@gmail.com');
    console.log('   Password: admin123');
    console.log('   Role:     admin\n');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err);
    process.exit(1);
  }
}

main();
