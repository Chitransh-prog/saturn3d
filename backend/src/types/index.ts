import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  stripe_session_id?: string;
  stripe_payment_intent?: string;
  shipping_address?: ShippingAddress;
  tracking_number?: string;
  carrier?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  created_at: string;
}

export interface ShippingAddress {
  line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

// Extend Express Request
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
