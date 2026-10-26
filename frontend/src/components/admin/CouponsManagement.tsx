import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Tag, Loader2, Calendar, DollarSign, Percent, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { couponsApi, getApiError, type Coupon } from '@/lib/api';

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    code: '',
    type: 'percent' as 'percent' | 'flat',
    value: '',
    max_discount_cap: '',
    min_order_value: '',
    usage_limit_total: '',
    start_date: '',
    end_date: '',
  });

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await couponsApi.getAll();
      if (res.data.success && res.data.data) {
        setCoupons(res.data.data.coupons || []);
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      await couponsApi.delete(id);
      toast.success(`Coupon ${code} deleted`);
      fetchCoupons();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await couponsApi.create({
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: parseFloat(form.value),
        max_discount_cap: form.max_discount_cap ? parseFloat(form.max_discount_cap) : undefined,
        min_order_value: form.min_order_value ? parseFloat(form.min_order_value) : undefined,
        usage_limit_total: form.usage_limit_total ? parseInt(form.usage_limit_total) : undefined,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
        is_active: true,
      });
      toast.success('Coupon created successfully');
      setShowModal(false);
      setForm({
        code: '',
        type: 'percent',
        value: '',
        max_discount_cap: '',
        min_order_value: '',
        usage_limit_total: '',
        start_date: '',
        end_date: '',
      });
      fetchCoupons();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tighter">Coupons & Discounts</h1>
          <p className="text-slate-400 text-sm font-medium">Manage promotional discount codes (validated server-side)</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="h-10 px-5 bg-black hover:bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-black text-xs uppercase tracking-widest">
            No active coupons found. Create one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Code</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Discount</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Min Order / Cap</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Usage</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Validity</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        <span className="font-mono font-black text-xs text-black tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                          {coupon.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-xs text-primary">
                      {coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      <div>Min: ₹{coupon.min_order_value || 0}</div>
                      {coupon.max_discount_cap && (
                        <div className="text-[10px] text-slate-400">Cap: ₹{coupon.max_discount_cap}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      <span className="font-black text-black">{coupon.times_used || 0}</span>
                      {coupon.usage_limit_total ? ` / ${coupon.usage_limit_total}` : ' uses'}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400">
                      {coupon.end_date ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Till {new Date(coupon.end_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-emerald-600 font-bold">Lifetime Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-slate-600 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="font-black text-lg text-black tracking-tight">Create Coupon</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label className="text-xs font-black uppercase tracking-widest">Coupon Code</Label>
                <Input
                  required
                  placeholder="SUMMER20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="h-11 uppercase font-mono font-bold mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-black uppercase tracking-widest">Type</Label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full h-11 px-3 mt-1 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-black uppercase tracking-widest">Value</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    placeholder={form.type === 'percent' ? '15' : '200'}
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="h-11 mt-1 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-black uppercase tracking-widest">Max Cap (₹)</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={form.max_discount_cap}
                    onChange={(e) => setForm({ ...form, max_discount_cap: e.target.value })}
                    className="h-11 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-black uppercase tracking-widest">Min Order (₹)</Label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={form.min_order_value}
                    onChange={(e) => setForm({ ...form, min_order_value: e.target.value })}
                    className="h-11 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-black uppercase tracking-widest">Usage Limit</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={form.usage_limit_total}
                    onChange={(e) => setForm({ ...form, usage_limit_total: e.target.value })}
                    className="h-11 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-black uppercase tracking-widest">Expires On</Label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="h-11 mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-11 rounded-xl font-bold">
                  Cancel
                </Button>
                <Button type="submit" disabled={creating} className="flex-1 h-11 bg-black hover:bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Coupon'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
