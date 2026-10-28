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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 print:p-0 print:bg-white">
      <div className="card-slab bg-paper border-4 border-ink shadow-brutal-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-paper flex items-center justify-between p-6 border-b-3 border-ink z-10 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-saturn-orange border-2 border-ink flex items-center justify-center font-black text-ink shadow-brutal-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-ink tracking-tight uppercase">Tax Invoice (India)</h2>
              <p className="text-[10px] font-mono font-bold text-ink/60">GST COMPLIANT TAX LEDGER</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="btn-brutal bg-lemon text-ink border-2 border-ink shadow-brutal-sm hover:bg-saturn-orange hover:text-white font-mono font-black uppercase tracking-wider text-xs gap-2 h-9 px-4 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white border-2 border-ink shadow-brutal-sm flex items-center justify-center hover:bg-red-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-saturn-orange" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink/70">Compiling Invoice...</span>
          </div>
        ) : !invoice ? (
          <div className="py-20 text-center text-ink/60 font-mono font-bold uppercase">Invoice could not be loaded</div>
        ) : (
          <div className="p-8 sm:p-10 space-y-8 font-sans text-ink bg-paper print:bg-white" id="printable-invoice">
            {/* Top Bar / Branding */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-3 border-ink pb-8">
              <div>
                <div className="text-3xl font-display font-black tracking-tight text-ink flex items-center gap-2">
                  <span>SATURN</span>
                  <span className="bg-saturn-orange text-white px-2 py-0.5 border-2 border-ink shadow-brutal-sm text-2xl">3D</span>
                </div>
                <div className="text-xs font-mono font-black text-saturn-orange uppercase tracking-wider mt-2">
                  // Precision Additive Manufacturing Hub
                </div>
                <div className="text-xs font-mono text-ink/80 mt-2 space-y-1 leading-relaxed">
                  <div>{invoice.supplier.address}</div>
                  <div>GSTIN: <span className="font-black text-ink bg-white px-1.5 py-0.5 border border-ink">{invoice.supplier.gstin}</span></div>
                  <div>Email: {invoice.supplier.email} | Support: {invoice.supplier.phone}</div>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-mint text-ink border-2 border-ink shadow-brutal-sm text-xs font-mono font-black uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ink" />
                  {invoice.paymentStatus}
                </div>
                <div className="text-base font-mono font-black text-ink">
                  INVOICE #{invoice.invoiceNumber}
                </div>
                <div className="text-xs font-mono text-ink/70">Date: {invoice.invoiceDate}</div>
                <div className="text-xs font-mono text-ink/70">Order ID: #{invoice.orderId.slice(0, 8)}</div>
                <div className="text-xs font-mono font-bold text-ink bg-white px-2 py-0.5 border border-ink inline-block mt-1">HSN/SAC: {invoice.supplier.sacCode}</div>
              </div>
            </div>

            {/* Bill To */}
            <div className="card-slab bg-white border-3 border-ink shadow-brutal-sm p-6">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-saturn-orange mb-2">// BILLED TO</div>
              <div className="font-display font-black text-base text-ink uppercase">{invoice.customer.name}</div>
              <div className="text-xs font-mono text-ink/70">{invoice.customer.email}</div>
              {invoice.customer.shippingAddress && (
                <div className="text-xs font-mono text-ink/80 mt-2 pt-2 border-t border-ink/20 space-y-0.5">
                  <div>{invoice.customer.shippingAddress.line1}</div>
                  <div>{invoice.customer.shippingAddress.city}, {invoice.customer.shippingAddress.state} - {invoice.customer.shippingAddress.postal_code}</div>
                  <div className="font-bold">{invoice.customer.shippingAddress.country}</div>
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto border-3 border-ink shadow-brutal-sm bg-white">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-3 border-ink bg-ink text-paper">
                    <th className="py-3 px-4 text-left font-mono font-black uppercase tracking-wider">Description</th>
                    <th className="py-3 px-4 text-center font-mono font-black uppercase tracking-wider">Qty</th>
                    <th className="py-3 px-4 text-right font-mono font-black uppercase tracking-wider">Unit Price</th>
                    <th className="py-3 px-4 text-right font-mono font-black uppercase tracking-wider">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-ink/20 font-mono">
                  {invoice.items.map((item, i) => (
                    <tr key={i} className="hover:bg-lemon/15">
                      <td className="py-4 px-4 font-bold text-ink">
                        <div className="font-display text-sm font-black">{item.name}</div>
                        {item.options?.material && (
                          <span className="inline-block text-[10px] font-mono bg-paper border border-ink px-1.5 py-0.5 mt-1 font-bold text-saturn-orange">
                            Material: {item.options.material}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-black">{item.quantity}</td>
                      <td className="py-4 px-4 text-right font-bold">₹{item.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-black text-ink">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financials & Tax Breakdown */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t-3 border-ink">
              <div className="text-xs font-mono text-ink/70 max-w-sm space-y-2">
                <div className="font-mono font-black text-ink uppercase tracking-wider">// DECLARATION & TERMS</div>
                <p className="leading-relaxed bg-white p-3 border-2 border-ink shadow-brutal-sm text-[11px]">
                  This is an authorized computer-generated tax invoice. Goods/services once supplied are covered under Saturn 3D standard precision manufacturing & micron tolerance warranties.
                </p>
                <div className="text-[10px] font-mono font-bold text-ink/80">Gateway: <span className="font-black text-ink uppercase">{invoice.paymentMethod}</span></div>
              </div>

              <div className="w-full sm:w-80 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-ink/80 pb-1 border-b border-ink/20">
                  <span>Subtotal:</span>
                  <span className="font-black text-ink">₹{invoice.financials.subtotal.toFixed(2)}</span>
                </div>
                {invoice.financials.discount > 0 && (
                  <div className="flex justify-between text-saturn-orange font-black pb-1 border-b border-ink/20">
                    <span>Discount Applied:</span>
                    <span>-₹{invoice.financials.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink/80 pb-1 border-b border-ink/20">
                  <span>Taxable Base:</span>
                  <span className="font-bold">₹{invoice.financials.netTaxableAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ink/80 pb-1 border-b border-ink/20">
                  <span>CGST (9%):</span>
                  <span className="font-bold">₹{invoice.financials.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ink/80 pb-1 border-b border-ink/20">
                  <span>SGST (9%):</span>
                  <span className="font-bold">₹{invoice.financials.sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ink/80 pb-1 border-b border-ink/20">
                  <span>Shipping:</span>
                  <span className="font-black">
                    {invoice.financials.shippingCost === 0 ? 'FREE' : `₹${invoice.financials.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline p-3 bg-lemon border-3 border-ink shadow-brutal-sm text-sm font-black text-ink mt-3">
                  <span className="font-mono uppercase tracking-wider">Grand Total:</span>
                  <span className="text-xl font-mono text-saturn-orange font-black">₹{invoice.financials.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
