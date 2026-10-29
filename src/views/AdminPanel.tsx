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
import InquiriesManagement from '@/components/admin/InquiriesManagement';
import AdminCredentialsManagement from '@/components/admin/AdminCredentialsManagement';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-700 text-ink border-ink',
    processing: 'bg-blue-500/10 text-blue-700 text-ink border-ink',
    shipped: 'bg-saturn-orange text-white border-ink',
    delivered: 'bg-emerald-500/10 text-emerald-700 text-ink border-ink',
    completed: 'bg-emerald-500/10 text-emerald-700 text-ink border-ink',
    contacted: 'bg-blue-500/10 text-blue-700 text-ink border-ink',
    cancelled: 'bg-red-500 text-white border-ink',
    suspended: 'bg-red-500 text-white border-ink',
    active: 'bg-emerald-500/10 text-emerald-700 text-ink border-ink',
  };

  return (
    <span className={`px-2.5 py-0.5 border-2 font-mono text-[9px] font-black uppercase tracking-wider inline-flex items-center shadow-precision-xs ${styles[status] || 'bg-amber-500/10 text-amber-700 text-ink border-ink'}`}>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) => (
  <div className="stat-card bg-white hairline p-5 sm:p-6 transition-all rounded-xl hover:bg-neutral-50">
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div className={`w-9 h-9 border border-ink flex items-center justify-center rounded-xl ${color}`}>
        <Icon className="w-4 h-4 text-ink" />
      </div>
      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-studio-light border border-ink/30 text-ink uppercase">SYS::LIVE</span>
    </div>
    <div className="text-2xl sm:text-3xl font-black font-mono text-ink mb-1 tracking-tight">{value}</div>
    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink/70">{label}</div>
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

  // Snappy brutal entrance animation
  useEffect(() => {
    if (!loading) {
      import('gsap').then(({ gsap }) => {
        gsap.from('.stat-card', {
          y: 24,
          opacity: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power4.out'
        });
        gsap.from('.dashboard-section', {
          y: 24,
          opacity: 0,
          duration: 0.5,
          delay: 0.2,
          ease: 'power4.out'
        });
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 relative">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatCard label="Total Revenue" value={`₹${(stats?.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={DollarSign} color="bg-emerald-500/10 text-emerald-700" />
        <StatCard label="Order Volume" value={stats?.orderVolume ?? 0} icon={BarChart3} color="bg-amber-500/10 text-amber-700" />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingCart} color="bg-blue-500/10 text-blue-700" />
        <StatCard label="Active Inventory" value={stats?.activeInventory ?? 0} icon={Layers} color="bg-saturn-orange" />
        <StatCard label="Catalog Parts" value={stats?.totalProducts ?? 0} icon={Package} color="bg-studio-light" />
      </div>

      {/* Quick Actions for Mobile */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        <NavLink
          to="/admin/products"
          className="flex flex-col items-center justify-center p-4 bg-white border hairline shadow-precision-sm space-y-2 active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 border hairline bg-amber-500/10 text-amber-700 text-ink flex items-center justify-center shadow-precision-xs">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-ink">Add Product</span>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className="flex flex-col items-center justify-center p-4 bg-white border hairline shadow-precision-sm space-y-2 active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 border hairline bg-saturn-orange text-white flex items-center justify-center shadow-precision-xs">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-ink">View Orders</span>
        </NavLink>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section card-precision bg-white border hairline shadow-precision-sm overflow-hidden">
        <div className="px-6 py-4 bg-amber-500/10 text-amber-700 border-b hairline flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black bg-ink text-paper px-2 py-0.5 uppercase">FEED::01</span>
            <h2 className="font-display font-black text-sm text-ink uppercase tracking-wider">Recent Orders Manifest</h2>
          </div>
          <span className="font-mono text-[10px] font-bold text-ink/70 uppercase">Realtime Stream</span>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-ink/50 font-mono font-black text-xs uppercase tracking-widest">
            No orders manifest logged yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table">
              <thead className="bg-ink text-paper border-b hairline">
                <tr>
                  <th className="px-6 py-3.5 text-left font-mono text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Order ID</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Customer</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Amount</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Status</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[10px] font-black uppercase tracking-wider text-paper">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10 font-mono">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-500/10 text-amber-700/15 transition-colors">
                    <td className="px-6 py-4 font-black text-xs text-ink">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-medium text-xs text-ink/80">
                      {order.users?.name || 'Guest'}
                    </td>
                    <td className="px-6 py-4 font-black text-xs text-saturn-orange">
                      ₹{order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-4 font-medium text-xs text-ink/60">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y-2 divide-ink/10">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-5 active:bg-amber-500/10 text-amber-700/10 transition-colors space-y-3 font-mono">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-black text-xs text-ink">#{order.id.slice(0, 8)}</div>
                      <div className="text-[10px] text-ink/60 font-medium">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="font-medium text-sm text-ink/80">
                      {order.users?.name || 'Guest'}
                    </div>
                    <div className="font-black text-base text-saturn-orange">
                      ₹{order.total_amount.toFixed(2)}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75">
      <div className="card-precision bg-studio-light border hairline shadow-precision-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-amber-500/10 text-amber-700 z-10 flex items-center justify-between p-6 border-b hairline">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[9px] font-black bg-ink text-paper px-2 py-0.5 uppercase">SPEC::MOD</span>
              <h2 className="font-display font-black text-lg text-ink uppercase tracking-tight">
                {isEdit ? 'Edit Catalog Component' : 'Register New Part'}
              </h2>
            </div>
            <p className="text-[10px] font-mono font-bold text-ink/70 uppercase tracking-wider">
              UploadThing multi-asset & technical parameter manifest
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 border hairline bg-white flex items-center justify-center hover:bg-saturn-orange hover:text-white shadow-precision-xs active:scale-[0.98] transition-colors"
          >
            <X className="w-5 h-5 text-ink" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 font-mono">
          {/* UploadThing Multi-Image Drag and Drop */}
          <div className="space-y-2">
            <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center justify-between">
              <span>01 / CAD & Render Gallery (Drag & Drop)</span>
              <span className="text-[9px] text-ink/60 font-bold uppercase">Max 8MB (JPEG, PNG, WebP)</span>
            </Label>
            
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-black/20 hover:bg-amber-500/10 text-amber-700/20 p-6 text-center cursor-pointer transition-colors bg-white shadow-precision-xs flex flex-col items-center justify-center gap-2 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
              <div className="w-12 h-12 border hairline bg-amber-500/10 text-amber-700 shadow-precision-xs flex items-center justify-center text-ink group-hover:scale-105 transition-transform">
                {uploading ? <Loader2 className="w-6 h-6 animate-spin text-saturn-orange" /> : <UploadCloud className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-xs font-black text-ink uppercase tracking-wider">
                  {uploading ? 'Transmitting to Saturn Storage...' : 'Click or drop visual asset'}
                </p>
                <p className="text-[10px] text-ink/60 font-bold mt-0.5">UploadThing secure pipeline</p>
              </div>
            </div>

            {/* Thumbnail Preview strip */}
            {images.length > 0 && (
              <div className="flex gap-2 pt-2 overflow-x-auto pb-1">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative w-16 h-16 border hairline shadow-precision-xs overflow-hidden group flex-shrink-0 bg-white">
                    <img src={imgUrl} alt="Thumb" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const next = images.filter((_, i) => i !== idx);
                        setImages(next);
                        if (form.image === imgUrl) setForm((p) => ({ ...p, image: next[0] || '' }));
                      }}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-ink text-white border border-ink flex items-center justify-center text-[10px] hover:bg-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-saturn-orange text-white text-[7px] font-black text-center uppercase tracking-tight py-0.5 border-t border-ink">
                        PRIMARY
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">02 / Component Name</Label>
            <Input
              name="name"
              placeholder="Saturn S1 Industrial Carbon Bracket"
              value={form.name}
              onChange={handleChange}
              required
              className="h-11 border hairline font-mono font-bold shadow-precision-xs bg-white focus:border-saturn-orange"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">03 / Engineering Description</Label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="High-load carbon fiber reinforced component..."
              className="w-full px-3 py-2.5 border hairline font-mono text-xs font-medium resize-none focus:outline-none focus:border-saturn-orange shadow-precision-xs bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">04 / Unit Price (INR)</Label>
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="499.00"
                value={form.price}
                onChange={handleChange}
                required
                className="h-11 border hairline font-mono font-bold shadow-precision-xs bg-white focus:border-saturn-orange"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">05 / Inventory Stock</Label>
              <Input
                name="stock"
                type="number"
                min="0"
                placeholder="50"
                value={form.stock}
                onChange={handleChange}
                required
                className="h-11 border hairline font-mono font-bold shadow-precision-xs bg-white focus:border-saturn-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">06 / Category</Label>
              <Input
                name="category"
                placeholder="Aerospace & Drone"
                value={form.category}
                onChange={handleChange}
                required
                className="h-11 border hairline font-mono font-bold shadow-precision-xs bg-white focus:border-saturn-orange"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">07 / Storefront Status</Label>
              <select
                name="is_active"
                value={form.is_active ? 'true' : 'false'}
                onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.value === 'true' }))}
                className="w-full h-11 px-3 border hairline font-mono text-xs font-bold focus:outline-none focus:border-saturn-orange shadow-precision-xs bg-white"
              >
                <option value="true">Active (Published)</option>
                <option value="false">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border hairline bg-white font-mono font-black uppercase tracking-wider text-xs shadow-precision-xs hover:bg-studio-light active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 h-11 border hairline bg-saturn-orange text-white font-mono font-black uppercase tracking-wider text-xs shadow-precision-xs hover:bg-ink hover:text-paper active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
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
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] font-black bg-ink text-paper px-2 py-0.5 uppercase">MOD::02</span>
            <h1 className="font-display font-black text-2xl text-ink uppercase tracking-tight">Catalog Components</h1>
          </div>
          <p className="font-mono text-xs text-ink/70 font-bold uppercase tracking-wider">
            Industrial inventory manifest & 3D print stock control
          </p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="hidden sm:inline-flex h-11 px-6 border hairline bg-saturn-orange text-white font-mono font-black uppercase tracking-wider text-xs items-center justify-center gap-2 shadow-precision-sm hover:-translate-y-0.5 hover:shadow-precision-md active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4 text-white" /> Register Component
        </button>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => { setEditProduct(null); setShowForm(true); }}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-saturn-orange text-white border hairline shadow-precision-sm flex items-center justify-center z-40 active:scale-[0.98] transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="SEARCH CATALOG (NAME, CATEGORY)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 border hairline font-mono font-bold shadow-precision-xs bg-white uppercase tracking-wider placeholder:text-ink/40 focus:border-saturn-orange"
        />
      </div>

      {/* Table */}
      <div className="card-precision bg-white border hairline shadow-precision-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-ink/50 font-mono font-black text-xs uppercase tracking-widest">
            No catalog components found. Click Register Component to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table font-mono">
              <thead className="bg-ink text-paper border-b hairline">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Part / Component</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Sector / Category</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Unit Price</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Stock</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Status</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-black uppercase tracking-wider text-paper">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-amber-500/10 text-amber-700/15 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 border hairline shadow-precision-xs overflow-hidden bg-studio-light flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${product.id}/100/100`; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-xs text-ink truncate max-w-[220px]">{product.name}</div>
                          <div className="text-[10px] text-ink/60 font-bold truncate max-w-[180px]">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-ink/80">{product.category}</td>
                    <td className="px-6 py-4 font-black text-xs text-saturn-orange">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-black text-xs ${product.stock === 0 ? 'text-red-500 bg-red-100 px-1.5 py-0.5 border border-red-500' : product.stock <= 5 ? 'text-ink bg-amber-500/10 text-amber-700 px-1.5 py-0.5 border border-ink' : 'text-ink'}`}>
                        {product.stock} PCS
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.is_active ? 'active' : 'suspended'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditProduct(product); setShowForm(true); }}
                          title="Edit Component"
                          className="w-8 h-8 border hairline bg-white flex items-center justify-center hover:bg-amber-500/10 text-amber-700 text-ink shadow-precision-xs active:scale-[0.98] transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          title="Delete Component"
                          className="w-8 h-8 border hairline bg-white flex items-center justify-center hover:bg-red-500 hover:text-white text-ink shadow-precision-xs active:scale-[0.98] transition-all"
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
            <div className="md:hidden divide-y-2 divide-ink/10 font-mono">
              {products.map((product) => (
                <div key={product.id} className="p-5 active:bg-amber-500/10 text-amber-700/10 transition-colors space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 border hairline shadow-precision-xs overflow-hidden bg-studio-light flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${product.id}/100/100`; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-black text-sm text-ink truncate">{product.name}</div>
                        <StatusBadge status={product.is_active ? 'active' : 'suspended'} />
                      </div>
                      <div className="text-[10px] text-ink/70 font-bold truncate mt-0.5">{product.category}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="font-black text-sm text-saturn-orange">₹{product.price.toFixed(2)}</div>
                        <div className="h-3 w-px bg-ink/20" />
                        <div className="text-[10px] font-black uppercase text-ink/70">Stock: {product.stock}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditProduct(product); setShowForm(true); }}
                      className="flex-1 h-9 border hairline bg-white text-[10px] font-black uppercase tracking-wider gap-2 flex items-center justify-center shadow-precision-xs hover:bg-amber-500/10 text-amber-700 active:scale-[0.98] transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="w-10 h-9 border hairline bg-white text-ink flex items-center justify-center hover:bg-red-500 hover:text-white shadow-precision-xs active:scale-[0.98] transition-all"
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] font-black bg-ink text-paper px-2 py-0.5 uppercase">MOD::03</span>
            <h1 className="font-display font-black text-2xl text-ink uppercase tracking-tight">Order Fulfillment Manifest</h1>
          </div>
          <p className="font-mono text-xs text-ink/70 font-bold uppercase tracking-wider">
            Track order fulfillment, courier manifests & tax invoices
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 border hairline font-mono text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap shadow-precision-xs active:scale-[0.98] ${
              statusFilter === s ? 'bg-saturn-orange text-white' : 'bg-white text-ink hover:bg-amber-500/10 text-amber-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-precision bg-white border hairline shadow-precision-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-ink/50 font-mono font-black text-xs uppercase tracking-widest">
            No orders manifest found for current status filter
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table font-mono">
              <thead className="bg-ink text-paper border-b hairline">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Order ID</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Client</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Payload</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Valuation</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Status</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Tracking</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-black uppercase tracking-wider text-paper">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-amber-500/10 text-amber-700/15 transition-colors">
                      <td className="px-6 py-4 font-black text-xs text-ink">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <div className="font-black text-xs text-ink">
                          {order.users?.name || 'Guest'}
                        </div>
                        <div className="text-[10px] text-ink/60 font-bold">
                          {order.users?.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-ink/80">
                        {order.order_items?.length ?? 0} component(s)
                      </td>
                      <td className="px-6 py-4 font-black text-xs text-saturn-orange">
                        ₹{order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative group min-w-[120px]">
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
                      </td>
                      <td className="px-6 py-4">
                        {order.tracking_number ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-black text-ink uppercase tracking-tight">{order.carrier}</span>
                            <span className="text-[9px] font-bold text-ink/70 font-mono">{order.tracking_number}</span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-bold text-ink/40 uppercase italic">Awaiting Dispatch</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 ml-auto">
                          <button
                            title="Generate Tax Invoice"
                            onClick={() => setSelectedInvoiceId(order.id)}
                            className="w-8 h-8 border hairline flex items-center justify-center transition-all bg-white text-ink hover:bg-amber-500/10 text-amber-700 shadow-precision-xs active:scale-[0.98]"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            title="Inspect Payload"
                            className={`w-8 h-8 border hairline flex items-center justify-center transition-all shadow-precision-xs active:scale-[0.98] ${
                              expandedOrder === order.id ? 'bg-saturn-orange text-white' : 'bg-white text-ink hover:bg-amber-500/10 text-amber-700'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={7} className="px-6 py-6 bg-studio-light border-b-2 border-ink">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Order Items */}
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-mono font-black uppercase tracking-wider text-ink flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-saturn-orange border border-ink" />
                                Manifest Items
                              </h4>
                              <div className="space-y-2">
                                {(order.order_items || []).map((item) => (
                                  <div key={item.id} className="flex items-center gap-4 bg-white p-3 border hairline shadow-precision-xs">
                                    <div className="w-12 h-12 border border-ink overflow-hidden flex-shrink-0 bg-studio-light">
                                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-black text-xs text-ink truncate">{item.name}</div>
                                      <div className="text-[10px] text-ink/70 font-bold">
                                        Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                      </div>
                                    </div>
                                    <div className="font-black text-xs text-saturn-orange font-mono">
                                      ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Delivery & Shipping */}
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-mono font-black uppercase tracking-wider text-ink flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-amber-500/10 text-amber-700 border border-ink" />
                                Courier & Dispatch Route
                              </h4>

                              {updatingDelivery === order.id ? (
                                <div className="bg-white p-5 border hairline shadow-precision-sm space-y-4">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[10px] font-mono font-black uppercase tracking-wider text-ink">Carrier</Label>
                                      <Input
                                        placeholder="e.g. BlueDart / Delhivery"
                                        className="h-9 text-xs font-bold border hairline bg-studio-light font-mono"
                                        value={deliveryForm.carrier}
                                        onChange={(e) => setDeliveryForm({ ...deliveryForm, carrier: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[10px] font-mono font-black uppercase tracking-wider text-ink">Tracking AWB</Label>
                                      <Input
                                        placeholder="Enter AWB Code"
                                        className="h-9 text-xs font-bold border hairline bg-studio-light font-mono"
                                        value={deliveryForm.tracking_number}
                                        onChange={(e) => setDeliveryForm({ ...deliveryForm, tracking_number: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      className="flex-1 border hairline bg-saturn-orange text-white font-mono font-black uppercase tracking-wider text-[10px] h-9 shadow-precision-xs hover:bg-ink active:scale-[0.98] transition-all"
                                      onClick={() => handleUpdateDelivery(order.id)}
                                    >
                                      Save Waybill
                                    </button>
                                    <button
                                      className="border hairline bg-white font-mono font-black uppercase tracking-wider text-[10px] h-9 px-4 shadow-precision-xs hover:bg-studio-light active:scale-[0.98] transition-all"
                                      onClick={() => setUpdatingDelivery(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-white p-4 border hairline shadow-precision-xs space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="text-[10px] font-mono font-black uppercase tracking-wider text-ink/70 mb-1">Destination Address</div>
                                      <div className="text-xs font-mono font-bold text-ink space-y-0.5">
                                        <div>{order.shipping_address?.line1}</div>
                                        <div>{order.shipping_address?.city}, {order.shipping_address?.postal_code}</div>
                                        <div>{order.shipping_address?.country}</div>
                                      </div>
                                    </div>
                                    <button
                                      className="h-8 border hairline px-3 text-[10px] font-mono font-black uppercase tracking-wider gap-1.5 bg-amber-500/10 text-amber-700 flex items-center shadow-precision-xs hover:bg-white active:scale-[0.98] transition-all"
                                      onClick={() => {
                                        setUpdatingDelivery(order.id);
                                        setDeliveryForm({
                                          tracking_number: order.tracking_number || '',
                                          carrier: order.carrier || ''
                                        });
                                      }}
                                    >
                                      <Truck className="w-3.5 h-3.5" />
                                      {order.tracking_number ? 'Update Waybill' : 'Set Waybill'}
                                    </button>
                                  </div>

                                  {order.tracking_number && (
                                    <div className="pt-3 border-t-2 border-ink/10 flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 border hairline bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-ink shadow-precision-xs">
                                          <Truck className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <div className="text-[9px] font-mono font-black uppercase tracking-wider text-ink/70">Courier Waybill</div>
                                          <div className="text-xs font-mono font-black text-ink">{order.carrier} • {order.tracking_number}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Status Flow & Actions */}
                          <div className="mt-5 pt-4 border-t-2 border-ink flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-ink mr-1">Status Mutation:</span>
                              {(['pending', 'paid', 'processing', 'shipped', 'delivered'] as const).map((st) => (
                                <button
                                  key={st}
                                  disabled={order.status === st}
                                  onClick={() => handleStatusChange(order.id, st)}
                                  className={`px-2.5 py-1 border hairline font-mono text-[9px] font-black uppercase tracking-wider transition-all shadow-precision-xs active:scale-[0.98] ${
                                    order.status === st ? 'bg-ink text-paper opacity-50 cursor-default shadow-none' : 'bg-white hover:bg-amber-500/10 text-amber-700 text-ink'
                                  }`}
                                >
                                  Mark {st}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="h-8 border hairline px-3 text-[10px] font-mono font-black uppercase tracking-wider gap-1.5 bg-white text-ink flex items-center shadow-precision-xs hover:bg-amber-500/10 text-amber-700 active:scale-[0.98] transition-all"
                                onClick={() => setSelectedInvoiceId(order.id)}
                              >
                                <FileText className="w-3 h-3 text-saturn-orange" /> Invoice
                              </button>
                              {order.status !== 'refunded' && (
                                <button
                                  className="h-8 border hairline px-3 text-[10px] font-mono font-black uppercase tracking-wider gap-1.5 border-ink bg-red-500 text-white flex items-center shadow-precision-xs hover:bg-red-600 active:scale-[0.98] transition-all"
                                  onClick={() => handleRefund(order.id, order.total_amount)}
                                >
                                  <RotateCcw className="w-3 h-3" /> Refund
                                </button>
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
            <div className="md:hidden divide-y-2 divide-ink/10 font-mono">
              {orders.map((order) => (
                <div key={order.id} className="bg-white">
                  <div className="p-5 active:bg-amber-500/10 text-amber-700/10 transition-colors space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-black text-xs text-ink">#{order.id.slice(0, 8)}</div>
                        <div className="text-[10px] text-ink/70 font-medium">
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
                        <div className="font-bold text-sm text-ink">
                          {order.users?.name || 'Guest'}
                        </div>
                        <div className="text-[10px] text-ink/70">
                          {order.order_items?.length ?? 0} item(s) • Total: <span className="text-saturn-orange font-black">₹{order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="w-10 h-10 border hairline bg-white flex items-center justify-center text-ink shadow-precision-xs active:scale-[0.98] transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="pt-4 border-t-2 border-ink/10 space-y-3">
                        <div className="text-[10px] space-y-1">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex justify-between py-1 border-b border-ink/5">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            className="h-8 border hairline px-3 text-[10px] font-mono font-black uppercase tracking-wider gap-1.5 bg-white text-ink flex items-center shadow-precision-xs hover:bg-amber-500/10 text-amber-700 active:scale-[0.98] transition-all"
                            onClick={() => setSelectedInvoiceId(order.id)}
                          >
                            <FileText className="w-3 h-3 text-saturn-orange" /> Invoice
                          </button>
                          {order.status !== 'refunded' && (
                            <button
                              className="h-8 border hairline px-3 text-[10px] font-mono font-black uppercase tracking-wider gap-1.5 border-ink bg-red-500 text-white flex items-center shadow-precision-xs hover:bg-red-600 active:scale-[0.98] transition-all"
                              onClick={() => handleRefund(order.id, order.total_amount)}
                            >
                              <RotateCcw className="w-3 h-3" /> Refund
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedInvoiceId && (
        <InvoiceModal orderId={selectedInvoiceId} onClose={() => setSelectedInvoiceId(null)} />
      )}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] font-black bg-ink text-paper px-2 py-0.5 uppercase">MOD::04</span>
            <h1 className="font-display font-black text-2xl text-ink uppercase tracking-tight">Access & Client Manifest</h1>
          </div>
          <p className="font-mono text-xs text-ink/70 font-bold uppercase tracking-wider">
            Manage authenticated user credentials, enterprise accounts & RBAC
          </p>
        </div>
      </div>

      <div className="card-precision bg-white border hairline shadow-precision-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-ink/50 font-mono font-black text-xs uppercase tracking-widest">
            No registered users logged
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table font-mono">
              <thead className="bg-ink text-paper border-b hairline">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">User Identity</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Status</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Registration</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-black uppercase tracking-wider text-paper">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-amber-500/10 text-amber-700/15 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border hairline shadow-precision-xs bg-amber-500/10 text-amber-700 flex items-center justify-center text-ink font-mono font-black text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-xs text-ink flex items-center gap-2">
                            {user.name}
                            {user.role === 'admin' && (
                              <span className="w-4 h-4 bg-saturn-orange text-white border border-ink flex items-center justify-center" title="Admin">
                                <ShieldCheck className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-ink/70 font-medium flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.is_blocked ? 'suspended' : 'active'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-black text-ink flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-ink/40" />
                        {new Date(user.created_at || '').toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 ml-auto">
                        <button
                          title={user.is_blocked ? 'Unblock user' : 'Suspend user'}
                          onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                          className={`w-8 h-8 border hairline flex items-center justify-center transition-all shadow-precision-xs active:scale-[0.98] ${
                            user.is_blocked
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-white text-ink hover:bg-red-100 hover:text-red-600'
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
                          className="w-8 h-8 border hairline bg-white flex items-center justify-center text-ink hover:bg-amber-500/10 text-amber-700 transition-all shadow-precision-xs active:scale-[0.98]"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y-2 divide-ink/10 font-mono">
              {users.map((user) => (
                <div key={user.id} className="p-5 active:bg-amber-500/10 text-amber-700/10 transition-colors space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border hairline shadow-precision-xs bg-amber-500/10 text-amber-700 flex items-center justify-center text-ink font-mono font-black text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-xs text-ink flex items-center gap-1.5">
                          {user.name}
                          {user.role === 'admin' && <ShieldCheck className="w-3 h-3 text-saturn-orange" />}
                        </div>
                        <div className="text-[10px] text-ink/70 font-medium">{user.email}</div>
                      </div>
                    </div>
                    <StatusBadge status={user.is_blocked ? 'suspended' : 'active'} />
                  </div>

                  <div className="flex justify-between items-center bg-studio-light p-3 border hairline">
                    <div className="text-[10px] font-black text-ink/70 flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(user.created_at || '').toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        title={user.is_blocked ? 'Unblock user' : 'Suspend user'}
                        onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                        className={`w-8 h-8 border hairline flex items-center justify-center transition-all shadow-precision-xs ${
                          user.is_blocked
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-ink hover:bg-red-100'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(user.email);
                          toast.success('Email copied');
                        }}
                        className="w-8 h-8 border hairline bg-white flex items-center justify-center text-ink shadow-precision-xs active:scale-[0.98]"
                      >
                        <Mail className="w-3.5 h-3.5" />
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
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] font-black bg-ink text-paper px-2 py-0.5 uppercase">MOD::05</span>
            <h1 className="font-display font-black text-2xl text-ink uppercase tracking-tight">Enterprise & Bulk Inquiries</h1>
          </div>
          <p className="font-mono text-xs text-ink/70 font-bold uppercase tracking-wider">
            Manage institutional prototyping, batch manufacturing & volume inquiries
          </p>
        </div>
        <button
          className="border hairline font-mono font-black uppercase tracking-wider text-[10px] h-10 px-4 bg-white text-ink shadow-precision-xs hover:bg-amber-500/10 text-amber-700 flex items-center gap-2 active:scale-[0.98] transition-all"
          onClick={fetchBulkOrders}
        >
          <Clock className="w-3.5 h-3.5" />
          Refresh Pipeline
        </button>
      </div>

      <div className="card-precision bg-white border hairline shadow-precision-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          </div>
        ) : bulkOrders.length === 0 ? (
          <div className="py-24 text-center space-y-3 font-mono">
            <div className="w-14 h-14 border hairline bg-studio-light flex items-center justify-center mx-auto text-ink shadow-precision-xs">
              <Layers className="w-7 h-7" />
            </div>
            <div className="text-ink/60 font-black text-xs uppercase tracking-widest">
              No enterprise batch inquiries logged yet
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table font-mono">
              <thead className="bg-ink text-paper border-b hairline">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Company / Contact</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Component</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Quantity</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Status</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Date</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-black uppercase tracking-wider text-paper">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10">
                {bulkOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-500/10 text-amber-700/15 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-xs text-ink uppercase">{order.company_name || 'Individual'}</span>
                        <span className="text-[10px] text-ink/70 font-bold flex items-center gap-1 mt-0.5">
                          {order.name} • {order.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-saturn-orange border border-ink" />
                        <span className="font-bold text-xs text-ink">{order.product_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-xs text-ink font-mono">{order.quantity} PCS</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-ink/70 font-mono">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="w-8 h-8 border hairline bg-white flex items-center justify-center text-ink shadow-precision-xs hover:bg-amber-500/10 text-amber-700 active:scale-[0.98] transition-all ml-auto"
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
            <div className="md:hidden divide-y-2 divide-ink/10 font-mono">
              {bulkOrders.map((order) => (
                <div key={order.id} className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-black text-xs text-ink uppercase">{order.company_name || 'Individual'}</div>
                      <div className="text-[10px] text-ink/70">{order.email}</div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="bg-studio-light p-3 border hairline space-y-1.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-ink/60 font-black uppercase">Product:</span>
                      <span className="text-ink font-bold">{order.product_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink/60 font-black uppercase">Quantity:</span>
                      <span className="text-ink font-black">{order.quantity} PCS</span>
                    </div>
                  </div>
                  <button
                    className="w-full border hairline py-2 h-9 text-[9px] font-mono font-black uppercase tracking-wider bg-white shadow-precision-xs hover:bg-amber-500/10 text-amber-700 active:scale-[0.98]"
                    onClick={() => toast.info(order.message || 'No message')}
                  >
                    View Details
                  </button>
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
// ADMIN LAYOUT & TAB SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'categories' 
  | 'orders' 
  | 'inquiries' 
  | 'credentials' 
  | 'users' 
  | 'coupons' 
  | 'audit-logs' 
  | 'settings';

const navTabs: { id: AdminTab; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Folder },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'inquiries', label: 'Inquiries', icon: Mail },
  { id: 'credentials', label: 'Credentials', icon: ShieldCheck },
  { id: 'users', label: 'Customers', icon: Users },
  { id: 'coupons', label: 'Coupons', icon: Tag },
  { id: 'audit-logs', label: 'Audit Logs', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminPanel() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync tab from URL query parameter if present (?tab=products)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const queryTab = sp.get('tab') as AdminTab | null;
      if (queryTab && navTabs.some(t => t.id === queryTab)) {
        setActiveTab(queryTab);
      }
    }
  }, []);

  // Guardrail: Ensure admin stays strictly noindex dynamically
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
      created = true;
    }
    const previous = meta.content;
    meta.content = 'noindex, nofollow';

    return () => {
      if (created) {
        meta?.remove();
      } else if (meta) {
        meta.content = previous || 'index, follow';
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Continue cleanup
    }
    logout();
    toast.success('Admin session terminated successfully');
    navigate('/admin');
  };

  const handleSelectTab = (tabId: AdminTab) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    if (typeof window !== 'undefined') {
      const newUrl = tabId === 'dashboard' ? '/admin' : `/admin?tab=${tabId}`;
      window.history.pushState(null, '', newUrl);
    }
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-studio-light ${mobile ? '' : 'border-r hairline'}`}>
      {/* Logo Header */}
      <div className="p-6 border-b hairline bg-amber-500/10 text-amber-700/20">
        <Logo className="h-6" />
        <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 border hairline bg-saturn-orange text-white shadow-precision-xs">
          <div className="w-1.5 h-1.5 bg-white animate-pulse" />
          <span className="text-[9px] font-mono font-black uppercase tracking-wider">COMMAND::ADMIN</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto font-mono">
        {navTabs.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-2 text-left ${
                isActive
                  ? 'bg-saturn-orange text-white border-ink shadow-precision-xs translate-x-1'
                  : 'text-ink/80 border-transparent hover:border-ink hover:bg-amber-500/10 text-amber-700 hover:text-ink'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Dedicated Signout Tab Item in Nav */}
        <div className="pt-2 mt-2 border-t-2 border-ink/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-2 border-transparent text-red-600 hover:border-ink hover:bg-red-500 hover:text-white"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* User Info + Storefront Button */}
      <div className="p-4 border-t hairline bg-white/60 font-mono">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 border hairline shadow-precision-xs bg-amber-500/10 text-amber-700 flex items-center justify-center text-ink text-xs font-black">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0">
            <div className="font-black text-xs text-ink truncate">{user?.name || 'Saturn Admin'}</div>
            <div className="text-[10px] text-ink/60 truncate font-bold">{user?.email || 'saturn3d@gmail.com'}</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border hairline text-xs font-black uppercase tracking-wider text-ink bg-white hover:bg-amber-500/10 text-amber-700 transition-all shadow-precision-xs active:scale-[0.98]"
        >
          <TrendingUp className="w-3.5 h-3.5 text-saturn-orange" />
          Storefront
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-studio-light pattern-blueprint flex font-mono">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-ink/70 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden border-r hairline">
            <Sidebar mobile />
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-studio-light border-b hairline px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden w-10 h-10 border hairline bg-white flex items-center justify-center text-ink shadow-precision-xs active:scale-[0.98] transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-ink uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-700 border border-ink">
                SYS::NODE//BHOPAL-PRIMARY
              </span>
              <span className="text-[10px] font-mono font-bold text-ink/70 uppercase">
                ACTIVE VIEW: {navTabs.find(t => t.id === activeTab)?.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleSelectTab('credentials')}
              className="h-9 px-3 border hairline bg-white shadow-precision-xs text-[10px] font-black uppercase tracking-wider text-ink hover:bg-amber-500/10 text-amber-700 flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-saturn-orange" />
              <span className="hidden md:inline">Credentials</span>
            </button>
            <button
              onClick={handleLogout}
              className="h-9 px-3 border hairline bg-red-500 text-white shadow-precision-xs text-[10px] font-black uppercase tracking-wider hover:bg-red-600 flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Tab Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'products' && <ProductsManagement />}
          {activeTab === 'categories' && <CategoriesManagement />}
          {activeTab === 'orders' && <OrdersManagement />}
          {activeTab === 'inquiries' && <InquiriesManagement />}
          {activeTab === 'credentials' && <AdminCredentialsManagement />}
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'coupons' && <CouponsManagement />}
          {activeTab === 'audit-logs' && <AuditLogsManagement />}
          {activeTab === 'settings' && <SettingsManagement />}
        </main>
      </div>
    </div>
  );
}

