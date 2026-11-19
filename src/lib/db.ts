import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let DatabaseSync: any = null;
try {
  DatabaseSync = require('node:sqlite').DatabaseSync;
} catch (err) {
  console.warn('[DB] node:sqlite is not supported in this Node runtime:', err);
}

let sqliteInstance: any = null;

if (DatabaseSync) {
  try {
    const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL);
    const dataDir = isServerless 
      ? path.join('/tmp', 'data') 
      : path.resolve(process.cwd(), 'data');

    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {}
    }

    const bundledDbPath = path.resolve(process.cwd(), 'data', 'saturn3d.db');
    const targetDbPath = isServerless ? path.join(dataDir, 'saturn3d.db') : bundledDbPath;

    if (isServerless && fs.existsSync(bundledDbPath) && !fs.existsSync(targetDbPath)) {
      try {
        fs.copyFileSync(bundledDbPath, targetDbPath);
      } catch {}
    }

    const dbPath = fs.existsSync(dataDir) ? targetDbPath : ':memory:';
    sqliteInstance = new DatabaseSync(dbPath);

    // Enable WAL mode, 30s busy timeout & foreign keys
    try {
      sqliteInstance.exec('PRAGMA busy_timeout = 30000;');
      sqliteInstance.exec('PRAGMA journal_mode = WAL;');
      sqliteInstance.exec('PRAGMA foreign_keys = ON;');
    } catch {}
  } catch (err) {
    console.warn('[DB] Failed to initialize file SQLite, falling back to :memory:', err);
    try {
      sqliteInstance = new DatabaseSync(':memory:');
    } catch {}
  }
}

export const sqlite = sqliteInstance;

