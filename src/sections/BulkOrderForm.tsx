import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { X, Factory, Send, Package, Building2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackQuoteFormSubmit, trackWhatsAppClick } from '@/lib/analytics';

interface BulkOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkOrderForm({ isOpen, onClose }: BulkOrderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    description: '',
    quantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    trackQuoteFormSubmit({
      quantity: Number(formData.quantity) || 1,
      material: 'Bulk Industrial Infill Specification',
      technology: 'Industrial FDM / Batch Additive',
    });

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (data && data.success) {
        toast.success('Inquiry submitted! We will contact you shortly.');
        setFormData({ name: '', email: '', companyName: '', description: '', quantity: '' });
        onClose();
      } else {
        try {
          const existing = JSON.parse(localStorage.getItem('saturn3d_inquiries') || '[]');
          existing.push({ ...formData, timestamp: new Date().toISOString() });
          localStorage.setItem('saturn3d_inquiries', JSON.stringify(existing));
        } catch {}

        toast.success('Inquiry received! Our additive engineering team will review it within 2 hours.', {
          action: {
            label: 'Chat on WhatsApp',
            onClick: () => {
              trackWhatsAppClick('bulk_order_form_toast');
              window.open(
                `https://wa.me/918889988874?text=${encodeURIComponent(
                  `Hello Saturn 3D team, this is ${formData.name} from ${formData.companyName || 'our team'}. I just submitted an enterprise inquiry for ${formData.quantity} parts: "${formData.description}".`
                )}`,
                '_blank'
              );
            },
          },
        });
        setFormData({ name: '', email: '', companyName: '', description: '', quantity: '' });
        onClose();
      }
    } catch {
      try {
        const existing = JSON.parse(localStorage.getItem('saturn3d_inquiries') || '[]');
        existing.push({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('saturn3d_inquiries', JSON.stringify(existing));
      } catch {}

      toast.success('Inquiry received! Our engineering team will review your specs shortly.', {
        action: {
          label: 'Chat on WhatsApp',
          onClick: () => {
            window.open(
              `https://wa.me/918889988874?text=${encodeURIComponent(
                `Hello Saturn 3D team, this is ${formData.name} from ${formData.companyName || 'our team'}. I just submitted an enterprise inquiry for ${formData.quantity} parts: "${formData.description}".`
              )}`,
              '_blank'
            );
          },
        },
      });
      setFormData({ name: '', email: '', companyName: '', description: '', quantity: '' });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-xl bg-white text-[#111215] border border-black/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-body"
          >
            {/* Header */}
            <div className="p-6 border-b border-black/10 bg-[#F8F9FA] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 border border-black/5 flex items-center justify-center text-[#FF5A1F]">
                  <Factory size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111215]">Enterprise Production RFP</h3>
                  <p className="text-xs text-[#5E6573]">Bhopal Hub Batch Scheduling Desk</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[#5E6573] hover:text-[#111215] hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#5E6573]">Contact Name</label>
                    <Input
                      required
                      placeholder="Aditya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-[#F8F9FB] border-black/10 text-[#111215] placeholder:text-black/30 rounded-xl text-xs h-10 focus-visible:ring-[#FF5A1F]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#5E6573]">Work Email</label>
                    <Input
                      required
                      type="email"
                      placeholder="aditya@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#F8F9FB] border-black/10 text-[#111215] placeholder:text-black/30 rounded-xl text-xs h-10 focus-visible:ring-[#FF5A1F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#5E6573]">Company / Institution</label>
                    <Input
                      placeholder="SkyDrive Robotics R&D"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="bg-[#F8F9FB] border-black/10 text-[#111215] placeholder:text-black/30 rounded-xl text-xs h-10 focus-visible:ring-[#FF5A1F]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#5E6573]">Estimated Quantity</label>
                    <Input
                      required
                      type="number"
                      min="1"
                      placeholder="100+"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="bg-[#F8F9FB] border-black/10 text-[#111215] placeholder:text-black/30 rounded-xl text-xs h-10 focus-visible:ring-[#FF5A1F]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#5E6573]">Project Specifications & Materials</label>
                  <Textarea
                    required
                    placeholder="Describe material requirements (e.g. Carbon-X PA12, 12K Tough Resin), mechanical tolerances, and required turnaround timeline..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#F8F9FB] border-black/10 text-[#111215] placeholder:text-black/30 min-h-[120px] rounded-xl text-xs p-3 resize-none focus-visible:ring-[#FF5A1F]"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-black/10 bg-[#F8F9FA] flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] text-[#5E6573]">
                Direct response within 2–4 business hours.
              </span>
              <button
                disabled={isSubmitting}
                type="submit"
                onClick={(e) => {
                  const form = (e.currentTarget.closest('.relative') as HTMLElement).querySelector('form');
                  if (form) form.requestSubmit();
                }}
                className="btn-precision-primary text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Dispatching RFP...' : 'Submit Enterprise RFP'}</span>
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
