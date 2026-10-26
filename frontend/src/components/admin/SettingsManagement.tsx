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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-black tracking-tighter">Store & Tax Settings</h1>
        <p className="text-slate-400 text-sm font-medium">Configure store details, WhatsApp routing, GST compliance, and shipping rules</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Store className="w-5 h-5 text-primary" />
            <h2 className="font-black text-base text-black uppercase tracking-wider text-xs">Business Identity & Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-black uppercase tracking-widest">Store / Brand Name</Label>
              <Input
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="h-11 mt-1 font-medium"
              />
            </div>
            <div>
              <Label className="text-xs font-black uppercase tracking-widest">Support Email</Label>
              <Input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="h-11 mt-1 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-black uppercase tracking-widest">WhatsApp Number (with country code, no +)</Label>
              <Input
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="917999824632"
                className="h-11 mt-1 font-mono font-bold"
              />
            </div>
            <div>
              <Label className="text-xs font-black uppercase tracking-widest">GSTIN (India Tax ID)</Label>
              <Input
                value={settings.gstin}
                onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                placeholder="23AABCS1234F1Z5"
                className="h-11 mt-1 font-mono uppercase font-bold"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-black uppercase tracking-widest">Registered Physical Facility Address</Label>
            <Input
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="h-11 mt-1 font-medium"
            />
          </div>
        </div>

        {/* Financial & Shipping */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Truck className="w-5 h-5 text-primary" />
            <h2 className="font-black text-base text-black uppercase tracking-wider text-xs">Shipping & Tax Rules</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-black uppercase tracking-widest">Free Shipping Over (₹)</Label>
              <Input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="h-11 mt-1 font-bold"
              />
            </div>
            <div>
              <Label className="text-xs font-black uppercase tracking-widest">Standard Shipping Fee (₹)</Label>
              <Input
                type="number"
                value={settings.defaultShippingCost}
                onChange={(e) => setSettings({ ...settings, defaultShippingCost: parseFloat(e.target.value) || 0 })}
                className="h-11 mt-1 font-bold"
              />
            </div>
            <div>
              <Label className="text-xs font-black uppercase tracking-widest">GST Rate (%)</Label>
              <Input
                type="number"
                value={settings.taxRatePercent}
                onChange={(e) => setSettings({ ...settings, taxRatePercent: parseFloat(e.target.value) || 18 })}
                className="h-11 mt-1 font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="h-12 px-8 bg-black hover:bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-xl shadow-black/10"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