// ---------------------------------------------------------------------------
// 1. Initialize Tables (SQLite Schema)
// ---------------------------------------------------------------------------
if (sqlite) {
  try {
    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      is_blocked INTEGER NOT NULL DEFAULT 0,
      avatar_url TEXT,
      phone TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      parent_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT,
      slug TEXT UNIQUE,
      description TEXT,
      price REAL NOT NULL DEFAULT 0,
      compare_at_price REAL,
      sku TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL,
      category_id TEXT,
      image TEXT,
      images TEXT DEFAULT '[]',
      specs TEXT DEFAULT '{}',
      seo_fields TEXT DEFAULT '{}',
      status TEXT DEFAULT 'PUBLISHED',
      is_active INTEGER DEFAULT 1,
      is_deleted INTEGER DEFAULT 0,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      max_discount_cap REAL,
      min_order_value REAL DEFAULT 0,
      usage_limit_total INTEGER,
      usage_limit_per_customer INTEGER DEFAULT 1,
      times_used INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      start_date TEXT,
      end_date TEXT,
      applicable_categories TEXT DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      total_amount REAL NOT NULL,
      subtotal REAL NOT NULL,
      tax_amount REAL DEFAULT 0,
      shipping_amount REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      coupon_code TEXT,
      shipping_address TEXT DEFAULT '{}',
      billing_address TEXT DEFAULT '{}',
      notes TEXT,
      stripe_session_id TEXT,
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      total REAL NOT NULL,
      specs TEXT DEFAULT '{}',
      created_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company_name TEXT,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bulk_orders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company_name TEXT,
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      details TEXT DEFAULT '{}',
      ip_address TEXT,
      created_at TEXT NOT NULL
    );
    `);
  } catch (err) {
    console.warn('[DB] Schema setup warning:', err);
  }
}

// ---------------------------------------------------------------------------
// 2. Initial Admin & Default Catalog Seeding
// ---------------------------------------------------------------------------
let hasSeeded = false;
export function initAndSeedDatabase() {
  if (hasSeeded || !sqlite) return;
  hasSeeded = true;
  try {
    const now = new Date().toISOString();

    // 1. Ensure Saturn 3D master admin exists using .env configuration
    const targetEmail = (process.env.ADMIN_EMAIL || 'saturn3dlabs@gmail.com').trim().toLowerCase();
    const targetPassword = process.env.ADMIN_PASSWORD || 'Saturn3D@123';
    const existingSaturnAdmin = sqlite.prepare('SELECT id, email FROM users WHERE LOWER(email) = ?').get(targetEmail) as { id: string } | undefined;
    
    if (!existingSaturnAdmin) {
      const defaultPasswordHash = bcrypt.hashSync(targetPassword, 10);
      const oldAdmin = sqlite.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as { id: string } | undefined;

      if (oldAdmin) {
        sqlite.prepare(`
          UPDATE users 
          SET email = ?, password = ?, name = 'Saturn 3D Admin', role = 'admin', updated_at = ?
          WHERE id = ?
        `).run(targetEmail, defaultPasswordHash, now, oldAdmin.id);
        console.log(`[DB] Updated existing admin to: ${targetEmail}`);
      } else {
        const adminId = crypto.randomUUID();
        sqlite.prepare(`
          INSERT INTO users (id, email, password, name, role, is_blocked, created_at, updated_at)
          VALUES (?, ?, ?, 'Saturn 3D Admin', 'admin', 0, ?, ?)
        `).run(adminId, targetEmail, defaultPasswordHash, now, now);
        console.log(`[DB] Seeded default admin user: ${targetEmail}`);
      }
    }

    // 2. Seed Default Categories if empty
    const catCount = (sqlite.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number }).count;
    if (catCount === 0) {
      const defaultCategories = [
        { name: 'Interior & Decor', slug: 'interior', description: 'Functional aesthetic homeware and architectural pieces', image: '/products/vase.webp' },
        { name: 'Corporate & Bulk Gifting', slug: 'corporate-gifting', description: 'Branded premium desk pieces and customized giveaways', image: '/products/organizer.webp' },
        { name: 'Drone & Robotics', slug: 'drone-robotics', description: 'Precision lightweight aerodynamic housings and structural components', image: '/products/lamp.webp' },
        { name: 'Rapid Prototyping', slug: 'rapid-prototyping', description: 'Functional validation enclosures and tight-tolerance mechanical assemblies', image: '/products/plant-pot.webp' },
        { name: 'Industrial Parts Manufacturing', slug: 'industrial-parts', description: 'End-use brackets, jigs, and tooling replacements in tough polymers', image: '/products/phone-stand.webp' },
        { name: 'Small Batch Manufacturing', slug: 'small-batch', description: 'Low-volume production runs with zero tooling lead time', image: '/products/cable-management.webp' },
        { name: 'Custom Prototyping', slug: 'custom-prototyping', description: 'High precision bespoke engineering prototypes with tight specs', image: '/products/organizer.webp' },
        { name: 'Cosplay & Props', slug: 'cosplay-props', description: 'Intricate movie-grade armor pieces, helmets, and detailed replicas', image: '/products/lamp.webp' },
      ];

      const insertCat = sqlite.prepare(`
        INSERT INTO categories (id, name, slug, description, image, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const c of defaultCategories) {
        insertCat.run(crypto.randomUUID(), c.name, c.slug, c.description, c.image, now, now);
      }
      console.log(`[DB] Seeded ${defaultCategories.length} categories.`);
    }

    // 3. Seed / Sync Official Saturn 3D Products
    const defaultProducts = [
      {
        id: '1',
        name: 'Hexagonal Carbon Vase',
        slug: 'hexagonal-carbon-vase',
        description: 'Generative algorithm-designed geometric vase with continuous spiral shell. 3D printed with premium Carbon-Fiber PLA for a matte velvet tactile texture.',
        price: 1299.00,
        image: '/products/vase.webp',
        category: 'Interior',
        stock: 25,
      },
      {
        id: '2',
        name: 'Tech Organizer Elite',
        slug: 'tech-organizer-elite',
        description: 'Precision modular workstation dock engineered with anti-resonant weighting, dedicated wireless device bays, and cable conduits.',
        price: 1499.00,
        image: '/products/organizer.webp',
        category: 'Corporate / Bulk Gifting',
        stock: 40,
      },
      {
        id: '3',
        name: 'Articulated High-Torque Desk Lamp',
        slug: 'articulated-desk-lamp',
        description: 'Adjustable arm desk lamp with embedded LED channel. Industrial cobalt-violet and ink contrast accents. 360° counterbalanced hinge.',
        price: 2100.00,
        image: '/products/lamp.webp',
        category: 'Drone & Robotics',
        stock: 18,
      },
      {
        id: '4',
        name: 'Sculptural Monolithic Bookends',
        slug: 'sculptural-bookends',
        description: 'Abstract sculptural monolithic bookends with mineral texture finish. Supports heavy hardcovers, ideal for corporate executive gifting and bespoke wedding keepsake sets.',
        price: 1850.00,
        image: '/products/bookends.webp',
        category: 'Corporate / Bulk Gifting',
        stock: 20,
      },
      {
        id: '5',
        name: 'Parametric Architectural Wall Hooks',
        slug: 'geometric-wall-hooks',
        description: 'Parametric architectural facade scale study wall mounts. Inspired by brutalist faceted geometry with concealed structural wall anchor points.',
        price: 1250.00,
        image: '/products/wall-hooks.webp',
        category: 'Architectural Scale Down Models',
        stock: 35,
      },
      {
        id: '6',
        name: 'Modular Interlocking Cable Track',
        slug: 'modular-cable-track',
        description: 'Quick snap-together desk cable spine with 14 articulated vertebrae for neat routing from desk grommet to floor power socket.',
        price: 850.00,
        image: '/products/cable-management.webp',
        category: 'Small Batch Manufacturing',
        stock: 60,
      },
      {
        id: '7',
        name: 'Geometric Self-Watering Planter',
        slug: 'geometric-self-watering-planter',
        description: 'Dual-reservoir breathable planter with capillary moisture wick system. Water-tight inner shell with textured outer grip.',
        price: 990.00,
        image: '/products/plant-pot.webp',
        category: 'Education',
        stock: 30,
      },
      {
        id: '8',
        name: 'Bespoke CNC-Fit Phone Stand',
        slug: 'bespoke-cnc-phone-stand',
        description: 'Heavy gauge angled charging cradle compatible with MagSafe cables and all modern smartphones. Solid anti-slip rubber pads.',
        price: 750.00,
        image: '/products/phone-stand.webp',
        category: 'Industrial Parts Manufacturing',
        stock: 45,
      },
      {
        id: '9',
        name: 'Lattice Pen Holder & Caliper Station',
        slug: 'lattice-pen-holder',
        description: 'Intricate gyroid lattice design pen and caliper station. Metallic finish with micron-accurate friction fits for drafters, architects, and prototyping engineers.',
        price: 1150.00,
        image: '/products/pen-holder.webp',
        category: 'Rapid Prototyping',
        stock: 35,
      },
      {
        id: '10',
        name: 'Micro-Fluidic Centrifugal Impeller',
        slug: 'micro-fluidic-centrifugal-impeller',
        description: 'Ultra-precision centrifugal cooling rotor with 8 aerodynamic backward-curved vanes and high-flow inducer hub. Fabricated in engineering SLA photopolymer with micron-level surface smoothness.',
        price: 1450.00,
        image: '/showcase/sla-turbine-impeller.webp',
        category: 'Rapid Prototyping',
        stock: 24,
      },
      {
        id: '11',
        name: 'UAS Carbon-X Drone Arm Spar',
        slug: 'uas-carbon-x-drone-arm-spar',
        description: 'High flexural modulus continuous carbon-fiber composite motor spar engineered for heavy-lift industrial quadcopters. Internal gyroid lattice absorbs high-frequency motor vibration harmonics.',
        price: 2850.00,
        image: '/showcase/carbon-drone-spar.webp',
        category: 'Drone & Robotics',
        stock: 18,
      },
      {
        id: '12',
        name: 'CoreXY Structural Enclosure Chassis',
        slug: 'corexy-structural-enclosure-chassis',
        description: 'High-rigidity prototype electronic enclosure with integral PCB standoffs, active heat-dissipation ventilation louvers, and dual-axis snap-fit seal lid tolerances.',
        price: 3400.00,
        image: '/showcase/industrial-chassis.webp',
        category: 'Rapid Prototyping',
        stock: 14,
      },
      {
        id: '13',
        name: 'High-Torque Planetary Reduction Gearbox',
        slug: 'high-torque-planetary-reduction-gearbox',
        description: 'Compound epicyclic planetary reduction gear cluster with 14-tooth sun gear and precision involute planet satellites. Delivers verified 4:1 mechanical torque multiplication.',
        price: 1950.00,
        image: '/showcase/planetary-gears.webp',
        category: 'Industrial Parts Manufacturing',
        stock: 22,
      },
      {
        id: '14',
        name: 'Robotic End-Effector Gripper Finger',
        slug: 'robotic-end-effector-gripper-finger',
        description: 'Dual-durometer industrial robotic manipulator finger with compliant elastomeric TPU grip pads and rigid carbon-reinforced structural spine for delicate automated pick-and-place tasks.',
        price: 1650.00,
        image: '/showcase/robotic-gripper.webp',
        category: 'Small Batch Manufacturing',
        stock: 32,
      },
    ];

    const upsertProd = sqlite.prepare(`
      INSERT INTO products (id, name, title, slug, description, price, image, category, stock, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        title = excluded.title,
        slug = excluded.slug,
        description = excluded.description,
        price = excluded.price,
        image = excluded.image,
        category = excluded.category,
        stock = excluded.stock,
        is_active = 1,
        updated_at = excluded.updated_at
    `);

    for (const p of defaultProducts) {
      upsertProd.run(p.id, p.name, p.name, p.slug, p.description, p.price, p.image, p.category, p.stock, now, now);
    }

    // Historical UUID alias support so direct links to a537902f-8c05-4cb1-8154-514f157bc1b7 resolve in DB
    try {
      const liveUuid = 'a537902f-8c05-4cb1-8154-514f157bc1b7';
      const vase = defaultProducts[0];
      upsertProd.run(liveUuid, vase.name, vase.name, 'hexagonal-carbon-vase-legacy', vase.description, vase.price, vase.image, vase.category, vase.stock, now, now);
    } catch {}

    console.log(`[DB] Seeded/verified ${defaultProducts.length} official Saturn 3D products.`);

    // 4. Default Store Settings
    const existingSettings = sqlite.prepare("SELECT key FROM settings WHERE key = 'store_config'").get();
    if (!existingSettings) {
      const storeConfig = {
        storeName: 'Saturn 3D Precision Manufacturing',
        supportEmail: 'saturn3dlabs@gmail.com',
        whatsappNumber: '919203711106',
        address: 'Govindpura Industrial Area, Bhopal, MP 462023, India',
        currency: 'INR',
        freeShippingThreshold: 1500,
        defaultShippingCost: 150,
        taxRatePercent: 18,
        gstin: '23AABCS1234F1Z5',
      };
      sqlite.prepare('INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)').run(
        'store_config',
        JSON.stringify(storeConfig),
        now
      );
    }
  } catch (err) {
    // Suppress concurrent seed errors during build phase
  }
}

