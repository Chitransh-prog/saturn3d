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
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl font-mono">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10">
            CONF // 09
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0B0D10]">
            Enterprise &amp; Tax Parameters
          </h1>
        </div>
        <p className="text-xs text-[#5B616B] font-mono">
          Configure store brand identity, WhatsApp routing, GST compliance, and fulfillment thresholds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Identity */}
        <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="bg-[#F5F6F8] -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-4 sm:p-5 border-b border-[#0B0D10]/10 rounded-t-2xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <h2 className="font-semibold text-sm text-[#0B0D10]">
              01 / Facility Identity &amp; Commercial Contact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Commercial Brand Title</Label>
              <Input
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="h-10 mt-1 font-mono text-xs border border-[#0B0D10]/15 bg-white rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Support Dispatch Email</Label>
              <Input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="h-10 mt-1 font-mono text-xs border border-[#0B0D10]/15 bg-white rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">WhatsApp Route (No + Sign)</Label>
              <Input
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="917999824632"
                className="h-10 mt-1 font-mono text-xs border border-[#0B0D10]/15 bg-white rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">GSTIN (Indian Tax Reg Number)</Label>
              <Input
                value={settings.gstin}
                onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                placeholder="23AABCS1234F1Z5"
                className="h-10 mt-1 font-mono uppercase text-xs border border-[#0B0D10]/15 bg-white rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Physical Manufacturing Hub Address</Label>
            <Input
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="h-10 mt-1 font-mono text-xs border border-[#0B0D10]/15 bg-white rounded-xl"
            />
          </div>
        </div>

        {/* Financial & Shipping */}
        <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="bg-[#F5F6F8] -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-4 sm:p-5 border-b border-[#0B0D10]/10 rounded-t-2xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h2 className="font-semibold text-sm text-[#0B0D10]">
              02 / Logistics &amp; Taxation Rules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Free Shipping Floor (₹)</Label>
              <Input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="h-10 mt-1 font-mono text-xs border border-[#0B0D10]/15 bg-white rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Courier Freight Fee (₹)</Label>
              <Input
                type="number"
                value={settings.defaultShippingCost}
                onChange={(e) => setSettings({ ...settings, defaultShippingCost: parseFloat(e.target.value) || 0 })}
                className="h-10 mt-1 font-mono text-xs border border-[#0B0D10]/15 bg-white rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Mandatory GST Rate (%)</Label>
              <Input
                type="number"
                value={settings.taxRatePercent}
                onChange={(e) => setSettings({ ...settings, taxRatePercent: parseFloat(e.target.value) || 18 })}
                className="h-10 mt-1 font-mono text-xs border border-[#0B0D10]/15 bg-white rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="h-11 px-7 rounded-xl bg-[#FF5A1F] text-white font-medium text-xs gap-2 flex items-center justify-center shadow-sm hover:bg-[#E04B14] active:scale-[0.98] transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
