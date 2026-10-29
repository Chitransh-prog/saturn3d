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
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10">
              DISC // 06
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0B0D10]">
              Coupons &amp; Discounts
            </h1>
          </div>
          <p className="text-xs text-[#5B616B] font-mono">
            Cryptographic &amp; promotional discount codes (validated server-side)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="h-10 px-5 rounded-xl bg-[#FF5A1F] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-[#E04B14] active:scale-[0.98] transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Issue Coupon
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center text-[#5B616B] font-mono text-xs uppercase tracking-widest">
            No active coupon vouchers found. Click Issue Coupon to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead className="bg-[#F5F6F8] border-b border-[#0B0D10]/10">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Code</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Discount</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Threshold / Cap</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Usage</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Validity</th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B0D10]/5">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#FF5A1F]" />
                        <span className="font-mono font-semibold text-xs text-[#0B0D10] bg-[#F5F6F8] px-2.5 py-1 rounded-lg border border-[#0B0D10]/10">
                          {coupon.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-xs text-[#FF5A1F]">
                      {coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </td>
                    <td className="px-6 py-4 text-xs font-normal text-[#0B0D10]/80">
                      <div>Min: ₹{coupon.min_order_value || 0}</div>
                      {coupon.max_discount_cap && (
                        <div className="text-[10px] text-[#5B616B]">Cap: ₹{coupon.max_discount_cap}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-normal text-[#0B0D10]">
                      <span className="font-semibold text-[#0B0D10]">{coupon.times_used || 0}</span>
                      {coupon.usage_limit_total ? ` / ${coupon.usage_limit_total}` : ' uses'}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#5B616B]">
                      {coupon.end_date ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#5B616B]/60" />
                          Till {new Date(coupon.end_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-emerald-600 font-medium">Lifetime Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-[#5B616B] shadow-sm ml-auto"
                        title="Delete coupon"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0D10]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#0B0D10]/10 pb-4">
              <h2 className="text-base font-semibold text-[#0B0D10]">Issue Coupon Voucher</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center hover:bg-[#F5F6F8] text-[#5B616B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-1">
              <div>
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Coupon Code</Label>
                <Input
                  required
                  placeholder="SATURN20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="h-10 uppercase font-mono font-medium mt-1 rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Type</Label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full h-10 px-3 mt-1 rounded-xl border border-[#0B0D10]/15 text-xs font-mono font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Value</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    placeholder={form.type === 'percent' ? '15' : '200'}
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="h-10 mt-1 font-mono rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Max Cap (₹)</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={form.max_discount_cap}
                    onChange={(e) => setForm({ ...form, max_discount_cap: e.target.value })}
                    className="h-10 mt-1 font-mono rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Min Order (₹)</Label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={form.min_order_value}
                    onChange={(e) => setForm({ ...form, min_order_value: e.target.value })}
                    className="h-10 mt-1 font-mono rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Usage Limit</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={form.usage_limit_total}
                    onChange={(e) => setForm({ ...form, usage_limit_total: e.target.value })}
                    className="h-10 mt-1 font-mono rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Expires On</Label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="h-10 mt-1 font-mono rounded-xl border border-[#0B0D10]/15 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-10 rounded-xl border border-[#0B0D10]/10 bg-white font-medium text-xs text-[#5B616B] hover:bg-[#F5F6F8] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 h-10 rounded-xl bg-[#FF5A1F] text-white font-medium text-xs shadow-sm hover:bg-[#E04B14] transition-all flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
