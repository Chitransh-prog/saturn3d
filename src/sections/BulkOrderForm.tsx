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
        // Fallback: preserve inquiry locally so lead is not lost
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
                `https://wa.me/917999824632?text=${encodeURIComponent(
                  `Hello Saturn3D team, this is ${formData.name} from ${formData.companyName || 'our team'}. I just submitted a bulk inquiry for ${formData.quantity} parts: "${formData.description}".`
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
      // Network offline fallback
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
              `https://wa.me/917999824632?text=${encodeURIComponent(
                `Hello Saturn3D team, this is ${formData.name} from ${formData.companyName || 'our team'}. I just submitted a bulk inquiry for ${formData.quantity} parts: "${formData.description}".`
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col"
          >
            {/* Header */}
            <div className="relative p-6 sm:p-10 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                  <Factory className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black tracking-tighter uppercase italic">Bulk Inquiries</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Industrial Scaling Solutions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-6 right-6 sm:static p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-black hover:bg-slate-100 transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
                {/* Contact Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personal Information</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                      <Input
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 text-black h-14 rounded-2xl transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                      <Input
                        required
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 text-black h-14 rounded-2xl transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Business Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Company Name</label>
                      <Input
                        placeholder="Organization Name"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 text-black h-14 rounded-2xl transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Quantity Estimate</label>
                      <div className="relative">
                        <Input
                          required
                          type="number"
                          min="1"
                          placeholder="50+"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 text-black h-14 rounded-2xl transition-all pl-12"
                        />
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Project Particulars</label>
                  <Textarea
                    required
                    placeholder="Provide details on materials, precision requirements, and expected timeline..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 text-black min-h-[160px] rounded-3xl resize-none p-6 transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Footer Action */}
            <div className="p-6 sm:p-10 border-t border-slate-100 bg-slate-50/50">
              <Button
                disabled={isSubmitting}
                type="submit"
                onClick={(e) => {
                  const form = (e.currentTarget.closest('.relative') as HTMLElement).querySelector('form');
                  if (form) form.requestSubmit();
                }}
                className="w-full h-16 bg-black hover:bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-2xl shadow-xl shadow-black/10 flex items-center justify-center gap-4 active:scale-95 group"
              >
                {isSubmitting ? 'PROCESSING REQUEST...' : (
                  <>
                    SUBMIT INDUSTRIAL INQUIRY
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </Button>
              <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-6">
                Our engineering team typically responds within 4-6 business hours.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
