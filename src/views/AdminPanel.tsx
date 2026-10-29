import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, LogOut,
  Plus, Pencil, Trash2, Loader2, TrendingUp, DollarSign,
  CheckCircle, Clock, XCircle, ChevronDown, X, Menu, Eye,
  Truck, ShieldCheck, Mail, Calendar, Layers, BarChart3,
  Tag, Folder, History, Settings, UploadCloud, FileText,
  RotateCcw, Ban, Check, ArrowRight, Sparkles, Globe, MapPin, Bot, Search, ExternalLink, HelpCircle, CheckCircle2
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
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    processing: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    shipped: 'bg-[#FF5A1F]/10 text-[#FF5A1F] border-[#FF5A1F]/20',
    delivered: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    contacted: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
    suspended: 'bg-red-500/10 text-red-600 border-red-500/20',
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    refunded: 'bg-neutral-100 text-[#5B616B] border-neutral-200',
  };

  return (
    <span className={`px-2.5 py-0.5 border rounded-full font-mono text-[10px] font-medium uppercase tracking-wider inline-flex items-center ${styles[status] || 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) => (
  <div className="stat-card bg-white rounded-2xl border border-[#0B0D10]/10 p-5 sm:p-6 shadow-sm hover:border-[#0B0D10]/20 transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10 uppercase">
        SYS // LIVE
      </span>
    </div>
    <div className="text-2xl sm:text-3xl font-semibold font-mono text-[#0B0D10] mb-1 tracking-tight">{value}</div>
    <div className="text-xs font-mono text-[#5B616B] uppercase tracking-wider">{label}</div>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2 relative font-mono">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
        <StatCard label="Total Revenue" value={`₹${(stats?.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={DollarSign} color="bg-emerald-500/10 text-emerald-600" />
        <StatCard label="Order Volume" value={stats?.orderVolume ?? 0} icon={BarChart3} color="bg-[#FF5A1F]/10 text-[#FF5A1F]" />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingCart} color="bg-sky-500/10 text-sky-600" />
        <StatCard label="Active Inventory" value={stats?.activeInventory ?? 0} icon={Layers} color="bg-indigo-500/10 text-indigo-600" />
        <StatCard label="Catalog Parts" value={stats?.totalProducts ?? 0} icon={Package} color="bg-amber-500/10 text-amber-600" />
      </div>

      {/* Quick Actions for Mobile */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        <NavLink
          to="/admin/products"
          className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm space-y-2 active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-medium text-[#0B0D10]">Add Product</span>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm space-y-2 active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0B0D10] text-white flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-medium text-[#0B0D10]">View Orders</span>
        </NavLink>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-[#F5F6F8] border-b border-[#0B0D10]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10">
              FEED // 01
            </span>
            <h2 className="text-sm font-semibold text-[#0B0D10]">Recent Orders Manifest</h2>
          </div>
          <span className="text-[11px] text-[#5B616B]">Realtime Stream</span>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-[#5B616B] text-xs uppercase tracking-widest">
            No orders manifest logged yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table">
              <thead className="bg-[#F5F6F8] border-b border-[#0B0D10]/10 text-[#5B616B]">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B0D10]/5 font-mono">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-xs text-[#0B0D10]">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-xs text-[#0B0D10]/80">
                      {order.users?.name || 'Guest'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-xs text-[#FF5A1F]">
                      ₹{order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-4 text-xs text-[#5B616B]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[#0B0D10]/5">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-4 active:bg-[#F5F6F8]/50 transition-colors space-y-2 font-mono">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-xs text-[#0B0D10]">#{order.id.slice(0, 8)}</div>
                      <div className="text-[10px] text-[#5B616B]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xs text-[#0B0D10]">
                      {order.users?.name || 'Guest'}
                    </div>
                    <div className="font-semibold text-sm text-[#FF5A1F]">
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
// PRODUCT FORM MODAL WITH COMPREHENSIVE SEO, GEO & AEO CONTROLS
// ─────────────────────────────────────────────────────────────────────────────
interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

function ProductForm({ product, onClose, onSaved }: ProductFormProps) {
  const isEdit = Boolean(product);
  const [activeFormTab, setActiveFormTab] = useState<'general' | 'seo' | 'geo' | 'aeo'>('general');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // General fields
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: (product as any)?.slug || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    image: product?.image || '',
    category: product?.category || 'Aerospace & Drone',
    stock: product?.stock?.toString() || '0',
    is_active: product?.is_active !== false,
  });

  const [images, setImages] = useState<string[]>(product?.image ? [product.image] : []);

  // SEO fields
  const initialSeo = (product?.seo_fields as any)?.seo || {};
  const [seoForm, setSeoForm] = useState({
    meta_title: initialSeo.meta_title || '',
    meta_description: initialSeo.meta_description || '',
    keywords: initialSeo.keywords || '',
    canonical_url: initialSeo.canonical_url || '',
    og_image: initialSeo.og_image || '',
    indexable: initialSeo.indexable !== false,
  });

  // GEO fields
  const initialGeo = (product?.seo_fields as any)?.geo || {};
  const [geoForm, setGeoForm] = useState({
    target_city: initialGeo.target_city || 'Bhopal',
    target_region: initialGeo.target_region || 'Madhya Pradesh & Central India Hub',
    geo_placename: initialGeo.geo_placename || 'Govindpura Industrial Area, Bhopal, MP 462023, India',
    geo_position: initialGeo.geo_position || '23.259933;77.412615',
    service_scope: initialGeo.service_scope || 'Local Same-Day Bhopal Dispatch • 24-48h Pan-India Express Air Cargo',
    dispatch_lead_time: initialGeo.dispatch_lead_time || '24-48 Hours',
  });

  // AEO fields
  const initialAeo = (product?.seo_fields as any)?.aeo || {};
  const [aeoForm, setAeoForm] = useState<{
    direct_answer: string;
    material_grade: string;
    tolerance_rating: string;
    technology_process: string;
    ai_keywords: string;
    faq_items: Array<{ question: string; answer: string }>;
  }>({
    direct_answer: initialAeo.direct_answer || '',
    material_grade: initialAeo.material_grade || '',
    tolerance_rating: initialAeo.tolerance_rating || '±0.04 mm',
    technology_process: initialAeo.technology_process || 'Industrial CoreXY FFF / Continuous Carbon Extrusion',
    ai_keywords: initialAeo.ai_keywords || '',
    faq_items: initialAeo.faq_items && initialAeo.faq_items.length > 0 ? (initialAeo.faq_items as Array<{ question: string; answer: string }>) : [
      {
        question: 'Where is this custom component fabricated?',
        answer: 'Fabricated at the Saturn 3D Additive Fabrication Facility in Sector B, Govindpura Industrial Area, Bhopal, MP, India.',
      },
      {
        question: 'What are the manufacturing tolerances and surface finish?',
        answer: 'Printed with calibrated industrial tolerances of ±0.04 mm, offering high isotropic layer bonding and engineering-grade durability.',
      },
      {
        question: 'How fast is dispatch across India?',
        answer: 'Orders are fabricated and dispatched within 24-48 hours with priority express air shipping to Delhi, Mumbai, Bengaluru, Pune, Hyderabad, and all Indian pincodes.',
      },
    ],
  });

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
        toast.success('Visual asset uploaded successfully');
      }
    } catch (err) {
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

  const handleAddFaqItem = () => {
    setAeoForm((prev) => ({
      ...prev,
      faq_items: [
        ...prev.faq_items,
        { question: '', answer: '' },
      ],
    }));
  };

  const handleUpdateFaqItem = (index: number, field: 'question' | 'answer', val: string) => {
    setAeoForm((prev) => {
      const updated = [...prev.faq_items];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, faq_items: updated };
    });
  };

  const handleRemoveFaqItem = (index: number) => {
    setAeoForm((prev) => ({
      ...prev,
      faq_items: prev.faq_items.filter((_: { question: string; answer: string }, i: number) => i !== index),
    }));
  };

  // Magic 1-click Auto-Fill for SEO, GEO & AEO
  const autoGenerateSeoGeoAeo = () => {
    if (!form.name.trim()) {
      toast.error('Please enter a component name in the General tab first');
      return;
    }
    const cleanName = form.name.trim();
    const cat = form.category || 'Rapid Prototyping';
    const slugClean = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    let mat = 'Industrial Engineering Grade Polymer';
    if (cleanName.toLowerCase().includes('carbon') || cat.toLowerCase().includes('drone')) {
      mat = 'Carbon-X PA12 Carbon Fiber (Continuous Chopped Fiber)';
    } else if (cleanName.toLowerCase().includes('impeller') || cleanName.toLowerCase().includes('gear') || cat.toLowerCase().includes('sla') || cat.toLowerCase().includes('resin')) {
      mat = '12K High-Definition Tough SLA Photopolymer Resin';
    } else if (cat.toLowerCase().includes('interior') || cat.toLowerCase().includes('gift')) {
      mat = 'Matte Architectural PLA / Industrial PETG';
    }

    setSeoForm({
      meta_title: `${cleanName} | 3D Printing Bhopal & India | Saturn 3D`,
      meta_description: `High-precision 3D printed ${cleanName} for ${cat}. Manufactured with ±0.04 mm tolerance at Saturn 3D additive hub in Bhopal, MP. Fast 24-48h dispatch across India.`,
      keywords: `${cleanName}, 3d printing bhopal, 3d printing service madhya pradesh, custom ${cat.toLowerCase()} 3d printing, industrial additive manufacturing india, saturn 3d printing`,
      canonical_url: `/product/${slugClean}`,
      og_image: form.image || '/showcase/carbon-drone-spar.jpg',
      indexable: true,
    });

    setGeoForm({
      target_city: 'Bhopal',
      target_region: 'Madhya Pradesh & Central India Hub',
      geo_placename: 'Govindpura Industrial Area, Bhopal, MP 462023, India',
      geo_position: '23.259933;77.412615',
      service_scope: 'Local Same-Day Bhopal Dispatch • 24-48h Pan-India Express Air Cargo',
      dispatch_lead_time: '24-48 Hours',
    });

    setAeoForm({
      direct_answer: `Saturn 3D manufactures the ${cleanName} in Bhopal, Madhya Pradesh using ${mat} with industrial tolerance of ±0.04 mm, dispatching nationwide with zero minimum order quantity.`,
      material_grade: mat,
      tolerance_rating: '±0.04 mm',
      technology_process: mat.includes('Resin') ? '12K High-Resolution SLA Photopolymerization' : 'High-Speed Enclosed CoreXY FFF Extrusion',
      ai_keywords: `best 3d printing in bhopal, who manufactures ${cleanName.toLowerCase()} in india, 3d printing price in bhopal, saturn 3d lab`,
      faq_items: [
        {
          question: `Where is the ${cleanName} 3D printed?`,
          answer: `Fabricated at the Saturn 3D Additive Manufacturing Facility located in Sector B, Govindpura Industrial Area, Bhopal, MP, India.`,
        },
        {
          question: `What are the manufacturing tolerances and materials used?`,
          answer: `Engineered with ${mat} achieving dimensional tolerances of ±0.04 mm on calibrated industrial CoreXY platforms.`,
        },
        {
          question: `What is the delivery turnaround across India?`,
          answer: `Components enter slicing analysis immediately, print within 24 hours, and ship via priority express air cargo to Delhi, Mumbai, Bengaluru, Pune, and all Indian cities.`,
        },
      ],
    });

    if (!form.slug) {
      setForm((p) => ({ ...p, slug: slugClean }));
    }

    toast.success('Generated optimized SEO, GEO & AEO parameters!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Part name is required');
    if (!form.price || isNaN(parseFloat(form.price))) return toast.error('Valid price required');

    setLoading(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        slug: form.slug ? form.slug.trim() : undefined,
        description: form.description.trim(),
        price: parseFloat(form.price),
        image: form.image || 'https://picsum.photos/seed/saturn-part/600/600',
        category: form.category.trim(),
        stock: parseInt(form.stock) || 0,
        is_active: form.is_active,
        seo_fields: {
          seo: seoForm,
          geo: geoForm,
          aeo: aeoForm,
        },
      };

      if (isEdit && product) {
        await adminApi.updateProduct(product.id, payload);
        toast.success(`Updated component "${form.name}" with SEO, GEO & AEO telemetry`);
      } else {
        await adminApi.createProduct(payload);
        toast.success(`Registered new part "${form.name}" with SEO, GEO & AEO telemetry`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B0D10]/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto font-mono flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-[#F5F6F8] p-5 border-b border-[#0B0D10]/10 z-10 rounded-t-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10">
                  SPEC // MOD
                </span>
                <h2 className="text-base font-semibold text-[#0B0D10]">
                  {isEdit ? 'Edit Component & Search Telemetry' : 'Register New Part & Parameters'}
                </h2>
              </div>
              <p className="text-[11px] text-[#5B616B] mt-0.5">
                Catalog data, Google Search SEO, Bhopal GEO targeting &amp; AI AEO citation parameters
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={autoGenerateSeoGeoAeo}
                title="Automatically generate high-ranking SEO, GEO and AEO citations from product details"
                className="h-8 px-3 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 border border-[#FF5A1F]/20 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Auto-Fill SEO/GEO/AEO</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center hover:bg-[#F5F6F8] text-[#5B616B] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Tabs Nav */}
          <div className="flex items-center gap-1 mt-4 pt-3 border-t border-[#0B0D10]/10 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveFormTab('general')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFormTab === 'general'
                  ? 'bg-[#0B0D10] text-white shadow-sm'
                  : 'text-[#5B616B] hover:text-[#0B0D10] hover:bg-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              General Specs
            </button>

            <button
              type="button"
              onClick={() => setActiveFormTab('seo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFormTab === 'seo'
                  ? 'bg-[#FF5A1F] text-white shadow-sm'
                  : 'text-[#5B616B] hover:text-[#0B0D10] hover:bg-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              SEO Engine
              {seoForm.meta_title && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveFormTab('geo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFormTab === 'geo'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[#5B616B] hover:text-[#0B0D10] hover:bg-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              GEO Bhopal &amp; India
              {geoForm.target_city && <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveFormTab('aeo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFormTab === 'aeo'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[#5B616B] hover:text-[#0B0D10] hover:bg-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              AEO &amp; AI Citations
              {aeoForm.direct_answer && <span className="w-1.5 h-1.5 rounded-full bg-purple-300" />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          {/* TAB 1: GENERAL SPECS */}
          {activeFormTab === 'general' && (
            <div className="space-y-5">
              {/* Multi-Image Drag and Drop */}
              <div className="space-y-2">
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider flex items-center justify-between">
                  <span>01 / CAD &amp; Render Gallery (Drag &amp; Drop)</span>
                  <span className="text-[10px] text-[#5B616B]">Max 8MB (JPEG, PNG, WebP)</span>
                </Label>
                
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#0B0D10]/15 hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 p-6 rounded-2xl text-center cursor-pointer transition-colors bg-white flex flex-col items-center justify-center gap-2 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  />
                  <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center group-hover:scale-105 transition-transform">
                    {uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#FF5A1F]" /> : <UploadCloud className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#0B0D10]">
                      {uploading ? 'Transmitting to Saturn Storage...' : 'Click or drop visual asset'}
                    </p>
                    <p className="text-[10px] text-[#5B616B] mt-0.5">High-resolution print photography</p>
                  </div>
                </div>

                {/* Thumbnail Preview strip */}
                {images.length > 0 && (
                  <div className="flex gap-2 pt-2 overflow-x-auto pb-1">
                    {images.map((imgUrl, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl border border-[#0B0D10]/10 overflow-hidden flex-shrink-0 bg-[#F5F6F8]">
                        <img src={imgUrl} alt="Thumb" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const next = images.filter((_: string, i: number) => i !== idx);
                            setImages(next);
                            if (form.image === imgUrl) setForm((p) => ({ ...p, image: next[0] || '' }));
                          }}
                          className="absolute top-1 right-1 w-5 h-5 bg-[#0B0D10]/80 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#FF5A1F] text-white text-[8px] font-semibold text-center uppercase tracking-tight py-0.5">
                            PRIMARY
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">02 / Component Name</Label>
                  <Input
                    name="name"
                    placeholder="Carbon-X High-Tension Drone Spar"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">03 / Custom URL Slug</Label>
                  <Input
                    name="slug"
                    placeholder="carbon-x-drone-spar"
                    value={form.slug}
                    onChange={handleChange}
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">04 / Engineering Description</Label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Continuous chopped carbon fiber PA12 reinforced component manufactured for high vibrational damping..."
                  className="w-full px-3 py-2 rounded-xl border border-[#0B0D10]/15 font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">05 / Unit Price (INR)</Label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="890.00"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">06 / Inventory Stock</Label>
                  <Input
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="50"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">07 / Category</Label>
                  <Input
                    name="category"
                    placeholder="Aerospace & Drone"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">08 / Storefront Publishing State</Label>
                <select
                  name="is_active"
                  value={form.is_active ? 'true' : 'false'}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.value === 'true' }))}
                  className="w-full h-10 px-3 rounded-xl border border-[#0B0D10]/15 font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                >
                  <option value="true">Active &amp; Published (Visible on Store &amp; Sitemaps)</option>
                  <option value="false">Draft &amp; Hidden (Restricted to Internal Review)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: SEO ENGINE OPTIMIZATION */}
          {activeFormTab === 'seo' && (
            <div className="space-y-5">
              {/* Google SERP Live Simulation Card */}
              <div className="bg-[#F5F6F8] p-4 rounded-xl border border-[#0B0D10]/10 space-y-1.5">
                <span className="text-[10px] text-[#5B616B] uppercase font-semibold block">Google Search Result Live Simulation:</span>
                <div className="bg-white p-3 rounded-lg border border-[#0B0D10]/5 space-y-1">
                  <div className="text-[11px] text-[#5B616B] truncate font-sans">
                    https://saturn3d.in › product › {seoForm.canonical_url ? seoForm.canonical_url.replace(/^\//, '') : (form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                  </div>
                  <div className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer truncate font-sans">
                    {seoForm.meta_title || `${form.name || 'Component'} | 3D Printing Bhopal & India | Saturn 3D`}
                  </div>
                  <div className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed font-sans">
                    {seoForm.meta_description || form.description || 'Precision 3D printed component manufactured with micron tolerance at Saturn 3D additive hub in Bhopal, MP. Fast all-India dispatch.'}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Meta Page Title</Label>
                  <span className={`text-[10px] font-mono ${seoForm.meta_title.length > 60 ? 'text-amber-600 font-semibold' : 'text-[#5B616B]'}`}>
                    {seoForm.meta_title.length} / 60 chars (Recommended)
                  </span>
                </div>
                <Input
                  value={seoForm.meta_title}
                  onChange={(e) => setSeoForm({ ...seoForm, meta_title: e.target.value })}
                  placeholder="e.g. Carbon-X Drone Arm Spar | 3D Printing Bhopal & India | Saturn 3D"
                  className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Meta Description (Snippet)</Label>
                  <span className={`text-[10px] font-mono ${seoForm.meta_description.length > 160 ? 'text-amber-600 font-semibold' : 'text-[#5B616B]'}`}>
                    {seoForm.meta_description.length} / 160 chars (High CTR)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seoForm.meta_description}
                  onChange={(e) => setSeoForm({ ...seoForm, meta_description: e.target.value })}
                  placeholder="e.g. High-strength PA12-CF carbon fiber drone arm spar printed with ±0.04 mm precision at Saturn 3D Bhopal hub. Fast dispatch across India."
                  className="w-full px-3 py-2 rounded-xl border border-[#0B0D10]/15 font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Target Focus Keywords (Comma-Separated)</Label>
                <Input
                  value={seoForm.keywords}
                  onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                  placeholder="e.g. 3d printing bhopal, drone parts 3d print, carbon nylon printing india, rapid prototyping madhya pradesh"
                  className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs font-mono"
                />
                <span className="text-[10px] text-[#5B616B] block">Includes long-tail local Bhopal keywords and India-wide procurement terms.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Canonical Target URI</Label>
                  <Input
                    value={seoForm.canonical_url}
                    onChange={(e) => setSeoForm({ ...seoForm, canonical_url: e.target.value })}
                    placeholder="/product/carbon-drone-spar"
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Robots Indexing</Label>
                  <select
                    value={seoForm.indexable ? 'true' : 'false'}
                    onChange={(e) => setSeoForm({ ...seoForm, indexable: e.target.value === 'true' })}
                    className="w-full h-10 px-3 rounded-xl border border-[#0B0D10]/15 font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                  >
                    <option value="true">index, follow (Rank on Google, Bing &amp; DuckDuckGo)</option>
                    <option value="false">noindex, nofollow (Exclude from SERPs)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GEO BHOPAL & INDIA LOCAL TARGETING */}
          {activeFormTab === 'geo' && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Local Bhopal &amp; All-India Geographic Targeting
                </div>
                <p className="text-xs text-blue-800/80 leading-relaxed">
                  Configures local schema attributes, ICBM geographic coordinates, and regional coverage tags that Google Maps, Local Packs, and Google Search use to rank Saturn 3D as the #1 3D printing provider in Bhopal and Madhya Pradesh.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Target Manufacturing City</Label>
                  <Input
                    value={geoForm.target_city}
                    onChange={(e) => setGeoForm({ ...geoForm, target_city: e.target.value })}
                    placeholder="Bhopal"
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Region / State Jurisdiction</Label>
                  <Input
                    value={geoForm.target_region}
                    onChange={(e) => setGeoForm({ ...geoForm, target_region: e.target.value })}
                    placeholder="Madhya Pradesh & Central India Hub"
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Facility Hub Street Address</Label>
                <Input
                  value={geoForm.geo_placename}
                  onChange={(e) => setGeoForm({ ...geoForm, geo_placename: e.target.value })}
                  placeholder="Govindpura Industrial Area, Bhopal, MP 462023, India"
                  className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Geographic Coordinates (Lat;Long)</Label>
                  <Input
                    value={geoForm.geo_position}
                    onChange={(e) => setGeoForm({ ...geoForm, geo_position: e.target.value })}
                    placeholder="23.259933;77.412615"
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs font-mono"
                  />
                  <span className="text-[10px] text-[#5B616B] block">Precision coordinates of Govindpura Bhopal facility.</span>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Dispatch Turnaround</Label>
                  <Input
                    value={geoForm.dispatch_lead_time}
                    onChange={(e) => setGeoForm({ ...geoForm, dispatch_lead_time: e.target.value })}
                    placeholder="24-48 Hours"
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Fulfillment &amp; Delivery Scope</Label>
                <Input
                  value={geoForm.service_scope}
                  onChange={(e) => setGeoForm({ ...geoForm, service_scope: e.target.value })}
                  placeholder="Local Same-Day Bhopal Dispatch • 24-48h Pan-India Express Air Cargo"
                  className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 4: AEO & AI CITATION OPTIMIZATION */}
          {activeFormTab === 'aeo' && (
            <div className="space-y-5">
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-900">
                  <Bot className="w-4 h-4 text-purple-600" />
                  Answer Engine Optimization (AEO) for LLMs &amp; AI Search
                </div>
                <p className="text-xs text-purple-800/80 leading-relaxed">
                  Tailored specifically for ChatGPT Search, Perplexity, Google Gemini, and Claude citations. Generates structured machine-readable direct answers, verifiable manufacturing parameters, and structured FAQ schemas.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">
                  Direct Answer Citation Summary (1-2 Sentences for AI Overviews)
                </Label>
                <textarea
                  rows={3}
                  value={aeoForm.direct_answer}
                  onChange={(e) => setAeoForm({ ...aeoForm, direct_answer: e.target.value })}
                  placeholder="e.g. Saturn 3D manufactures the Carbon-X Drone Arm in Bhopal, Madhya Pradesh using continuous chopped carbon fiber PA12 with industrial tolerance of ±0.04 mm, dispatching nationwide with zero minimum order quantity."
                  className="w-full px-3 py-2 rounded-xl border border-[#0B0D10]/15 font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] bg-white"
                />
                <span className="text-[10px] text-[#5B616B] block">This exact factual sentence is structured in JSON-LD for AI search engines to quote word-for-word.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Material Grade</Label>
                  <Input
                    value={aeoForm.material_grade}
                    onChange={(e) => setAeoForm({ ...aeoForm, material_grade: e.target.value })}
                    placeholder="Carbon-X PA12 Carbon Fiber"
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Tolerance Rating</Label>
                  <Input
                    value={aeoForm.tolerance_rating}
                    onChange={(e) => setAeoForm({ ...aeoForm, tolerance_rating: e.target.value })}
                    placeholder="±0.04 mm"
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Additive Technology</Label>
                  <Input
                    value={aeoForm.technology_process}
                    onChange={(e) => setAeoForm({ ...aeoForm, technology_process: e.target.value })}
                    placeholder="Industrial CoreXY FFF / 12K SLA"
                    className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Natural Language AI Prompts</Label>
                <Input
                  value={aeoForm.ai_keywords}
                  onChange={(e) => setAeoForm({ ...aeoForm, ai_keywords: e.target.value })}
                  placeholder="e.g. who prints carbon fiber in bhopal, where to get rapid prototyping in central india, custom drone parts supplier india"
                  className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs font-mono"
                />
              </div>

              {/* Dynamic Q&A FAQ items */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">
                    Structured FAQ Pairs (Parsed by AI Search Engines)
                  </Label>
                  <button
                    type="button"
                    onClick={handleAddFaqItem}
                    className="text-xs text-[#FF5A1F] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Q&amp;A
                  </button>
                </div>

                <div className="space-y-3">
                  {aeoForm.faq_items.map((item: { question: string; answer: string }, idx: number) => (
                    <div key={idx} className="p-3 bg-[#F5F6F8] rounded-xl border border-[#0B0D10]/10 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Input
                          placeholder="Question (e.g. Can this part be customized?)"
                          value={item.question}
                          onChange={(e) => handleUpdateFaqItem(idx, 'question', e.target.value)}
                          className="h-8 rounded-lg text-xs bg-white border border-[#0B0D10]/15 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFaqItem(idx)}
                          className="w-7 h-7 rounded-lg border border-red-200 bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Answer (factual, concise answer for AI retrieval)"
                        value={item.answer}
                        onChange={(e) => handleUpdateFaqItem(idx, 'answer', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#0B0D10]/15 font-mono text-xs resize-none bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#0B0D10]/10">
            <div className="text-[11px] text-[#5B616B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Telemetry: SEO, GEO &amp; AEO Ready</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-4 rounded-xl border border-[#0B0D10]/10 bg-white text-[#5B616B] font-medium text-xs hover:bg-[#F5F6F8] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="h-10 px-6 rounded-xl bg-[#FF5A1F] text-white font-medium text-xs shadow-sm hover:bg-[#E04B14] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Saving...
                  </>
                ) : isEdit ? (
                  'Save & Commit Telemetry'
                ) : (
                  'Create Component'
                )}
              </button>
            </div>
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10">
              MOD // 02
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0B0D10]">Catalog Components &amp; SEO/GEO/AEO Hub</h1>
          </div>
          <p className="text-xs text-[#5B616B] font-mono">
            Industrial inventory manifest, search rankings &amp; AI answer engine parameters
          </p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="hidden sm:inline-flex h-10 px-5 rounded-xl bg-[#FF5A1F] text-white font-medium text-xs items-center justify-center gap-2 shadow-sm hover:bg-[#E04B14] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4 text-white" /> Register Component
        </button>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => { setEditProduct(null); setShowForm(true); }}
        className="sm:hidden fixed bottom-6 right-6 w-12 h-12 bg-[#FF5A1F] text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-[0.98] transition-all"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Search catalog (name, category, material)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded-xl border border-[#0B0D10]/15 bg-white text-xs font-mono placeholder:text-[#5B616B]/60"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-[#5B616B] font-mono text-xs uppercase tracking-widest">
            No catalog components found. Click Register Component to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table font-mono">
              <thead className="bg-[#F5F6F8] border-b border-[#0B0D10]/10 text-[#5B616B]">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Part / Component</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Sector / Category</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">SEO / GEO / AEO</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B0D10]/5">
                {products.map((product) => {
                  const seoData = (product.seo_fields as any)?.seo;
                  const geoData = (product.seo_fields as any)?.geo;
                  const aeoData = (product.seo_fields as any)?.aeo;
                  const hasCustomSeo = Boolean(seoData?.meta_title || seoData?.meta_description);
                  const hasCustomGeo = Boolean(geoData?.target_city);
                  const hasCustomAeo = Boolean(aeoData?.direct_answer);

                  return (
                    <tr key={product.id} className="hover:bg-[#F5F6F8]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl border border-[#0B0D10]/10 overflow-hidden bg-[#F5F6F8] flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${product.id}/100/100`; }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-xs text-[#0B0D10] truncate max-w-[200px]">{product.name}</div>
                            <div className="text-[10px] text-[#5B616B] truncate max-w-[180px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#0B0D10]/80">{product.category}</td>
                      <td className="px-6 py-4 font-semibold text-xs text-[#FF5A1F]">
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          product.stock === 0 
                            ? 'text-red-600 bg-red-50 border border-red-200' 
                            : product.stock <= 5 
                            ? 'text-amber-700 bg-amber-50 border border-amber-200' 
                            : 'text-[#0B0D10]'
                        }`}>
                          {product.stock} PCS
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span
                            title={hasCustomSeo ? `Meta: ${seoData?.meta_title}` : 'Standard SEO active'}
                            className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                              hasCustomSeo
                                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 font-semibold'
                                : 'bg-[#0B0D10]/5 text-[#5B616B] border-[#0B0D10]/10'
                            }`}
                          >
                            SEO
                          </span>
                          <span
                            title="Bhopal Hub + Pan-India Logistics"
                            className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20 font-semibold"
                          >
                            GEO:BHP
                          </span>
                          <span
                            title={hasCustomAeo ? `AI Citation: ${aeoData?.direct_answer}` : 'Standard AEO citations'}
                            className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                              hasCustomAeo
                                ? 'bg-purple-500/10 text-purple-700 border-purple-500/20 font-semibold'
                                : 'bg-[#0B0D10]/5 text-[#5B616B] border-[#0B0D10]/10'
                            }`}
                          >
                            AEO:AI
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={product.is_active ? 'active' : 'suspended'} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setEditProduct(product); setShowForm(true); }}
                            title="Edit Component, SEO, GEO & AEO"
                            className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center text-[#5B616B] hover:text-[#0B0D10] hover:bg-[#F5F6F8] shadow-sm transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            title="Delete Component"
                            className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center text-[#5B616B] hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[#0B0D10]/5 font-mono">
              {products.map((product) => (
                <div key={product.id} className="p-4 active:bg-[#F5F6F8]/50 transition-colors space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl border border-[#0B0D10]/10 overflow-hidden bg-[#F5F6F8] flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${product.id}/100/100`; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-semibold text-xs text-[#0B0D10] truncate">{product.name}</div>
                        <StatusBadge status={product.is_active ? 'active' : 'suspended'} />
                      </div>
                      <div className="text-[10px] text-[#5B616B] truncate mt-0.5">{product.category}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="font-semibold text-xs text-[#FF5A1F]">₹{product.price.toFixed(2)}</div>
                        <div className="h-2.5 w-px bg-[#0B0D10]/10" />
                        <div className="text-[10px] text-[#5B616B]">Stock: {product.stock}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#0B0D10]/5">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-semibold">
                        SEO
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20 font-semibold">
                        GEO:BHP
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 border border-purple-500/20 font-semibold">
                        AEO:AI
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditProduct(product); setShowForm(true); }}
                        className="h-8 px-3 rounded-lg border border-[#0B0D10]/10 bg-white text-[11px] font-medium gap-1 flex items-center justify-center text-[#0B0D10] shadow-sm hover:bg-[#F5F6F8]"
                      >
                        <Pencil className="w-3 h-3" /> Edit &amp; SEO
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white text-[#5B616B] flex items-center justify-center hover:bg-red-50 hover:text-red-600 shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10">
              MOD // 03
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0B0D10]">Order Fulfillment Manifest</h1>
          </div>
          <p className="text-xs text-[#5B616B] font-mono">
            Track order fulfillment, courier manifests &amp; tax invoices
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap shadow-sm ${
              statusFilter === s 
                ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]' 
                : 'bg-white text-[#5B616B] border-[#0B0D10]/10 hover:text-[#0B0D10] hover:bg-[#F5F6F8]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-[#5B616B] font-mono text-xs uppercase tracking-widest">
            No orders manifest found for current status filter
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table font-mono">
              <thead className="bg-[#F5F6F8] border-b border-[#0B0D10]/10 text-[#5B616B]">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Payload</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Valuation</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Tracking</th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B0D10]/5">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-[#F5F6F8]/60 transition-colors">
                      <td className="px-6 py-4 font-semibold text-xs text-[#0B0D10]">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-xs text-[#0B0D10]">
                          {order.users?.name || 'Guest'}
                        </div>
                        <div className="text-[10px] text-[#5B616B]">
                          {order.users?.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#0B0D10]/80">
                        {order.order_items?.length ?? 0} component(s)
                      </td>
                      <td className="px-6 py-4 font-semibold text-xs text-[#FF5A1F]">
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
                            <span className="text-[10px] font-semibold text-[#0B0D10] uppercase tracking-tight">{order.carrier}</span>
                            <span className="text-[10px] text-[#5B616B] font-mono">{order.tracking_number}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#5B616B]/60 uppercase italic">Awaiting Dispatch</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 ml-auto">
                          <button
                            title="Generate Tax Invoice"
                            onClick={() => setSelectedInvoiceId(order.id)}
                            className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 flex items-center justify-center transition-all bg-white text-[#5B616B] hover:text-[#0B0D10] hover:bg-[#F5F6F8] shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            title="Inspect Payload"
                            className={`w-8 h-8 rounded-lg border border-[#0B0D10]/10 flex items-center justify-center transition-all shadow-sm ${
                              expandedOrder === order.id ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]' : 'bg-white text-[#5B616B] hover:text-[#0B0D10] hover:bg-[#F5F6F8]'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={7} className="px-6 py-6 bg-[#F5F6F8] border-b border-[#0B0D10]/10">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Order Items */}
                            <div className="space-y-3">
                              <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#0B0D10] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
                                Manifest Items
                              </h4>
                              <div className="space-y-2">
                                {(order.order_items || []).map((item) => (
                                  <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[#0B0D10]/10 shadow-sm">
                                    <div className="w-12 h-12 rounded-lg border border-[#0B0D10]/10 overflow-hidden flex-shrink-0 bg-[#F5F6F8]">
                                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-xs text-[#0B0D10] truncate">{item.name}</div>
                                      <div className="text-[10px] text-[#5B616B]">
                                        Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                      </div>
                                    </div>
                                    <div className="font-semibold text-xs text-[#FF5A1F] font-mono">
                                      ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Delivery & Shipping */}
                            <div className="space-y-3">
                              <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#0B0D10] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Courier &amp; Dispatch Route
                              </h4>

                              {updatingDelivery === order.id ? (
                                <div className="bg-white p-4 rounded-xl border border-[#0B0D10]/10 shadow-sm space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#5B616B]">Carrier</Label>
                                      <Input
                                        placeholder="e.g. BlueDart / Delhivery"
                                        className="h-9 text-xs rounded-lg border border-[#0B0D10]/15 bg-white font-mono"
                                        value={deliveryForm.carrier}
                                        onChange={(e) => setDeliveryForm({ ...deliveryForm, carrier: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#5B616B]">Tracking AWB</Label>
                                      <Input
                                        placeholder="Enter AWB Code"
                                        className="h-9 text-xs rounded-lg border border-[#0B0D10]/15 bg-white font-mono"
                                        value={deliveryForm.tracking_number}
                                        onChange={(e) => setDeliveryForm({ ...deliveryForm, tracking_number: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      className="flex-1 rounded-lg bg-[#FF5A1F] text-white font-mono font-medium text-[11px] h-9 shadow-sm hover:bg-[#E04B14] active:scale-[0.98] transition-all"
                                      onClick={() => handleUpdateDelivery(order.id)}
                                    >
                                      Save Waybill
                                    </button>
                                    <button
                                      className="rounded-lg border border-[#0B0D10]/10 bg-white font-mono text-[11px] h-9 px-4 text-[#5B616B] hover:bg-[#F5F6F8] active:scale-[0.98] transition-all"
                                      onClick={() => setUpdatingDelivery(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-white p-4 rounded-xl border border-[#0B0D10]/10 shadow-sm space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="text-[10px] font-mono text-[#5B616B] uppercase tracking-wider mb-1">Destination Address</div>
                                      <div className="text-xs font-mono text-[#0B0D10] space-y-0.5">
                                        <div>{order.shipping_address?.line1}</div>
                                        <div>{order.shipping_address?.city}, {order.shipping_address?.postal_code}</div>
                                        <div>{order.shipping_address?.country}</div>
                                      </div>
                                    </div>
                                    <button
                                      className="h-8 rounded-lg border border-[#0B0D10]/10 px-3 text-[11px] font-mono font-medium gap-1.5 bg-[#F5F6F8] text-[#0B0D10] flex items-center hover:bg-white active:scale-[0.98] transition-all"
                                      onClick={() => {
                                        setUpdatingDelivery(order.id);
                                        setDeliveryForm({
                                          tracking_number: order.tracking_number || '',
                                          carrier: order.carrier || ''
                                        });
                                      }}
                                    >
                                      <Truck className="w-3.5 h-3.5 text-[#FF5A1F]" />
                                      {order.tracking_number ? 'Update Waybill' : 'Set Waybill'}
                                    </button>
                                  </div>

                                  {order.tracking_number && (
                                    <div className="pt-3 border-t border-[#0B0D10]/10 flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                          <Truck className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <div className="text-[10px] font-mono text-[#5B616B] uppercase tracking-wider">Courier Waybill</div>
                                          <div className="text-xs font-mono font-semibold text-[#0B0D10]">{order.carrier} • {order.tracking_number}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Status Flow & Actions */}
                          <div className="mt-5 pt-4 border-t border-[#0B0D10]/10 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-mono font-medium text-[#5B616B] mr-1">Status Mutation:</span>
                              {(['pending', 'paid', 'processing', 'shipped', 'delivered'] as const).map((st) => (
                                <button
                                  key={st}
                                  disabled={order.status === st}
                                  onClick={() => handleStatusChange(order.id, st)}
                                  className={`px-2.5 py-1 rounded-lg border font-mono text-[10px] font-medium uppercase tracking-wider transition-all ${
                                    order.status === st 
                                      ? 'bg-[#0B0D10] text-white border-[#0B0D10] opacity-50 cursor-default' 
                                      : 'bg-white hover:bg-[#F5F6F8] text-[#5B616B] hover:text-[#0B0D10] border-[#0B0D10]/10'
                                  }`}
                                >
                                  Mark {st}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="h-8 rounded-lg border border-[#0B0D10]/10 px-3 text-[11px] font-mono font-medium gap-1.5 bg-white text-[#0B0D10] flex items-center hover:bg-[#F5F6F8] shadow-sm transition-all"
                                onClick={() => setSelectedInvoiceId(order.id)}
                              >
                                <FileText className="w-3.5 h-3.5 text-[#FF5A1F]" /> Invoice
                              </button>
                              {order.status !== 'refunded' && (
                                <button
                                  className="h-8 rounded-lg border border-red-200 px-3 text-[11px] font-mono font-medium gap-1.5 bg-red-50 text-red-600 flex items-center hover:bg-red-100 shadow-sm transition-all"
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
            <div className="md:hidden divide-y divide-[#0B0D10]/5 font-mono">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-xs text-[#0B0D10]">#{order.id.slice(0, 8)}</div>
                      <div className="text-[10px] text-[#5B616B]">
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
                      <div className="font-medium text-xs text-[#0B0D10]">
                        {order.users?.name || 'Guest'}
                      </div>
                      <div className="text-[10px] text-[#5B616B]">
                        {order.order_items?.length ?? 0} item(s) • Total: <span className="text-[#FF5A1F] font-semibold">₹{order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center text-[#5B616B] hover:text-[#0B0D10] shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="pt-3 border-t border-[#0B0D10]/10 space-y-2">
                      <div className="text-[10px] space-y-1">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex justify-between py-1 border-b border-[#0B0D10]/5">
                            <span className="text-[#0B0D10]">{item.name} × {item.quantity}</span>
                            <span className="font-semibold text-[#FF5A1F]">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          className="h-8 rounded-lg border border-[#0B0D10]/10 px-3 text-[10px] font-mono font-medium gap-1.5 bg-white text-[#0B0D10] flex items-center shadow-sm"
                          onClick={() => setSelectedInvoiceId(order.id)}
                        >
                          <FileText className="w-3 h-3 text-[#FF5A1F]" /> Invoice
                        </button>
                        {order.status !== 'refunded' && (
                          <button
                            className="h-8 rounded-lg border border-red-200 px-3 text-[10px] font-mono font-medium gap-1.5 bg-red-50 text-red-600 flex items-center"
                            onClick={() => handleRefund(order.id, order.total_amount)}
                          >
                            <RotateCcw className="w-3 h-3" /> Refund
                          </button>
                        )}
                      </div>
                    </div>
                  )}
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10">
              MOD // 04
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0B0D10]">Access &amp; Client Manifest</h1>
          </div>
          <p className="text-xs text-[#5B616B] font-mono">
            Manage authenticated user credentials, enterprise accounts &amp; RBAC
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-[#5B616B] font-mono text-xs uppercase tracking-widest">
            No registered users logged
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table font-mono">
              <thead className="bg-[#F5F6F8] border-b border-[#0B0D10]/10 text-[#5B616B]">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">User Identity</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Registration</th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B0D10]/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center text-xs font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-[#0B0D10] flex items-center gap-2">
                            {user.name}
                            {user.role === 'admin' && (
                              <span className="w-4 h-4 bg-[#FF5A1F] text-white rounded-full flex items-center justify-center" title="Admin">
                                <ShieldCheck className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#5B616B] flex items-center gap-1 mt-0.5">
                            <Mail className="w-2.5 h-2.5 text-[#5B616B]" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.is_blocked ? 'suspended' : 'active'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[11px] text-[#5B616B] flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-[#5B616B]/60" />
                        {new Date(user.created_at || '').toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 ml-auto">
                        <button
                          title={user.is_blocked ? 'Unblock user' : 'Suspend user'}
                          onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                          className={`w-8 h-8 rounded-lg border border-[#0B0D10]/10 flex items-center justify-center transition-all shadow-sm ${
                            user.is_blocked
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                              : 'bg-white text-[#5B616B] hover:text-red-600 hover:bg-red-50'
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
                          className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center text-[#5B616B] hover:text-[#0B0D10] hover:bg-[#F5F6F8] shadow-sm transition-all"
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
            <div className="md:hidden divide-y divide-[#0B0D10]/5 font-mono">
              {users.map((user) => (
                <div key={user.id} className="p-4 active:bg-[#F5F6F8]/50 transition-colors space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center text-xs font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-[#0B0D10] flex items-center gap-1.5">
                          {user.name}
                          {user.role === 'admin' && <ShieldCheck className="w-3 h-3 text-[#FF5A1F]" />}
                        </div>
                        <div className="text-[10px] text-[#5B616B]">{user.email}</div>
                      </div>
                    </div>
                    <StatusBadge status={user.is_blocked ? 'suspended' : 'active'} />
                  </div>

                  <div className="flex justify-between items-center bg-[#F5F6F8] p-2.5 rounded-xl border border-[#0B0D10]/5">
                    <div className="text-[10px] text-[#5B616B] flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(user.created_at || '').toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        title={user.is_blocked ? 'Unblock user' : 'Suspend user'}
                        onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                        className={`w-7 h-7 rounded-lg border border-[#0B0D10]/10 flex items-center justify-center transition-all ${
                          user.is_blocked
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : 'bg-white text-[#5B616B] hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <Ban className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(user.email);
                          toast.success('Email copied');
                        }}
                        className="w-7 h-7 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center text-[#5B616B]"
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
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10">
              MOD // 05
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0B0D10]">Enterprise &amp; Bulk Inquiries</h1>
          </div>
          <p className="text-xs text-[#5B616B] font-mono">
            Manage institutional prototyping, batch manufacturing &amp; volume inquiries
          </p>
        </div>
        <button
          className="border border-[#0B0D10]/10 rounded-xl font-mono text-xs font-medium h-10 px-4 bg-white text-[#0B0D10] shadow-sm hover:bg-[#F5F6F8] flex items-center gap-2 active:scale-[0.98] transition-all"
          onClick={fetchBulkOrders}
        >
          <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" />
          Refresh Pipeline
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
          </div>
        ) : bulkOrders.length === 0 ? (
          <div className="py-24 text-center space-y-3 font-mono">
            <div className="w-12 h-12 rounded-xl bg-[#F5F6F8] flex items-center justify-center mx-auto text-[#5B616B]">
              <Layers className="w-6 h-6 text-[#FF5A1F]" />
            </div>
            <div className="text-[#5B616B] text-xs uppercase tracking-widest">
              No enterprise batch inquiries logged yet
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table font-mono">
              <thead className="bg-[#F5F6F8] border-b border-[#0B0D10]/10 text-[#5B616B]">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Company / Contact</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Component</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B0D10]/5">
                {bulkOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F5F6F8]/60 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-[#0B0D10]">{order.company_name || 'Individual'}</span>
                        <span className="text-[10px] text-[#5B616B] flex items-center gap-1 mt-0.5">
                          {order.name} • {order.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
                        <span className="font-medium text-xs text-[#0B0D10]">{order.product_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-xs text-[#0B0D10] font-mono">{order.quantity} PCS</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] text-[#5B616B] font-mono">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center text-[#5B616B] hover:text-[#0B0D10] hover:bg-[#F5F6F8] shadow-sm ml-auto"
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
            <div className="md:hidden divide-y divide-[#0B0D10]/5 font-mono">
              {bulkOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-xs text-[#0B0D10]">{order.company_name || 'Individual'}</div>
                      <div className="text-[10px] text-[#5B616B]">{order.email}</div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="bg-[#F5F6F8] p-3 rounded-xl border border-[#0B0D10]/5 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#5B616B]">Product:</span>
                      <span className="text-[#0B0D10] font-medium">{order.product_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5B616B]">Quantity:</span>
                      <span className="text-[#0B0D10] font-semibold">{order.quantity} PCS</span>
                    </div>
                  </div>
                  <button
                    className="w-full rounded-xl border border-[#0B0D10]/10 py-2 h-9 text-xs font-mono font-medium bg-white text-[#0B0D10] shadow-sm hover:bg-[#F5F6F8]"
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
    <div className={`flex flex-col h-full bg-white ${mobile ? '' : 'border-r border-[#0B0D10]/10'}`}>
      {/* Logo Header */}
      <div className="p-6 border-b border-[#0B0D10]/10">
        <Logo className="h-6" />
        <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider">COMMAND // ADMIN</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto font-mono">
        {navTabs.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all text-left ${
                isActive
                  ? 'bg-[#FF5A1F] text-white shadow-sm font-semibold'
                  : 'text-[#5B616B] hover:text-[#0B0D10] hover:bg-[#F5F6F8]'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Dedicated Signout Tab Item in Nav */}
        <div className="pt-2 mt-2 border-t border-[#0B0D10]/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all text-left text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* User Info + Storefront Button */}
      <div className="p-4 border-t border-[#0B0D10]/10 bg-[#F5F6F8]/50 font-mono">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center text-xs font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-[#0B0D10] truncate">{user?.name || 'Saturn Admin'}</div>
            <div className="text-[10px] text-[#5B616B] truncate">{user?.email || 'saturn3d@gmail.com'}</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#0B0D10] bg-white border border-[#0B0D10]/10 hover:bg-[#F5F6F8] transition-all shadow-sm active:scale-[0.98]"
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#FF5A1F]" />
          Storefront
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex font-mono text-[#0B0D10]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-[#0B0D10]/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden shadow-2xl">
            <Sidebar mobile />
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#0B0D10]/10 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden w-9 h-9 rounded-xl border border-[#0B0D10]/10 bg-white flex items-center justify-center text-[#0B0D10] shadow-sm active:scale-[0.98] transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-mono font-medium text-[#0B0D10] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0B0D10]/5 border border-[#0B0D10]/10">
                SYS // BHOPAL-PRIMARY
              </span>
              <span className="text-[10px] font-mono text-[#5B616B] uppercase">
                VIEW: {navTabs.find(t => t.id === activeTab)?.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleSelectTab('credentials')}
              className="h-9 px-3.5 rounded-xl border border-[#0B0D10]/10 bg-white shadow-sm text-xs font-medium text-[#0B0D10] hover:bg-[#F5F6F8] flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span className="hidden md:inline">Credentials</span>
            </button>
            <button
              onClick={handleLogout}
              className="h-9 px-3.5 rounded-xl bg-red-500 text-white shadow-sm text-xs font-medium hover:bg-red-600 flex items-center gap-1.5 transition-all"
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
