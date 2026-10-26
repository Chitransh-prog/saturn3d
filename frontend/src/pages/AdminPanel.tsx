import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, LogOut,
  Plus, Pencil, Trash2, Loader2, TrendingUp, DollarSign,
  CheckCircle, Clock, XCircle, ChevronDown, X, Menu, Eye,
  Truck, ShieldCheck, Mail, Calendar, Layers, BarChart3,
  Tag, Folder, History, Settings, UploadCloud, FileText,
  RotateCcw, Ban, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { adminApi, uploadApi, getApiError } from '@/lib/api';
import type { Product, Order, User, BulkOrder } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/components/Logo';

import InvoiceModal from '@/components/admin/InvoiceModal';
import CouponsManagement from '@/components/admin/CouponsManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import AuditLogsManagement from '@/components/admin/AuditLogsManagement';
import SettingsManagement from '@/components/admin/SettingsManagement';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    processing: 'bg-blue-50 text-blue-600 border-blue-100',
    shipped: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    delivered: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) => (
  <div className="stat-card bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 transition-all hover:shadow-md">
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
    </div>
    <div className="text-2xl sm:text-3xl font-black text-black mb-1">{value}</div>
    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────


function Dashboard() {
  const [stats, setStats] = useState<{
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    activeInventory: number;
    orderVolume: number;
  } | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getStats();
        if (res.data.success && res.data.data) {
          setStats(res.data.data.stats);
          setRecentOrders(res.data.data.recentOrders);
        }
      } catch (err) {
        toast.error(getApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Entrance animation for dashboard
  useEffect(() => {
    if (!loading) {
      import('gsap').then(({ gsap }) => {
        gsap.from('.stat-card', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out'
        });
        gsap.from('.dashboard-section', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out'
        });
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6 relative">
      {/* Decorative Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none" />



      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatCard label="Revenue" value={`$${(stats?.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={DollarSign} color="bg-emerald-100 text-emerald-600" />
        <StatCard label="Order Volume" value={stats?.orderVolume ?? 0} icon={BarChart3} color="bg-blue-100 text-blue-600" />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingCart} color="bg-purple-100 text-purple-600" />
        <StatCard label="Active Inventory" value={stats?.activeInventory ?? 0} icon={Layers} color="bg-orange-100 text-orange-600" />
        <StatCard label="Total Products" value={stats?.totalProducts ?? 0} icon={Package} color="bg-primary/10 text-primary" />
      </div>

      {/* Quick Actions for Mobile */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        <NavLink
          to="/admin/products"
          className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 space-y-2 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add Product</span>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 space-y-2 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">View Orders</span>
        </NavLink>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-black text-sm text-black uppercase tracking-widest">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-black text-xs uppercase tracking-widest">
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-black text-xs text-black">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-medium text-xs text-slate-600">
                      {order.users?.name || 'Guest'}
                    </td>
                    <td className="px-6 py-4 font-black text-xs text-primary">
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-4 font-medium text-xs text-slate-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-5 active:bg-slate-50 transition-colors space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-black text-xs text-black">#{order.id.slice(0, 8)}</div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="font-medium text-sm text-slate-600">
                      {order.users?.name || 'Guest'}
                    </div>
                    <div className="font-black text-base text-primary">
                      ${order.total_amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT FORM MODAL
// ─────────────────────────────────────────────────────────────────────────────
interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

function ProductForm({ product, onClose, onSaved }: ProductFormProps) {
  const isEdit = Boolean(product);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    image: product?.image || '',
    category: product?.category || 'Aerospace & Drone',
    stock: product?.stock?.toString() || '0',
    is_active: product?.is_active !== false,
  });

  const [images, setImages] = useState<string[]>(product?.image ? [product.image] : []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    const file = files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are permitted');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image exceeds 8MB maximum upload limit');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadApi.uploadImage(file);
      if (res.data.success && res.data.data) {
        const newUrl = res.data.data.fileUrl;
        setImages((prev) => [newUrl, ...prev]);
        setForm((prev) => ({ ...prev, image: newUrl }));
        toast.success('Image uploaded via UploadThing');
      }
    } catch (err: any) {
      toast.error(getApiError(err));
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        image: form.image || images[0] || 'https://picsum.photos/seed/saturn/400/400',
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      };

      if (isEdit && product) {
        await adminApi.updateProduct(product.id, payload);
        toast.success('Product updated successfully');
      } else {
        await adminApi.createProduct(payload as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Product created successfully');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-slate-100 rounded-t-3xl">
          <div>
            <h2 className="font-black text-lg text-black tracking-tight">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              UploadThing multi-image & specs configuration
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* UploadThing Multi-Image Drag and Drop */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest flex items-center justify-between">
              <span>Product Gallery (Drag & Drop)</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Max 8MB (JPEG, PNG, WebP)</span>
            </Label>
            
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-black/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 flex flex-col items-center justify-center gap-2 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-black group-hover:scale-105 transition-all">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <UploadCloud className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-black">
                  {uploading ? 'Uploading to Saturn Storage...' : 'Click or drag image to upload'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Verified with UploadThing type-safe router</p>
              </div>
            </div>

            {/* Thumbnail Preview strip */}
            {images.length > 0 && (
              <div className="flex gap-2 pt-2 overflow-x-auto pb-1">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 group flex-shrink-0">
                    <img src={imgUrl} alt="Thumb" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const next = images.filter((_, i) => i !== idx);
                        setImages(next);
                        if (form.image === imgUrl) setForm((p) => ({ ...p, image: next[0] || '' }));
                      }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] hover:bg-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-white text-[8px] font-black text-center uppercase tracking-tight py-0.5">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-black uppercase tracking-widest">Product Name</Label>
            <Input
              name="name"
              placeholder="Saturn S1 Industrial Carbon Bracket"
              value={form.name}
              onChange={handleChange}
              required
              className="h-11 rounded-xl border-slate-200 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-black uppercase tracking-widest">Description</Label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="High-load carbon fiber reinforced component..."
              className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm font-medium resize-none focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-black uppercase tracking-widest">Price (INR / USD)</Label>
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="49.99"
                value={form.price}
                onChange={handleChange}
                required
                className="h-11 rounded-xl border-slate-200 font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-black uppercase tracking-widest">Inventory Stock</Label>
              <Input
                name="stock"
                type="number"
                min="0"
                placeholder="50"
                value={form.stock}
                onChange={handleChange}
                required
                className="h-11 rounded-xl border-slate-200 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-black uppercase tracking-widest">Category</Label>
              <Input
                name="category"
                placeholder="Aerospace & Drone"
                value={form.category}
                onChange={handleChange}
                required
                className="h-11 rounded-xl border-slate-200 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-black uppercase tracking-widest">Storefront Status</Label>
              <select
                name="is_active"
                value={form.is_active ? 'true' : 'false'}
                onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.value === 'true' }))}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-black transition-colors bg-white"
              >
                <option value="true">Active (Published)</option>
                <option value="false">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 rounded-xl font-black uppercase tracking-widest text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading} className="flex-1 h-11 bg-black hover:bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────
function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProducts({ search: search || undefined });
      if (res.data.success && res.data.data) {
        setProducts(res.data.data.products || []);
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will hide it from the store.`)) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success(`"${name}" removed from store`);
      fetchProducts();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tighter">Products</h1>
          <p className="text-slate-400 text-sm font-medium">Manage your product catalog</p>
        </div>
        <Button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="hidden sm:flex h-11 sm:h-10 px-5 bg-black hover:bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs items-center justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 shadow-lg sm:shadow-none shadow-black/10"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => { setEditProduct(null); setShowForm(true); }}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-2xl shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform hover:bg-primary"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Search */}
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm h-11 rounded-xl border-slate-200 font-medium"
      />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-black text-xs uppercase tracking-widest">
            No products found
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Product</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Stock</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${product.id}/100/100`; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-xs text-black truncate max-w-[200px]">{product.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{product.category}</td>
                    <td className="px-6 py-4 font-black text-xs text-primary">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-black text-xs ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-600' : 'text-slate-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${product.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditProduct(product); setShowForm(true); }}
                          className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-black hover:text-white transition-all text-slate-600"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-slate-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {products.map((product) => (
                <div key={product.id} className="p-5 active:bg-slate-50 transition-colors space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100 shadow-sm">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${product.id}/100/100`; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-black text-sm text-black truncate">{product.name}</div>
                        <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border flex-shrink-0 ${product.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{product.category}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="font-black text-sm text-primary">${product.price.toFixed(2)}</div>
                        <div className="h-3 w-px bg-slate-200" />
                        <div className="text-[10px] font-black uppercase text-slate-400">Stock: {product.stock}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => { setEditProduct(product); setShowForm(true); }}
                      className="flex-1 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="w-10 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={() => setShowForm(false)}
          onSaved={fetchProducts}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────
const ORDER_STATUSES = ['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingDelivery, setUpdatingDelivery] = useState<string | null>(null);
  const [deliveryForm, setDeliveryForm] = useState({ tracking_number: '', carrier: '' });
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders({ status: statusFilter !== 'all' ? statusFilter : undefined });
      if (res.data.success && res.data.data) {
        setOrders(res.data.data.orders);
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const handleRefund = async (orderId: string, amount: number) => {
    if (!confirm(`Are you sure you want to refund order #${orderId.slice(0, 8)} for ₹${amount.toFixed(2)}?`)) return;
    try {
      await adminApi.refundOrder(orderId, amount, 'Dashboard refund initiated by admin');
      toast.success('Refund processed successfully');
      fetchOrders();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const handleUpdateDelivery = async (orderId: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, 'shipped', deliveryForm);
      toast.success('Delivery info updated');
      setUpdatingDelivery(null);
      fetchOrders();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-black tracking-tighter">Orders</h1>
        <p className="text-slate-400 text-sm font-medium">Manage customer orders & tracking</p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
              statusFilter === s ? 'bg-black border-black text-white shadow-lg shadow-black/10' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-black text-xs uppercase tracking-widest">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Order</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Items</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Tracking</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                      <td className="px-6 py-4 font-black text-xs text-black">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <div className="font-black text-xs text-black">
                          {order.users?.name || 'Guest'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {order.users?.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {order.order_items?.length ?? 0} item(s)
                      </td>
                      <td className="px-6 py-4 font-black text-xs text-primary">
                        ${order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative group min-w-[120px]">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          >
                            {ORDER_STATUSES.filter((s) => s !== 'all').map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <StatusBadge status={order.status} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {order.tracking_number ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-black text-black uppercase tracking-tight">{order.carrier}</span>
                            <span className="text-[9px] font-medium text-slate-400 font-mono">{order.tracking_number}</span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-slate-300 uppercase italic">Not shipped</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 ml-auto">
                          <button
                            title="View Tax Invoice"
                            onClick={() => setSelectedInvoiceId(order.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-slate-100 text-slate-600 hover:bg-black hover:text-white"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              expandedOrder === order.id ? 'bg-black text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={7} className="px-6 py-6 bg-slate-50/50">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Order Items */}
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Items</h4>
                              <div className="space-y-2">
                                {(order.order_items || []).map((item) => (
                                  <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-black text-xs text-black truncate">{item.name}</div>
                                      <div className="text-[9px] text-slate-400 font-medium lowercase">
                                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                                      </div>
                                    </div>
                                    <div className="font-black text-xs text-primary">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Delivery & Shipping */}
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Delivery Management</h4>

                              {updatingDelivery === order.id ? (
                                <div className="bg-white p-5 rounded-2xl border-2 border-primary/20 shadow-xl shadow-primary/5 space-y-4">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carrier</Label>
                                      <Input
                                        placeholder="e.g. FedEx"
                                        className="h-9 text-xs font-bold rounded-xl"
                                        value={deliveryForm.carrier}
                                        onChange={(e) => setDeliveryForm({ ...deliveryForm, carrier: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tracking #</Label>
                                      <Input
                                        placeholder="Enter ID"
                                        className="h-9 text-xs font-bold rounded-xl"
                                        value={deliveryForm.tracking_number}
                                        onChange={(e) => setDeliveryForm({ ...deliveryForm, tracking_number: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      className="flex-1 rounded-xl font-black uppercase tracking-widest text-[10px] h-9"
                                      onClick={() => handleUpdateDelivery(order.id)}
                                    >
                                      Save Details
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="rounded-xl font-black uppercase tracking-widest text-[10px] h-9"
                                      onClick={() => setUpdatingDelivery(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Shipping Address</div>
                                      <div className="text-xs font-bold text-black space-y-0.5">
                                        <div>{order.shipping_address?.line1}</div>
                                        <div>{order.shipping_address?.city}, {order.shipping_address?.postal_code}</div>
                                        <div>{order.shipping_address?.country}</div>
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2 bg-slate-50 border-slate-100"
                                      onClick={() => {
                                        setUpdatingDelivery(order.id);
                                        setDeliveryForm({
                                          tracking_number: order.tracking_number || '',
                                          carrier: order.carrier || ''
                                        });
                                      }}
                                    >
                                      <Truck className="w-3.5 h-3.5" />
                                      {order.tracking_number ? 'Edit Delivery' : 'Setup Delivery'}
                                    </Button>
                                  </div>

                                  {order.tracking_number && (
                                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                          <Truck className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Tracking</div>
                                          <div className="text-xs font-black text-black">{order.carrier} • {order.tracking_number}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Status Flow & Actions */}
                          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-1">Status Flow:</span>
                              {(['pending', 'paid', 'processing', 'shipped', 'delivered'] as const).map((st) => (
                                <button
                                  key={st}
                                  disabled={order.status === st}
                                  onClick={() => handleStatusChange(order.id, st)}
                                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                                    order.status === st ? 'bg-black text-white border-black opacity-50 cursor-default' : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200 shadow-sm'
                                  }`}
                                >
                                  Mark {st}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 rounded-xl text-[9px] font-black uppercase tracking-widest gap-1.5 bg-white border-slate-200"
                                onClick={() => setSelectedInvoiceId(order.id)}
                              >
                                <FileText className="w-3 h-3 text-primary" /> Tax Invoice
                              </Button>
                              {order.status !== 'refunded' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 rounded-xl text-[9px] font-black uppercase tracking-widest gap-1.5 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                                  onClick={() => handleRefund(order.id, order.total_amount)}
                                >
                                  <RotateCcw className="w-3 h-3" /> Refund
                                </Button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {orders.map((order) => (
                <div key={order.id} className="bg-white">
                  <div className="p-5 active:bg-slate-50 transition-colors space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-black text-xs text-black">#{order.id.slice(0, 8)}</div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                        >
                          {ORDER_STATUSES.filter((s) => s !== 'all').map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-black">
                          {order.users?.name || 'Guest'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {order.order_items?.length ?? 0} item(s) • Total: <span className="text-primary font-black">${order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="bg-slate-50/50 p-5 border-t border-slate-100 space-y-4">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Order Summary</h4>
                      <div className="space-y-2">
                        {(order.order_items || []).map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-black">{item.name}</div>
                                <div className="text-[10px] text-slate-400">{item.quantity} × ${item.price.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="text-xs font-black text-black">
                              ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedInvoiceId && (
          <InvoiceModal
            orderId={selectedInvoiceId}
            onClose={() => setSelectedInvoiceId(null)}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────
function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      if (res.data.success && res.data.data) {
        setUsers(res.data.data.users || []);
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleBlock = async (userId: string, currentBlocked: boolean = false) => {
    try {
      await adminApi.toggleUserBlock(userId, !currentBlocked);
      toast.success(currentBlocked ? 'User unblocked successfully' : 'User suspended successfully');
      fetchUsers();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-black tracking-tighter">Users</h1>
        <p className="text-slate-400 text-sm font-medium">Manage platform users & permissions</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-black text-xs uppercase tracking-widest">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs border border-slate-100">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-xs text-black flex items-center gap-2">
                            {user.name}
                            {user.role === 'admin' && (
                              <span className="w-3.5 h-3.5 bg-primary/10 text-primary flex items-center justify-center rounded-full" title="Admin">
                                <ShieldCheck className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Mail className="w-2 h-2" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                        user.is_blocked
                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {user.is_blocked ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[10px] font-black text-black flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-300" />
                        {new Date(user.created_at || '').toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 ml-auto">
                        <button
                          title={user.is_blocked ? 'Unblock user' : 'Suspend user'}
                          onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            user.is_blocked
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : 'bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600'
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Copy email"
                          onClick={() => {
                            navigator.clipboard.writeText(user.email);
                            toast.success('Email copied to clipboard');
                          }}
                          className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all"
                        >
                          <Mail className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {users.map((user) => (
                <div key={user.id} className="p-5 active:bg-slate-50 transition-colors space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs border border-slate-200">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-xs text-black flex items-center gap-1.5">
                          {user.name}
                          {user.role === 'admin' && <ShieldCheck className="w-3 h-3 text-primary" />}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[7px] font-black uppercase tracking-widest ${
                      user.is_blocked
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {user.is_blocked ? 'Suspended' : 'Active'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(user.created_at || '').toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        title={user.is_blocked ? 'Unblock user' : 'Suspend user'}
                        onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          user.is_blocked
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-white border border-slate-200 text-slate-400'
                        }`}
                      >
                        <Ban className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(user.email);
                          toast.success('Email copied');
                        }}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 active:bg-black active:text-white transition-all shadow-sm"
                      >
                        <Mail className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BULK ORDERS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────
function BulkOrdersManagement() {
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBulkOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBulkOrders();
      if (res.data.success && res.data.data) {
        setBulkOrders(res.data.data.bulk_orders || []);
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBulkOrders(); }, [fetchBulkOrders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tighter uppercase">Bulk Orders</h1>
          <p className="text-slate-400 text-sm font-medium">Manage wholesale & enterprise inquiries</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl font-black uppercase tracking-widest text-[10px] h-10 border-slate-200 bg-white"
          onClick={fetchBulkOrders}
        >
          <Clock className="w-3.5 h-3.5 mr-2" />
          Refresh List
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : bulkOrders.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-200">
              <Layers className="w-8 h-8" />
            </div>
            <div className="text-slate-400 font-black text-xs uppercase tracking-widest">
              No bulk order inquiries yet
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Company / Contact</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Product</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bulkOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-xs text-black uppercase">{order.company_name || 'Individual'}</span>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          {order.name} • {order.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary/20" />
                        <span className="font-bold text-xs text-black">{order.product_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-black text-xs text-black">{order.quantity}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        order.status === 'contacted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-slate-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-all ml-auto"
                        onClick={() => {
                          toast.info(`Message: ${order.message || 'No message provided'}`);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-50">
              {bulkOrders.map((order) => (
                <div key={order.id} className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-black text-xs text-black uppercase">{order.company_name || 'Individual'}</div>
                      <div className="text-[10px] text-slate-400">{order.email}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[7px] font-black uppercase tracking-widest ${
                      order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400 font-black uppercase">Product</span>
                      <span className="text-black font-bold">{order.product_name}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400 font-black uppercase">Quantity</span>
                      <span className="text-black font-black">{order.quantity}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl py-2 h-9 text-[9px] font-black uppercase tracking-widest border-slate-200"
                    onClick={() => toast.info(order.message || 'No message')}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/products', label: 'Products', icon: Package, end: false },
  { path: '/admin/categories', label: 'Categories', icon: Folder, end: false },
  { path: '/admin/coupons', label: 'Coupons', icon: Tag, end: false },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart, end: false },
  { path: '/admin/bulk-orders', label: 'Bulk Orders', icon: Layers, end: false },
  { path: '/admin/users', label: 'Customers', icon: Users, end: false },
  { path: '/admin/audit-logs', label: 'Audit Logs', icon: History, end: false },
  { path: '/admin/settings', label: 'Settings', icon: Settings, end: false },
];

export default function AdminPanel() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out from admin panel');
    navigate('/');
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-white ${mobile ? '' : 'border-r border-slate-100'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Logo className="h-6" />
        <div className="mt-2 px-2 py-1 rounded-lg bg-primary/10 inline-flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isActive
                  ? 'bg-black text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-black'
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-xs font-black">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-black text-xs text-black truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-black transition-all mb-1"
        >
          <TrendingUp className="w-4 h-4" />
          View Store
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden">
            <Sidebar mobile />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Control</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {[
              { icon: CheckCircle, color: 'text-emerald-500', label: 'Systems' },
              { icon: Clock, color: 'text-amber-500', label: 'Queues' },
              { icon: XCircle, color: 'text-red-400', label: 'Alerts' },
            ].map(({ icon: Icon, color, label }, i) => (
              <div
                key={i}
                title={label}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center ${color} hover:bg-white hover:shadow-sm transition-all cursor-help`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            ))}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/categories" element={<CategoriesManagement />} />
            <Route path="/coupons" element={<CouponsManagement />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/bulk-orders" element={<BulkOrdersManagement />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/audit-logs" element={<AuditLogsManagement />} />
            <Route path="/settings" element={<SettingsManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
