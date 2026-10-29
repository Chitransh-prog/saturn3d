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
            <span className="font-mono text-[9px] font-black bg-ink text-paper px-2 py-0.5 uppercase">MOD::06</span>
            <h1 className="font-display font-black text-2xl text-ink uppercase tracking-tight">Coupons & Discounts</h1>
          </div>
          <p className="font-mono text-xs text-ink/70 font-bold uppercase tracking-wider">
            Cryptographic & promotional discount codes (validated server-side)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="h-11 px-6 border hairline bg-saturn-orange text-white font-mono font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-precision-sm hover:-translate-y-0.5 hover:shadow-precision-md active:scale-[0.98] transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Issue Coupon
        </button>
      </div>

      {/* Table */}
      <div className="card-precision bg-white border hairline shadow-precision-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center text-ink/50 font-mono font-black text-xs uppercase tracking-widest">
            No active coupon vouchers found. Click Issue Coupon to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead className="bg-ink text-paper border-b hairline">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Code</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Discount</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Threshold / Cap</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Usage</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Validity</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-black uppercase tracking-wider text-paper">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-amber-500/10 text-amber-700/15 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-saturn-orange" />
                        <span className="font-mono font-black text-xs text-ink tracking-wider bg-amber-500/10 text-amber-700 px-2.5 py-0.5 border border-ink shadow-precision-xs">
                          {coupon.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-xs text-saturn-orange">
                      {coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-ink/80">
                      <div>Min: ₹{coupon.min_order_value || 0}</div>
                      {coupon.max_discount_cap && (
                        <div className="text-[10px] text-ink/50">Cap: ₹{coupon.max_discount_cap}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-ink">
                      <span className="font-black text-ink">{coupon.times_used || 0}</span>
                      {coupon.usage_limit_total ? ` / ${coupon.usage_limit_total}` : ' uses'}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-ink/70">
                      {coupon.end_date ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-ink/40" />
                          Till {new Date(coupon.end_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-green-700 font-black uppercase">Lifetime Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        className="w-8 h-8 border hairline bg-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-ink shadow-precision-xs active:scale-[0.98] ml-auto"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75">
          <div className="card-precision bg-studio-light border hairline shadow-precision-lg w-full max-w-md p-6 space-y-4 font-mono">
            <div className="flex justify-between items-center border-b hairline pb-4 bg-amber-500/10 text-amber-700 -mx-6 -mt-6 p-6">
              <h2 className="font-display font-black text-lg text-ink uppercase tracking-tight">Issue Coupon Voucher</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 border hairline bg-white flex items-center justify-center shadow-precision-xs hover:bg-saturn-orange hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-2">
              <div>
                <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Coupon Code</Label>
                <Input
                  required
                  placeholder="SATURN20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="h-11 uppercase font-mono font-bold mt-1 border hairline shadow-precision-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Type</Label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full h-11 px-3 mt-1 border hairline text-xs font-mono font-bold bg-white shadow-precision-xs"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Value</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    placeholder={form.type === 'percent' ? '15' : '200'}
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="h-11 mt-1 font-mono font-bold border hairline shadow-precision-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Max Cap (₹)</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={form.max_discount_cap}
                    onChange={(e) => setForm({ ...form, max_discount_cap: e.target.value })}
                    className="h-11 mt-1 font-mono border hairline shadow-precision-xs bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Min Order (₹)</Label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={form.min_order_value}
                    onChange={(e) => setForm({ ...form, min_order_value: e.target.value })}
                    className="h-11 mt-1 font-mono border hairline shadow-precision-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Usage Limit</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={form.usage_limit_total}
                    onChange={(e) => setForm({ ...form, usage_limit_total: e.target.value })}
                    className="h-11 mt-1 font-mono border hairline shadow-precision-xs bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Expires On</Label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="h-11 mt-1 font-mono border hairline shadow-precision-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-11 border hairline bg-white font-mono font-black uppercase tracking-wider text-xs shadow-precision-xs hover:bg-studio-light active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 h-11 border hairline bg-saturn-orange text-white font-mono font-black uppercase tracking-wider text-xs shadow-precision-xs hover:bg-ink hover:text-paper active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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
