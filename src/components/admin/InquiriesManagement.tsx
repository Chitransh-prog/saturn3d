import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Clock, Eye, Trash2, CheckCircle, AlertCircle, Loader2, Phone, Building, Layers, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi, getApiError } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InquiryItem {
  id: string;
  name: string;
  email: string;
  company_name?: string;
  phone?: string;
  subject?: string;
  message: string;
  quantity?: number;
  status: string;
  created_at: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    new: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    contacted: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    quoted: 'bg-[#FF5A1F]/10 text-[#FF5A1F] border-[#FF5A1F]/20',
    completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    archived: 'bg-neutral-100 text-[#5B616B] border-neutral-200',
  };

  return (
    <span className={`px-2.5 py-0.5 border rounded-full font-mono text-[10px] font-medium uppercase tracking-wider inline-flex items-center ${styles[status] || styles.new}`}>
      {status}
    </span>
  );
};

export default function InquiriesManagement() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getInquiries();
      if (res.data.success && res.data.data) {
        setInquiries(res.data.data.inquiries || []);
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateInquiryStatus(id, newStatus);
      toast.success(`Inquiry marked as ${newStatus}`);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this inquiry?')) return;
    try {
      await adminApi.deleteInquiry(id);
      toast.success('Inquiry removed');
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const filtered = inquiries.filter((inq) => {
    if (statusFilter === 'all') return true;
    return inq.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10">
              INQ // 05
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0B0D10]">
              Customer Inquiries &amp; Quotes
            </h1>
          </div>
          <p className="text-xs text-[#5B616B] font-mono">
            Review custom CAD submissions, volume quote inquiries, and client technical requests
          </p>
        </div>
        <button
          className="border border-[#0B0D10]/10 font-mono text-xs font-medium h-10 px-4 bg-white text-[#0B0D10] rounded-xl hover:bg-[#F5F6F8] flex items-center gap-2 active:scale-[0.98] transition-all self-start sm:self-auto shadow-sm"
          onClick={fetchInquiries}
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#FF5A1F]" />
          Refresh Pipeline
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'new', 'contacted', 'quoted', 'completed', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium uppercase tracking-wider transition-all shadow-sm ${
              statusFilter === status
                ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                : 'bg-white text-[#5B616B] border-[#0B0D10]/10 hover:text-[#0B0D10] hover:bg-[#F5F6F8]'
            }`}
          >
            {status} ({status === 'all' ? inquiries.length : inquiries.filter((i) => i.status.toLowerCase() === status).length})
          </button>
        ))}
      </div>

      {/* Main Table / List */}
      <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center space-y-3 font-mono">
            <div className="w-12 h-12 rounded-xl bg-[#F5F6F8] flex items-center justify-center mx-auto text-[#5B616B]">
              <Mail className="w-6 h-6 text-[#FF5A1F]" />
            </div>
            <div className="text-[#5B616B] text-xs uppercase tracking-widest">
              No inquiries found in this pipeline view
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead className="bg-[#F5F6F8] border-b border-[#0B0D10]/10">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Contact &amp; Organization</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Subject / Part</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Qty</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Status</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Date</th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B0D10]/5">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-[#0B0D10]">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#5B616B] flex items-center gap-1 mt-0.5">
                          {item.email} {item.phone && `• ${item.phone}`}
                        </span>
                        {item.company_name && (
                          <span className="text-[10px] text-[#5B616B]/70 uppercase mt-0.5 flex items-center gap-1">
                            <Building className="w-2.5 h-2.5" /> {item.company_name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      <span className="font-medium text-xs text-[#0B0D10]">{item.subject || 'Custom 3D Print Quote'}</span>
                      <p className="text-[10px] text-[#5B616B] truncate mt-0.5">{item.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-xs text-[#0B0D10]">{item.quantity || 1} PCS</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-[10px] text-[#5B616B]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 ml-auto">
                        <button
                          title="View Inquiry Details"
                          onClick={() => setSelectedInquiry(item)}
                          className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center text-[#5B616B] hover:text-[#0B0D10] hover:bg-[#F5F6F8] shadow-sm transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete Inquiry"
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center text-[#5B616B] hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
          <DialogContent className="max-w-2xl bg-white border border-[#0B0D10]/10 rounded-2xl shadow-2xl p-6 font-mono">
            <DialogHeader className="border-b border-[#0B0D10]/10 pb-4">
              <DialogTitle className="text-lg font-semibold text-[#0B0D10] flex items-center justify-between">
                <span>Inquiry Dossier</span>
                <StatusBadge status={selectedInquiry.status} />
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4 bg-[#F5F6F8] p-4 rounded-xl border border-[#0B0D10]/5">
                <div>
                  <span className="text-[10px] text-[#5B616B] uppercase font-semibold block">Client Contact</span>
                  <div className="font-semibold text-[#0B0D10] mt-0.5">{selectedInquiry.name}</div>
                  <div className="text-[#5B616B] mt-0.5">{selectedInquiry.email}</div>
                  {selectedInquiry.phone && <div className="text-[#5B616B] mt-0.5">{selectedInquiry.phone}</div>}
                </div>
                <div>
                  <span className="text-[10px] text-[#5B616B] uppercase font-semibold block">Organization &amp; Scale</span>
                  <div className="font-semibold text-[#0B0D10] mt-0.5">{selectedInquiry.company_name || 'Individual / Startup'}</div>
                  <div className="text-[#FF5A1F] font-semibold mt-0.5">Quantity: {selectedInquiry.quantity || 1} units</div>
                  <div className="text-[#5B616B] mt-0.5">Received: {new Date(selectedInquiry.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#5B616B] uppercase font-semibold block mb-1">Subject / Specification Scope</span>
                <div className="p-3 bg-white rounded-xl border border-[#0B0D10]/10 font-medium text-[#0B0D10]">
                  {selectedInquiry.subject || 'Custom 3D Printing Service Request'}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#5B616B] uppercase font-semibold block mb-1">Project Brief &amp; Details</span>
                <div className="p-4 bg-white rounded-xl border border-[#0B0D10]/10 whitespace-pre-wrap font-normal leading-relaxed max-h-60 overflow-y-auto text-[#0B0D10]/90">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-[#5B616B] uppercase font-semibold block mb-2">Update Pipeline Status</span>
                <div className="flex flex-wrap gap-2">
                  {['new', 'contacted', 'quoted', 'completed', 'archived'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedInquiry.id, st)}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-medium uppercase tracking-wider transition-all ${
                        selectedInquiry.status === st
                          ? 'bg-[#0B0D10] text-white border-[#0B0D10]'
                          : 'bg-white text-[#5B616B] border-[#0B0D10]/10 hover:text-[#0B0D10] hover:bg-[#F5F6F8]'
                      }`}
                    >
                      Mark as {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
