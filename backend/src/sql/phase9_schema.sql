-- ==============================================================================
-- Saturn 3D - Phase 9 Complete Commerce & Admin Schema
-- Compatible with PostgreSQL & Supabase
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('ADMIN', 'CUSTOMER')),
  is_blocked  BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url  TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. REFRESH TOKEN ROTATION & FAMILIES
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,
  family_id   UUID NOT NULL,
  is_revoked  BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family ON public.refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON public.refresh_tokens(token_hash);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image       TEXT,
  parent_id   UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCTS (Soft-delete, specs JSON, SEO fields)
CREATE TABLE IF NOT EXISTS public.products (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  description      TEXT NOT NULL,
  price            NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price >= 0),
  sku              TEXT UNIQUE,
  stock            INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category         TEXT NOT NULL,
  category_id      UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  images           JSONB NOT NULL DEFAULT '[]'::jsonb,
  specs            JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo_fields       JSONB NOT NULL DEFAULT '{"metaTitle": "", "metaDescription": ""}'::jsonb,
  status           TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED')),
  is_deleted       BOOLEAN NOT NULL DEFAULT FALSE,
  created_by       UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- 5. COUPONS ENGINE
CREATE TABLE IF NOT EXISTS public.coupons (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code                    TEXT UNIQUE NOT NULL,
  type                    TEXT NOT NULL CHECK (type IN ('percent', 'flat')),
  value                   NUMERIC(10, 2) NOT NULL CHECK (value > 0),
  max_discount_cap        NUMERIC(10, 2),
  min_order_value         NUMERIC(10, 2) DEFAULT 0,
  usage_limit_total       INTEGER,
  usage_limit_per_customer INTEGER DEFAULT 1,
  times_used              INTEGER NOT NULL DEFAULT 0,
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  start_date              TIMESTAMPTZ,
  end_date                TIMESTAMPTZ,
  applicable_categories   JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- 6. ORDERS & INVOICES
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number     TEXT UNIQUE NOT NULL,
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status           TEXT NOT NULL DEFAULT 'pending' 
                     CHECK (status IN ('pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount     NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  subtotal         NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax_amount       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping_cost    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount_amount  NUMERIC(10, 2) NOT NULL DEFAULT 0,
  coupon_id        UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  payment_method   TEXT NOT NULL DEFAULT 'razorpay' CHECK (payment_method IN ('razorpay', 'cod', 'stripe')),
  payment_id       TEXT,
  payment_status   TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_address JSONB NOT NULL,
  tracking_number  TEXT,
  carrier          TEXT,
  internal_notes   TEXT,
  invoice_url      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 7. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  options     JSONB DEFAULT '{}'::jsonb,
  image       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AUDIT LOGS (ADMIN MUTATIONS)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity      TEXT NOT NULL,
  entity_id   TEXT,
  details     JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at);