// Automatically initialize and seed on import
if (sqlite) {
  try {
    initAndSeedDatabase();
  } catch {}
}

// ---------------------------------------------------------------------------
// 3. Database Utility Wrapper (Safe & Resilient)
// ---------------------------------------------------------------------------
export const db = {
  raw: sqlite,
  
  query<T = any>(sql: string, params: any[] = []): T[] {
    if (!sqlite) return [];
    try {
      return (sqlite.prepare(sql) as any).all(...params) as T[];
    } catch (err) {
      console.warn('[DB Query Error]', err);
      return [];
    }
  },
  
  get<T = any>(sql: string, params: any[] = []): T | undefined {
    if (!sqlite) return undefined;
    try {
      return (sqlite.prepare(sql) as any).get(...params) as T | undefined;
    } catch (err) {
      console.warn('[DB Get Error]', err);
      return undefined;
    }
  },
  
  run(sql: string, params: any[] = []) {
    if (!sqlite) return { changes: 0, lastInsertRowid: 0 };
    try {
      return (sqlite.prepare(sql) as any).run(...params);
    } catch (err) {
      console.warn('[DB Run Error]', err);
      return { changes: 0, lastInsertRowid: 0 };
    }
  },
  
  exec(sql: string) {
    if (!sqlite) return;
    try {
      return sqlite.exec(sql);
    } catch (err) {
      console.warn('[DB Exec Error]', err);
    }
  }
};

export default db;
