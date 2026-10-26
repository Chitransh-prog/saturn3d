import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'saturn3d.db');
export const sqlite = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys for high performance and durability
sqlite.exec('PRAGMA journal_mode = WAL;');
sqlite.exec('PRAGMA foreign_keys = ON;');

// ---------------------------------------------------------------------------
// 1. Initialize Tables (SQLite Schema)
// ---------------------------------------------------------------------------
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

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  family_id TEXT NOT NULL,
  is_revoked INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_refresh_family ON refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_refresh_hash ON refresh_tokens(token_hash);

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

CREATE INDEX IF NOT EXISTS idx_prod_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_prod_cat ON products(category);

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

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

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

// ---------------------------------------------------------------------------
// 2. Initial Data Seeding (Admin & Sample Products)
// ---------------------------------------------------------------------------
function seedInitialData() {
  // 1. Seed Admin if users table is empty or has no admin
  const adminRow = sqlite.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
  if (!adminRow) {
    const adminId = crypto.randomUUID();
    const email = 'admin@gmail.com';
    const passwordHash = bcrypt.hashSync('admin123', 12);
    const now = new Date().toISOString();
    sqlite.prepare(`
      INSERT INTO users (id, email, password, name, role, is_blocked, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'admin', 0, ?, ?)
    `).run(adminId, email, passwordHash, 'Saturn 3D Admin', now, now);
    console.log(`[Database] Initial admin user seeded: ${email} / admin123`);
  }

  // 2. Seed Sample Products if empty
  const prodRow = sqlite.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (prodRow.count === 0) {
    const now = new Date().toISOString();
    const initialProducts = [
      {
        name: 'Geometric Vase',
        slug: 'geometric-vase',
        description: 'Modern hexagonal pattern vase, perfect for home decor. Printed with high-quality PLA material.',
        price: 29.99,
        image: '/products/vase.jpg',
        category: 'Interior',
        stock: 50,
      },
      {
        name: 'Tech Organizer',
        slug: 'tech-organizer',
        description: 'Multi-compartment desk organizer for gadgets, cables, and accessories. Navy blue ABS material.',
        price: 34.99,
        image: '/products/organizer.jpg',
        category: 'Corporate / Bulk Gifting',
        stock: 35,
      },
      {
        name: 'Articulated Desk Lamp',
        slug: 'articulated-desk-lamp',
        description: 'Adjustable arm desk lamp with LED light. Orange and white color scheme. Full 360° rotation.',
        price: 49.99,
        image: '/products/lamp.jpg',
        category: 'Drone & Robotics',
        stock: 20,
      },
      {
        name: 'Self-Watering Plant Pot',
        slug: 'self-watering-plant-pot',
        description: 'Geometric textured plant pot with innovative self-watering feature. Terracotta orange color.',
        price: 24.99,
        image: '/products/plant-pot.jpg',
        category: 'Education',
        stock: 60,
      },
      {
        name: 'Adjustable Phone Stand',
        slug: 'adjustable-phone-stand',
        description: 'Sleek phone stand with adjustable angle. Black PLA with blue accents. Holds any phone.',
        price: 19.99,
        image: '/products/phone-stand.jpg',
        category: 'Industrial Parts Manufacturing',
        stock: 100,
      },
      {
        name: 'Cable Management System',
        slug: 'cable-management-system',
        description: 'Modular cable clips and holders for an organized desk setup. Kit includes 12 clips.',
        price: 14.99,
        image: '/products/cable-management.jpg',
        category: 'Small Batch Manufacturing',
        stock: 80,
      },
    ];

    const insertStmt = sqlite.prepare(`
      INSERT INTO products (id, name, title, slug, description, price, image, category, stock, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);

    for (const p of initialProducts) {
      insertStmt.run(crypto.randomUUID(), p.name, p.name, p.slug, p.description, p.price, p.image, p.category, p.stock, now, now);
    }

    console.log(`[Database] Seeded ${initialProducts.length} initial products.`);
  }
}

seedInitialData();

// ---------------------------------------------------------------------------
// 3. Universal Query Builder Adapter
// ---------------------------------------------------------------------------
export class QueryBuilder<T = any> implements PromiseLike<{ data: T | null; error: any; count?: number | null }> {
  private tableName: string;
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private selectedColumns: string = '*';
  private insertData: any = null;
  private updateData: any = null;
  private whereClauses: { sql: string; val?: any }[] = [];
  private orderClause: string = '';
  private limitCount?: number;
  private offsetCount?: number;
  private isSingle: boolean = false;
  private shouldCount: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = '*', options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }) {
    this.action = 'select';
    this.selectedColumns = columns;
    if (options?.count) {
      this.shouldCount = true;
    }
    return this;
  }

  insert(data: any) {
    this.action = 'insert';
    this.insertData = data;
    return this;
  }

  update(data: any) {
    this.action = 'update';
    this.updateData = data;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(column: string, value: any) {
    if (value === null || value === undefined) {
      this.whereClauses.push({ sql: `"${column}" IS NULL` });
    } else {
      this.whereClauses.push({ sql: `"${column}" = ?`, val: value });
    }
    return this;
  }

  neq(column: string, value: any) {
    if (value === null || value === undefined) {
      this.whereClauses.push({ sql: `"${column}" IS NOT NULL` });
    } else {
      this.whereClauses.push({ sql: `"${column}" != ?`, val: value });
    }
    return this;
  }

  in(column: string, values: any[]) {
    if (!values || values.length === 0) {
      this.whereClauses.push({ sql: '1=0' });
    } else {
      const placeholders = values.map(() => '?').join(', ');
      this.whereClauses.push({ sql: `"${column}" IN (${placeholders})`, val: values });
    }
    return this;
  }

  gte(column: string, value: any) {
    this.whereClauses.push({ sql: `"${column}" >= ?`, val: value });
    return this;
  }

  lte(column: string, value: any) {
    this.whereClauses.push({ sql: `"${column}" <= ?`, val: value });
    return this;
  }

  ilike(column: string, pattern: string) {
    const cleanPattern = pattern.replace(/%/g, '%');
    this.whereClauses.push({ sql: `"${column}" LIKE ?`, val: cleanPattern });
    return this;
  }

  or(filterStr: string) {
    // E.g. "name.ilike.%search%,description.ilike.%search%"
    const parts = filterStr.split(',');
    const orSqls: string[] = [];
    const orVals: any[] = [];

    for (const part of parts) {
      const tokens = part.split('.');
      if (tokens.length >= 3) {
        const col = tokens[0];
        const op = tokens[1];
        const val = tokens.slice(2).join('.');
        if (op === 'ilike' || op === 'like') {
          orSqls.push(`"${col}" LIKE ?`);
          orVals.push(val);
        } else if (op === 'eq') {
          orSqls.push(`"${col}" = ?`);
          orVals.push(val);
        }
      }
    }

    if (orSqls.length > 0) {
      this.whereClauses.push({
        sql: `(${orSqls.join(' OR ')})`,
        val: orVals,
      });
    }
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    const dir = options?.ascending === false ? 'DESC' : 'ASC';
    this.orderClause = `ORDER BY "${column}" ${dir}`;
    return this;
  }

  range(from: number, to: number) {
    this.offsetCount = from;
    this.limitCount = Math.max(0, to - from + 1);
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    this.limitCount = 1;
    return this;
  }

  private buildWhere() {
    if (this.whereClauses.length === 0) return { sql: '', params: [] };
    const sql = 'WHERE ' + this.whereClauses.map((w) => w.sql).join(' AND ');
    const params: any[] = [];
    for (const w of this.whereClauses) {
      if (w.val !== undefined) {
        if (Array.isArray(w.val)) {
          params.push(...w.val.map((v: any) => (typeof v === 'boolean' ? (v ? 1 : 0) : v)));
        } else {
          params.push(typeof w.val === 'boolean' ? (w.val ? 1 : 0) : w.val);
        }
      }
    }
    return { sql, params };
  }

  private execute(): { data: any; error: any; count?: number | null } {
    try {
      if (this.action === 'select') {
        let count: number | null = null;
        const { sql: whereSql, params: whereParams } = this.buildWhere();

        if (this.shouldCount) {
          const countStmt = sqlite.prepare(`SELECT COUNT(*) as c FROM "${this.tableName}" ${whereSql}`);
          const cRow = (countStmt as any).get(...whereParams) as { c: number } | undefined;
          count = cRow ? cRow.c : 0;
        }

        let selectCols = this.selectedColumns;
        if (selectCols === '*') {
          selectCols = '*';
        }

        let query = `SELECT ${selectCols} FROM "${this.tableName}" ${whereSql}`;
        if (this.orderClause) query += ` ${this.orderClause}`;
        if (this.limitCount !== undefined) query += ` LIMIT ${this.limitCount}`;
        if (this.offsetCount !== undefined) query += ` OFFSET ${this.offsetCount}`;

        const stmt = sqlite.prepare(query);
        const rows = (stmt as any).all(...whereParams);

        // Normalize booleans / JSON
        const processed = rows.map((r: any) => this.normalizeRow(r));

        if (this.isSingle) {
          const singleItem = processed.length > 0 ? processed[0] : null;
          return { data: singleItem, error: null, count };
        }
        return { data: processed, error: null, count };
      }

      if (this.action === 'insert') {
        const items = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
        const insertedRows: any[] = [];
        const now = new Date().toISOString();

        for (const rawItem of items) {
          const item = { ...rawItem };
          if (!item.id) item.id = crypto.randomUUID();
          if (!item.created_at) item.created_at = now;
          if (!item.updated_at && (this.tableName === 'users' || this.tableName === 'products' || this.tableName === 'orders' || this.tableName === 'categories' || this.tableName === 'coupons')) {
            item.updated_at = now;
          }

          // Serialize objects/arrays to JSON string for SQLite
          for (const key of Object.keys(item)) {
            if (typeof item[key] === 'boolean') {
              item[key] = item[key] ? 1 : 0;
            } else if (typeof item[key] === 'object' && item[key] !== null) {
              item[key] = JSON.stringify(item[key]);
            }
          }

          const cols = Object.keys(item);
          const placeholders = cols.map(() => '?').join(', ');
          const colNames = cols.map((c) => `"${c}"`).join(', ');
          const values = Object.values(item);

          const insertSql = `INSERT INTO "${this.tableName}" (${colNames}) VALUES (${placeholders})`;
          (sqlite.prepare(insertSql) as any).run(...values);

          // Retrieve inserted row
          const getSql = `SELECT * FROM "${this.tableName}" WHERE id = ?`;
          const row = (sqlite.prepare(getSql) as any).get(item.id);
          insertedRows.push(this.normalizeRow(row));
        }

        const data = Array.isArray(this.insertData) ? insertedRows : insertedRows[0] || null;
        return { data, error: null };
      }

      if (this.action === 'update') {
        const updateObj = { ...this.updateData };
        if (this.tableName === 'users' || this.tableName === 'products' || this.tableName === 'orders' || this.tableName === 'categories' || this.tableName === 'coupons') {
          updateObj.updated_at = new Date().toISOString();
        }

        // Serialize values
        for (const key of Object.keys(updateObj)) {
          if (typeof updateObj[key] === 'boolean') {
            updateObj[key] = updateObj[key] ? 1 : 0;
          } else if (typeof updateObj[key] === 'object' && updateObj[key] !== null) {
            updateObj[key] = JSON.stringify(updateObj[key]);
          }
        }

        const setSql = Object.keys(updateObj)
          .map((k) => `"${k}" = ?`)
          .join(', ');
        const setParams = Object.values(updateObj);

        const { sql: whereSql, params: whereParams } = this.buildWhere();
        const updateSql = `UPDATE "${this.tableName}" SET ${setSql} ${whereSql}`;
        (sqlite.prepare(updateSql) as any).run(...setParams, ...whereParams);

        // Fetch updated rows
        const fetchSql = `SELECT * FROM "${this.tableName}" ${whereSql}`;
        const rows = (sqlite.prepare(fetchSql) as any).all(...whereParams).map((r: any) => this.normalizeRow(r));
        const data = this.isSingle ? (rows[0] || null) : rows;
        return { data, error: null };
      }

      if (this.action === 'delete') {
        const { sql: whereSql, params: whereParams } = this.buildWhere();
        const deleteSql = `DELETE FROM "${this.tableName}" ${whereSql}`;
        (sqlite.prepare(deleteSql) as any).run(...whereParams);
        return { data: null, error: null };
      }

      return { data: null, error: null };
    } catch (err: any) {
      console.error(`[DB Error] on ${this.tableName}:`, err);
      return { data: null, error: { message: err.message || 'Database error' } };
    }
  }

  private normalizeRow(row: any): any {
    if (!row) return row;
    const res = { ...row };
    // Convert SQLite 0/1 back to booleans for known flags
    const boolFields = ['is_blocked', 'is_revoked', 'is_active', 'is_deleted'];
    for (const f of boolFields) {
      if (f in res) {
        res[f] = Boolean(res[f]);
      }
    }
    // Parse JSON fields
    const jsonFields = ['images', 'specs', 'seo_fields', 'shipping_address', 'billing_address', 'details', 'applicable_categories'];
    for (const f of jsonFields) {
      if (typeof res[f] === 'string') {
        try {
          res[f] = JSON.parse(res[f]);
        } catch {
          // keep as string
        }
      }
    }
    return res;
  }

  then<TResult1 = { data: T | null; error: any; count?: number | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T | null; error: any; count?: number | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    const result = this.execute();
    return Promise.resolve(result).then(onfulfilled, onrejected);
  }
}

// ---------------------------------------------------------------------------
// 4. Main Database Client
// ---------------------------------------------------------------------------
export const db = {
  from: <T = any>(tableName: string) => new QueryBuilder<T>(tableName),
  
  // Custom RPC runner (e.g. decrement_stock)
  rpc: async (fnName: string, args: Record<string, any>) => {
    try {
      if (fnName === 'decrement_stock') {
        const { p_product_id, p_quantity } = args;
        const prod = sqlite.prepare('SELECT stock FROM products WHERE id = ?').get(p_product_id) as { stock: number } | undefined;
        if (!prod) {
          return { error: { message: 'Product not found' } };
        }
        if (prod.stock < p_quantity) {
          return { error: { message: 'Insufficient stock available' } };
        }
        sqlite.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(p_quantity, p_product_id);
        return { error: null };
      }
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message } };
    }
  },

  // Raw SQL execution helper
  raw: (sql: string, params: any[] = []) => {
    return sqlite.prepare(sql).all(...params);
  },
};

export default db;
