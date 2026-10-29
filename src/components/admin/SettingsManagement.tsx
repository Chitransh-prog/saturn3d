import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, Store, Phone, Mail, MapPin, Percent, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { adminApi, getApiError, type StoreSettings } from '@/lib/api';

export default function SettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Saturn 3D Precision Manufacturing',
    supportEmail: 'hello@saturn3d.in',
    whatsappNumber: '917999824632',
    address: 'Govindpura Industrial Area, Bhopal, MP 462023, India',
    currency: 'INR',
    freeShippingThreshold: 1500,
    defaultShippingCost: 150,
    taxRatePercent: 18,
    gstin: '23AABCS1234F1Z5',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminApi.getSettings();
        if (res.data.success && res.data.data) {
          setSettings(res.data.data.settings);
        }
      } catch (err) {
        // Keep defaults
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      toast.success('Store settings updated successfully');
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl font-mono">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[9px] font-black bg-ink text-paper px-2 py-0.5 uppercase">MOD::09</span>
          <h1 className="font-display font-black text-2xl text-ink uppercase tracking-tight">Enterprise & Tax Parameters</h1>
        </div>
        <p className="font-mono text-xs text-ink/70 font-bold uppercase tracking-wider">
          Configure store brand identity, WhatsApp routing, GST compliance, and fulfillment thresholds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Identity */}
        <div className="card-precision bg-white border hairline shadow-precision-sm p-6 sm:p-8 space-y-6">
          <div className="bg-amber-500/10 text-amber-700 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-4 sm:p-5 border-b hairline flex items-center gap-2.5">
            <div className="w-8 h-8 border hairline bg-white flex items-center justify-center text-ink shadow-precision-xs">
              <Store className="w-4 h-4 text-saturn-orange" />
            </div>
            <h2 className="font-display font-black text-sm text-ink uppercase tracking-wider">
              01 / Facility Identity & Commercial Contact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Commercial Brand Title</Label>
              <Input
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="h-11 mt-1 font-mono font-bold border hairline shadow-precision-xs bg-white"
              />
            </div>
            <div>
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Support Dispatch Email</Label>
              <Input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="h-11 mt-1 font-mono font-bold border hairline shadow-precision-xs bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">WhatsApp Route (No + Sign)</Label>
              <Input
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="917999824632"
                className="h-11 mt-1 font-mono font-bold border hairline shadow-precision-xs bg-white"
              />
            </div>
            <div>
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">GSTIN (Indian Tax Reg Number)</Label>
              <Input
                value={settings.gstin}
                onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                placeholder="23AABCS1234F1Z5"
                className="h-11 mt-1 font-mono uppercase font-bold border hairline shadow-precision-xs bg-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Physical Manufacturing Hub Address</Label>
            <Input
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="h-11 mt-1 font-mono font-bold border hairline shadow-precision-xs bg-white"
            />
          </div>
        </div>

        {/* Financial & Shipping */}
        <div className="card-precision bg-white border hairline shadow-precision-sm p-6 sm:p-8 space-y-6">
          <div className="bg-amber-500/10 text-amber-700 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-4 sm:p-5 border-b hairline flex items-center gap-2.5">
            <div className="w-8 h-8 border hairline bg-white flex items-center justify-center text-ink shadow-precision-xs">
              <Truck className="w-4 h-4 text-saturn-orange" />
            </div>
            <h2 className="font-display font-black text-sm text-ink uppercase tracking-wider">
              02 / Logistics & Taxation Rules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Free Shipping Floor (₹)</Label>
              <Input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="h-11 mt-1 font-mono font-bold border hairline shadow-precision-xs bg-white"
              />
            </div>
            <div>
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Courier Freight Fee (₹)</Label>
              <Input
                type="number"
                value={settings.defaultShippingCost}
                onChange={(e) => setSettings({ ...settings, defaultShippingCost: parseFloat(e.target.value) || 0 })}
                className="h-11 mt-1 font-mono font-bold border hairline shadow-precision-xs bg-white"
              />
            </div>
            <div>
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Mandatory GST Rate (%)</Label>
              <Input
                type="number"
                value={settings.taxRatePercent}
                onChange={(e) => setSettings({ ...settings, taxRatePercent: parseFloat(e.target.value) || 18 })}
                className="h-11 mt-1 font-mono font-bold border hairline shadow-precision-xs bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="h-12 px-8 border hairline bg-saturn-orange text-white font-mono font-black uppercase tracking-wider text-xs gap-2 flex items-center justify-center shadow-precision-sm hover:-translate-y-0.5 hover:shadow-precision-md active:scale-[0.98] transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
