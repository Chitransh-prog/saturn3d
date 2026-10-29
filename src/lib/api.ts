import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  is_blocked?: boolean;
  created_at?: string;
}

export interface ProductSeoFields {
  seo?: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string;
    canonical_url?: string;
    og_image?: string;
    indexable?: boolean;
  };
  geo?: {
    target_city?: string;
    target_region?: string;
    geo_placename?: string;
    geo_position?: string;
    service_scope?: string;
    dispatch_lead_time?: string;
  };
  aeo?: {
    direct_answer?: string;
    material_grade?: string;
    tolerance_rating?: string;
    technology_process?: string;
    ai_keywords?: string;
    faq_items?: { question: string; answer: string }[];
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  is_active?: boolean;
  slug?: string;
  specs?: Record<string, any>;
  seo_fields?: ProductSeoFields;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: Record<string, any>;
  created_at: string;
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
  order_items?: OrderItem[];
  users?: { name: string; email: string };
}

export interface ShippingAddress {
  line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface BulkOrder {
  id: string;
  name: string;
  email: string;
  company_name?: string;
  product_name: string;
  quantity: number;
  message?: string;
  status: 'pending' | 'processing' | 'contacted' | 'completed' | 'cancelled';
  created_at: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  options?: Record<string, any>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: { field: string; message: string }[];
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'flat';
  value: number;
  max_discount_cap?: number;
  min_order_value?: number;
  usage_limit_total?: number;
  times_used?: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  target_type: string;
  target_id: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
  admin?: { name?: string; email?: string };
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  whatsappNumber: string;
  address: string;
  currency: string;
  freeShippingThreshold: number;
  defaultShippingCost: number;
  taxRatePercent: number;
  gstin: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  orderId: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  supplier: {
    name: string;
    address: string;
    gstin: string;
    email: string;
    phone: string;
    sacCode: string;
  };
  customer: {
    name: string;
    email: string;
    shippingAddress?: ShippingAddress;
  };
  items: OrderItem[];
  financials: {
    subtotal: number;
    discount: number;
    netTaxableAmount: number;
    cgst: number;
    sgst: number;
    totalGst: number;
    shippingCost: number;
    grandTotal: number;
    currency: string;
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// ─── Axios instance ────────────────────────────────────────────────────────────
const API_BASE = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('saturn3d_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear token and optionally redirect
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored credentials
      localStorage.removeItem('saturn3d_token');
      localStorage.removeItem('saturn3d_user');

      // Avoid redirect loop on login/register pages
      const isAuthPage =
        window.location.pathname === '/login' ||
        window.location.pathname === '/register';

      if (!isAuthPage) {
        // Save intended path so we can redirect back after login
        const currentPath = window.location.pathname + window.location.search;
        if (currentPath !== '/') {
          sessionStorage.setItem('saturn3d_redirect', currentPath);
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data),

  logout: () => apiClient.post<ApiResponse>('/auth/logout'),

  getMe: () => apiClient.get<ApiResponse<{ user: User }>>('/auth/me'),

  updateProfile: (data: { name?: string; avatar_url?: string }) =>
    apiClient.patch<ApiResponse<{ user: User }>>('/auth/profile', data),
};

// ─── Products API ─────────────────────────────────────────────────────────────
import { products as fallbackProducts } from '@/data/products';
import { categories as fallbackCategoriesData } from '@/data/categories';

const fallbackCategories = ['All', ...fallbackCategoriesData.map((c) => c.title)];

export const productsApi = {
  getAll: async (params?: { category?: string; search?: string; limit?: number; page?: number }) => {
    try {
      const res = await apiClient.get<ApiResponse<{ products: Product[]; pagination: Pagination }>>('/products', { params });
      if (res.data?.data?.products && res.data.data.products.length > 0) {
        return res;
      }
    } catch {
      // Backend not running or offline - fallback to rich local catalog
    }

    let filtered = [...fallbackProducts];
    if (params?.category && params.category.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === params.category?.toLowerCase()
      );
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    const limit = params?.limit || 50;
    const page = params?.page || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      data: {
        success: true,
        data: {
          products: paginated as Product[],
          pagination: {
            total: filtered.length,
            page,
            limit,
            totalPages: Math.ceil(filtered.length / limit),
          },
        },
      },
    } as AxiosResponse<ApiResponse<{ products: Product[]; pagination: Pagination }>>;
  },

  getCategories: async () => {
    try {
      const res = await apiClient.get<ApiResponse<{ categories: (string | { name: string })[] }>>('/categories');
      if (res.data?.data?.categories && res.data.data.categories.length > 0) {
        const categoryNames = res.data.data.categories.map((c: any) =>
          typeof c === 'string' ? c : c.name
        );
        return {
          ...res,
          data: {
            ...res.data,
            data: {
              categories: ['All', ...categoryNames.filter((c: string) => c.toLowerCase() !== 'all')],
            },
          },
        } as AxiosResponse<ApiResponse<{ categories: string[] }>>;
      }
    } catch {
      // Fallback
    }
    return {
      data: {
        success: true,
        data: {
          categories: fallbackCategories,
        },
      },
    } as AxiosResponse<ApiResponse<{ categories: string[] }>>;
  },

  getById: async (id: string) => {
    try {
      const res = await apiClient.get<ApiResponse<{ product: Product; related: Product[] }>>(`/products/${id}`);
      if (res.data?.data?.product) {
        return res;
      }
    } catch {
      // Fallback
    }
    const found = fallbackProducts.find((p) => p.id === id) || fallbackProducts[0];
    const related = fallbackProducts
      .filter((p) => p.id !== found.id && p.category === found.category)
      .slice(0, 3);
    const fallbackRelated =
      related.length > 0
        ? related
        : fallbackProducts.filter((p) => p.id !== found.id).slice(0, 3);

    return {
      data: {
        success: true,
        data: {
          product: found as Product,
          related: fallbackRelated as Product[],
        },
      },
    } as AxiosResponse<ApiResponse<{ product: Product; related: Product[] }>>;
  },
};

// ─── Coupons API ─────────────────────────────────────────────────────────────
export const couponsApi = {
  validate: (code: string, cartSubtotal: number) =>
    apiClient.post<ApiResponse<{
      code: string;
      type: 'percent' | 'flat';
      value: number;
      discountAmount: number;
      finalSubtotal: number;
      message: string;
    }>>('/coupons/validate', { code, cartSubtotal }),

  getAll: () =>
    apiClient.get<ApiResponse<{ coupons: Coupon[] }>>('/coupons'),

  create: (data: Omit<Coupon, 'id' | 'times_used'>) =>
    apiClient.post<ApiResponse<{ coupon: Coupon }>>('/coupons', data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse>(`/coupons/${id}`),
};

// ─── Categories API ──────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<{ categories: Category[] }>>('/categories'),

  create: (data: Omit<Category, 'id'>) =>
    apiClient.post<ApiResponse<{ category: Category }>>('/categories', data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse>(`/categories/${id}`),
};

// ─── Upload API (UploadThing Integration) ────────────────────────────────────
export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse<{
      fileKey: string;
      fileName: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
    }>>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadCad: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse<{
      fileKey: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      status: string;
    }>>('/upload/cad', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersApi = {
  createCheckout: (data: {
    items: CartItem[];
    shippingAddress?: ShippingAddress;
    paymentMethod?: 'razorpay' | 'cod' | 'stripe';
    couponCode?: string;
  }) =>
    apiClient.post<ApiResponse<{
      checkoutUrl?: string;
      sessionId?: string;
      orderId: string;
      orderNumber?: string;
      paymentMethod?: string;
      razorpayOrderId?: string;
      keyId?: string;
      amount?: number;
      isCod?: boolean;
      isSimulated?: boolean;
      subtotal?: number;
      discountAmount?: number;
      taxAmount?: number;
      shippingAmount?: number;
    }>>('/orders/checkout', data),

  /** Verify Razorpay payment signature & complete order */
  verifyRazorpay: (data: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature?: string;
  }) =>
    apiClient.post<ApiResponse<{ order: Order }>>('/orders/verify-razorpay', data),

  /** Verify a completed Stripe session and return the associated order */
  verifyStripeSession: (sessionId: string) =>
    apiClient.get<ApiResponse<{ order: Order }>>(`/orders/verify-session/${sessionId}`),

  getMyOrders: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<{ orders: Order[]; pagination: Pagination }>>('/orders', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<{ order: Order }>>(`/orders/${id}`),

  getInvoice: (id: string) =>
    apiClient.get<ApiResponse<{ invoice: InvoiceData }>>(`/orders/${id}/invoice`),
};

// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminApi = {
  // Stats
  getStats: () =>
    apiClient.get<ApiResponse<{
      stats: { 
        totalProducts: number; 
        totalUsers: number; 
        totalOrders: number; 
        totalRevenue: number;
        activeInventory: number;
        orderVolume: number;
      };
      recentOrders: Order[];
      topProducts: { name: string; totalSold: number; totalRevenue: number }[];
    }>>('/admin/stats'),

  // Products
  getProducts: (params?: { limit?: number; page?: number; search?: string; category?: string }) =>
    apiClient.get<ApiResponse<{ products: Product[]; pagination: Pagination }>>('/admin/products', { params }),

  createProduct: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) =>
    apiClient.post<ApiResponse<{ product: Product }>>('/admin/products', data),

  updateProduct: (id: string, data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>) =>
    apiClient.put<ApiResponse<{ product: Product }>>(`/admin/products/${id}`, data),

  deleteProduct: (id: string) =>
    apiClient.delete<ApiResponse>(`/admin/products/${id}`),

  // Orders
  getOrders: (params?: { limit?: number; page?: number; status?: string }) =>
    apiClient.get<ApiResponse<{ orders: Order[]; pagination: Pagination }>>('/admin/orders', { params }),

  updateOrderStatus: (id: string, status: string, deliveryInfo?: { tracking_number?: string; carrier?: string }) =>
    apiClient.patch<ApiResponse<{ order: Order }>>(`/admin/orders/${id}/status`, { status, ...deliveryInfo }),

  refundOrder: (id: string, amount?: number, reason?: string) =>
    apiClient.post<ApiResponse<{ refundId: string; status: string }>>(`/admin/orders/${id}/refund`, { amount, reason }),

  // Users & Customer Management
  getUsers: (params?: { limit?: number; page?: number }) =>
    apiClient.get<ApiResponse<{ users: User[]; pagination: Pagination }>>('/admin/users', { params }),

  toggleUserBlock: (id: string, is_blocked: boolean) =>
    apiClient.patch<ApiResponse<{ user: User }>>(`/admin/users/${id}/block`, { is_blocked }),

  // Audit Logs
  getAuditLogs: (params?: { limit?: number; page?: number }) =>
    apiClient.get<ApiResponse<{ logs: AuditLog[]; pagination: Pagination }>>('/admin/audit-logs', { params }),

  // Settings
  getSettings: () =>
    apiClient.get<ApiResponse<{ settings: StoreSettings }>>('/admin/settings'),

  updateSettings: (data: Partial<StoreSettings>) =>
    apiClient.put<ApiResponse<{ settings: StoreSettings }>>('/admin/settings', data),

  // Bulk Orders / Inquiries
  getBulkOrders: (params?: { limit?: number; page?: number }) =>
    apiClient.get<ApiResponse<{ bulk_orders: BulkOrder[]; pagination: Pagination }>>('/admin/bulk-orders', { params }),

  getInquiries: () =>
    apiClient.get<ApiResponse<{ inquiries: any[] }>>('/admin/inquiries'),

  updateInquiryStatus: (id: string, status: string) =>
    apiClient.patch<ApiResponse>(`/admin/inquiries/${id}`, { status }),

  deleteInquiry: (id: string) =>
    apiClient.delete<ApiResponse>(`/admin/inquiries/${id}`),

  // Categories
  getCategories: () =>
    apiClient.get<ApiResponse<{ categories: Category[] }>>('/admin/categories'),

  createCategory: (data: { name: string; description?: string; image?: string }) =>
    apiClient.post<ApiResponse<{ category: Category }>>('/admin/categories', data),

  updateCategory: (id: string, data: { name?: string; description?: string; image?: string }) =>
    apiClient.put<ApiResponse<{ category: Category }>>(`/admin/categories/${id}`, data),

  deleteCategory: (id: string) =>
    apiClient.delete<ApiResponse>(`/admin/categories/${id}`),

  // Admin Credentials & Account Management
  getAdmins: () =>
    apiClient.get<ApiResponse<{ admins: User[]; currentAdminId: string }>>('/admin/credentials'),

  createAdmin: (data: { email: string; name?: string; password: string }) =>
    apiClient.post<ApiResponse<{ admin: User }>>('/admin/credentials', data),

  updateAdminPassword: (data: { adminId: string; newPassword?: string; newEmail?: string; name?: string }) =>
    apiClient.put<ApiResponse<{ admin: User }>>('/admin/credentials', data),

  deleteAdmin: (adminId: string) =>
    apiClient.delete<ApiResponse>(`/admin/credentials?adminId=${adminId}`),

  // Admin Credentials Update
  updateCredentials: (data: { currentPassword: string; newEmail?: string; newPassword?: string }) =>
    apiClient.patch<ApiResponse<{ user: User; token: string }>>('/admin/credentials', data),
};

export default apiClient;

// ─── Helper utilities ─────────────────────────────────────────────────────────

/** Extract a user-friendly error message from any API error */
export const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiResponse | undefined;
    if (data?.errors && data.errors.length > 0) {
      return data.errors.map((e) => e.message).join(', ');
    }
    return data?.error || data?.message || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};

// Token helpers (SSR Safe)
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('saturn3d_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('saturn3d_token');
    localStorage.removeItem('saturn3d_user');
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('saturn3d_token');
  }
  return null;
};

/** Retrieve and clear the saved post-login redirect path */
export const consumeRedirectPath = (): string => {
  if (typeof window !== 'undefined') {
    const path = sessionStorage.getItem('saturn3d_redirect') || '/';
    sessionStorage.removeItem('saturn3d_redirect');
    return path;
  }
  return '/';
};
