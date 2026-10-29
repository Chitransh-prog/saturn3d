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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0D10]/60 backdrop-blur-sm print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-[#F5F6F8] flex items-center justify-between p-5 border-b border-[#0B0D10]/10 z-10 print:hidden rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF5A1F]/10 rounded-lg flex items-center justify-center text-[#FF5A1F]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-base text-[#0B0D10]">Tax Invoice (India)</h2>
              <p className="text-[10px] font-mono text-[#5B616B]">GST COMPLIANT TAX LEDGER</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-[#0B0D10] text-white hover:bg-[#1E232B] font-mono text-xs gap-2 h-9 px-4 rounded-xl cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white border border-[#0B0D10]/10 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-[#5B616B]"
              aria-label="Close invoice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#5B616B]">Compiling Invoice...</span>
          </div>
        ) : !invoice ? (
          <div className="py-20 text-center text-[#5B616B] font-mono uppercase">Invoice could not be loaded</div>
        ) : (
          <div className="p-8 sm:p-10 space-y-8 font-sans text-[#0B0D10] bg-white" id="printable-invoice">
            {/* Top Bar / Branding */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-[#0B0D10]/10 pb-8">
              <div>
                <div className="text-2xl font-bold tracking-tight text-[#0B0D10] flex items-center gap-2 font-mono">
                  <span>SATURN</span>
                  <span className="bg-[#FF5A1F] text-white px-2 py-0.5 rounded-lg text-xl">3D</span>
                </div>
                <div className="text-xs font-mono font-medium text-[#FF5A1F] uppercase tracking-wider mt-2">
                  // Precision Additive Manufacturing Hub
                </div>
                <div className="text-xs font-mono text-[#5B616B] mt-2 space-y-1 leading-relaxed">
                  <div>{invoice.supplier.address}</div>
                  <div>GSTIN: <span className="font-semibold text-[#0B0D10] bg-[#F5F6F8] px-1.5 py-0.5 rounded border border-[#0B0D10]/10">{invoice.supplier.gstin}</span></div>
                  <div>Email: {invoice.supplier.email} | Support: {invoice.supplier.phone}</div>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1.5 font-mono">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-xs font-medium uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {invoice.paymentStatus}
                </div>
                <div className="text-base font-semibold text-[#0B0D10]">
                  INVOICE #{invoice.invoiceNumber}
                </div>
                <div className="text-xs text-[#5B616B]">Date: {invoice.invoiceDate}</div>
                <div className="text-xs text-[#5B616B]">Order ID: #{invoice.orderId.slice(0, 8)}</div>
                <div className="text-xs font-medium text-[#0B0D10] bg-[#F5F6F8] px-2 py-0.5 rounded border border-[#0B0D10]/10 inline-block mt-1">HSN/SAC: {invoice.supplier.sacCode}</div>
              </div>
            </div>

            {/* Bill To */}
            <div className="bg-[#F5F6F8] border border-[#0B0D10]/10 rounded-xl p-5 font-mono">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#FF5A1F] mb-1.5">// BILLED TO</div>
              <div className="font-semibold text-sm text-[#0B0D10] uppercase">{invoice.customer.name}</div>
              <div className="text-xs text-[#5B616B]">{invoice.customer.email}</div>
              {invoice.customer.shippingAddress && (
                <div className="text-xs text-[#5B616B] mt-2 pt-2 border-t border-[#0B0D10]/10 space-y-0.5">
                  <div>{invoice.customer.shippingAddress.line1}</div>
                  <div>{invoice.customer.shippingAddress.city}, {invoice.customer.shippingAddress.state} - {invoice.customer.shippingAddress.postal_code}</div>
                  <div className="font-medium text-[#0B0D10]">{invoice.customer.shippingAddress.country}</div>
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto border border-[#0B0D10]/10 rounded-xl bg-white">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#0B0D10]/10 bg-[#F5F6F8] text-[#5B616B]">
                    <th className="py-3 px-4 text-left font-mono font-semibold uppercase tracking-wider">Description</th>
                    <th className="py-3 px-4 text-center font-mono font-semibold uppercase tracking-wider">Qty</th>
                    <th className="py-3 px-4 text-right font-mono font-semibold uppercase tracking-wider">Unit Price</th>
                    <th className="py-3 px-4 text-right font-mono font-semibold uppercase tracking-wider">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B0D10]/5 font-mono">
                  {invoice.items.map((item, i) => (
                    <tr key={i} className="hover:bg-[#F5F6F8]/50">
                      <td className="py-4 px-4 font-medium text-[#0B0D10]">
                        <div className="text-sm font-semibold">{item.name}</div>
                        {item.options?.material && (
                          <span className="inline-block text-[10px] font-mono bg-[#F5F6F8] border border-[#0B0D10]/10 px-2 py-0.5 rounded mt-1 font-medium text-[#FF5A1F]">
                            Material: {item.options.material}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-semibold text-[#0B0D10]">{item.quantity}</td>
                      <td className="py-4 px-4 text-right text-[#5B616B]">₹{item.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-semibold text-[#0B0D10]">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financials & Tax Breakdown */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-[#0B0D10]/10 font-mono">
              <div className="text-xs text-[#5B616B] max-w-sm space-y-2">
                <div className="font-semibold text-[#0B0D10] uppercase tracking-wider">// DECLARATION &amp; TERMS</div>
                <p className="leading-relaxed bg-[#F5F6F8] p-3 rounded-xl border border-[#0B0D10]/10 text-[11px]">
                  This is an authorized computer-generated tax invoice. Goods/services once supplied are covered under Saturn 3D standard precision manufacturing &amp; micron tolerance warranties.
                </p>
                <div className="text-[10px] text-[#5B616B]">Gateway: <span className="font-semibold text-[#0B0D10] uppercase">{invoice.paymentMethod}</span></div>
              </div>

              <div className="w-full sm:w-80 space-y-2 text-xs">
                <div className="flex justify-between text-[#5B616B] pb-1 border-b border-[#0B0D10]/10">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#0B0D10]">₹{invoice.financials.subtotal.toFixed(2)}</span>
                </div>
                {invoice.financials.discount > 0 && (
                  <div className="flex justify-between text-[#FF5A1F] font-semibold pb-1 border-b border-[#0B0D10]/10">
                    <span>Discount Applied:</span>
                    <span>-₹{invoice.financials.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5B616B] pb-1 border-b border-[#0B0D10]/10">
                  <span>Taxable Base:</span>
                  <span className="font-medium text-[#0B0D10]">₹{invoice.financials.netTaxableAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5B616B] pb-1 border-b border-[#0B0D10]/10">
                  <span>CGST (9%):</span>
                  <span className="font-medium text-[#0B0D10]">₹{invoice.financials.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5B616B] pb-1 border-b border-[#0B0D10]/10">
                  <span>SGST (9%):</span>
                  <span className="font-medium text-[#0B0D10]">₹{invoice.financials.sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5B616B] pb-1 border-b border-[#0B0D10]/10">
                  <span>Shipping:</span>
                  <span className="font-semibold text-[#0B0D10]">
                    {invoice.financials.shippingCost === 0 ? 'FREE' : `₹${invoice.financials.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline p-3 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 rounded-xl text-sm font-semibold text-[#0B0D10] mt-3">
                  <span className="uppercase tracking-wider">Grand Total:</span>
                  <span className="text-xl text-[#FF5A1F] font-bold">₹{invoice.financials.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
