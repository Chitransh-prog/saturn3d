import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import bulkOrdersRoutes from './routes/bulkOrders.js';
import couponsRoutes from './routes/coupons.js';
import categoriesRoutes from './routes/categories.js';
import uploadRoutes from './routes/upload.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ── Security headers ──────────────────────────────────────────
app.use(helmet());

// ── Cookie Parser (httpOnly JWT auth) ─────────────────────────
app.use(cookieParser());

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Stripe Webhook — raw body MUST come before express.json() ─
app.use(
  '/api/orders/webhook',
  express.raw({ type: 'application/json' }),
);

// ── Body parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Routes ────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bulk-orders', bulkOrdersRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/upload', uploadRoutes);

// ── 404 & Error handlers ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Saturn3D API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});

export default app;