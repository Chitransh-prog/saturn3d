-- ============================================================
-- Saturn3D - Supabase Schema
-- Run this SQL in your Supabase SQL Editor to set up the DB
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,           -- bcrypt hashed
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image       TEXT NOT NULL,           -- URL or path
  category    TEXT NOT NULL,
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_by  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount          NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  stripe_session_id     TEXT UNIQUE,
  stripe_payment_intent TEXT,
  shipping_address      JSONB,         -- { line1, city, state, postal_code, country }
  tracking_number       TEXT,
  carrier               TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,           -- snapshot of product name at purchase
  price       NUMERIC(10, 2) NOT NULL, -- snapshot of price at purchase
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  image       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email          ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_products_category    ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active   ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id       ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- NOTE: Since our backend uses the service_role key, RLS
-- is bypassed for backend calls. Enable RLS to protect
-- direct Supabase client access from the browser.
-- ============================================================
ALTER TABLE public.users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items  ENABLE ROW LEVEL SECURITY;

-- Allow service_role to bypass RLS (default Supabase behavior)
-- These policies protect anon/authenticated Supabase JS client access:

-- Products: anyone can read active products
CREATE POLICY "Public can read active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

-- Users: can only read/update their own data
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (id::text = current_setting('request.jwt.claims', true)::json->>'sub');

-- Orders: users can read their own orders
CREATE POLICY "Users can read own orders"
  ON public.orders FOR SELECT
  USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can read own order items"
  ON public.order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.orders
      WHERE user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- ============================================================
-- VIEWS (helpful for admin dashboard)
-- ============================================================

-- Order summary view with user info
CREATE OR REPLACE VIEW public.orders_with_user AS
SELECT
  o.id,
  o.status,
  o.total_amount,
  o.stripe_session_id,
  o.stripe_payment_intent,
  o.shipping_address,
  o.tracking_number,
  o.carrier,
  o.notes,
  o.created_at,
  o.updated_at,
  u.id       AS user_id,
  u.name     AS user_name,
  u.email    AS user_email
FROM public.orders o
JOIN public.users u ON o.user_id = u.id;

-- Product sales stats
CREATE OR REPLACE VIEW public.product_sales_stats AS
SELECT
  p.id,
  p.name,
  p.category,
  p.price,
  p.stock,
  p.is_active,
  COALESCE(SUM(oi.quantity), 0)                 AS total_sold,
  COALESCE(SUM(oi.quantity * oi.price), 0)      AS total_revenue
FROM public.products p
LEFT JOIN public.order_items oi ON p.id = oi.product_id
LEFT JOIN public.orders o       ON oi.order_id = o.id AND o.status IN ('paid', 'processing', 'shipped', 'delivered')
GROUP BY p.id, p.name, p.category, p.price, p.stock, p.is_active;

-- ============================================================
-- ADMIN SEEDER
-- Run: node/tsx backend/src/seeders/adminSeeder.ts
-- Or insert directly below (password: admin123 bcrypt hash)
-- ============================================================
-- INSERT INTO public.users (email, password, name, role)
-- VALUES (
--   'admin@gmail.com',
--   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  -- admin123
--   'Admin',
--   'admin'
-- )
-- ON CONFLICT (email) DO NOTHING;
