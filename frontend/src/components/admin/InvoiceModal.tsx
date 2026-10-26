import React, { useEffect, useState } from 'react';
import { X, Printer, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ordersApi, type InvoiceData } from '@/lib/api';
import { toast } from 'sonner';

interface InvoiceModalProps {
  orderId: string;
  onClose: () => void;
}

export default function InvoiceModal({ orderId, onClose }: InvoiceModalProps) {
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await ordersApi.getInvoice(orderId);
        if (res.data.success && res.data.data) {
          setInvoice(res.data.data.invoice);
        }
      } catch (err: any) {
        toast.error('Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl print:max-h-none print:shadow-none print:rounded-none">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-slate-100 rounded-t-3xl print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-black text-lg text-black tracking-tight">Tax Invoice (India)</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-black text-white hover:bg-primary rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 h-9 px-4"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !invoice ? (
          <div className="py-20 text-center text-slate-400 font-bold">Invoice could not be loaded</div>
        ) : (
          <div className="p-8 sm:p-10 space-y-8 font-sans text-slate-800" id="printable-invoice">
            {/* Top Bar / Branding */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8">
              <div>
                <div className="text-2xl font-black tracking-tighter text-black flex items-center gap-1">
                  SATURN <span className="text-[#F7931E]">3D</span>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Precision Industrial Manufacturing
                </div>
                <div className="text-xs text-slate-500 mt-2 space-y-0.5 font-medium leading-relaxed">
                  <div>{invoice.supplier.address}</div>
                  <div>GSTIN: <span className="font-mono font-bold text-black">{invoice.supplier.gstin}</span></div>
                  <div>Email: {invoice.supplier.email} | Support: {invoice.supplier.phone}</div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                  <CheckCircle2 className="w-3 h-3 inline mr-1 -translate-y-0.5" />
                  {invoice.paymentStatus}
                </div>
                <div className="text-sm font-black text-black">
                  INVOICE #{invoice.invoiceNumber}
                </div>
                <div className="text-xs text-slate-400 font-medium">Date: {invoice.invoiceDate}</div>
                <div className="text-xs text-slate-400 font-medium">Order ID: #{invoice.orderId.slice(0, 8)}</div>
                <div className="text-xs text-slate-500 font-bold mt-1">HSN/SAC: {invoice.supplier.sacCode}</div>
              </div>
            </div>

            {/* Bill To */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Billed To</div>
              <div className="font-bold text-sm text-black">{invoice.customer.name}</div>
              <div className="text-xs text-slate-500">{invoice.customer.email}</div>
              {invoice.customer.shippingAddress && (
                <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                  <div>{invoice.customer.shippingAddress.line1}</div>
                  <div>{invoice.customer.shippingAddress.city}, {invoice.customer.shippingAddress.state} - {invoice.customer.shippingAddress.postal_code}</div>
                  <div>{invoice.customer.shippingAddress.country}</div>
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="py-3 px-4 text-left font-black uppercase tracking-wider text-slate-400">Description</th>
                    <th className="py-3 px-4 text-center font-black uppercase tracking-wider text-slate-400">Qty</th>
                    <th className="py-3 px-4 text-right font-black uppercase tracking-wider text-slate-400">Unit Price</th>
                    <th className="py-3 px-4 text-right font-black uppercase tracking-wider text-slate-400">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/30">
                      <td className="py-4 px-4 font-bold text-black">
                        {item.name}
                        {item.options?.material && (
                          <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Material: {item.options.material}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-medium">{item.quantity}</td>
                      <td className="py-4 px-4 text-right font-mono font-medium">₹{item.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-black">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financials & Tax Breakdown */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-400 max-w-sm space-y-1">
                <div className="font-bold text-slate-600">Declaration & Terms:</div>
                <p className="leading-relaxed">
                  This is a computer-generated tax invoice. Goods/services once supplied are covered under Saturn 3D standard precision manufacturing warranties.
                </p>
                <div className="pt-2 text-[10px] font-mono text-slate-400">Payment Gateway: {invoice.paymentMethod}</div>
              </div>

              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-black">₹{invoice.financials.subtotal.toFixed(2)}</span>
                </div>
                {invoice.financials.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Applied:</span>
                    <span className="font-mono">-₹{invoice.financials.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Taxable Base:</span>
                  <span className="font-mono font-medium">₹{invoice.financials.netTaxableAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>CGST (9%):</span>
                  <span className="font-mono">₹{invoice.financials.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>SGST (9%):</span>
                  <span className="font-mono">₹{invoice.financials.sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping:</span>
                  <span className="font-mono">
                    {invoice.financials.shippingCost === 0 ? 'FREE' : `₹${invoice.financials.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t-2 border-black text-sm font-black text-black">
                  <span>Grand Total:</span>
                  <span className="text-lg font-mono text-primary">₹{invoice.financials.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
