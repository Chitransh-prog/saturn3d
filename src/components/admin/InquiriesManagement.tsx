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
    new: 'bg-lemon text-ink border-ink',
    contacted: 'bg-periwinkle text-ink border-ink',
    quoted: 'bg-saturn-orange text-white border-ink',
    completed: 'bg-mint text-ink border-ink',
    archived: 'bg-neutral-200 text-ink/70 border-ink',
  };

  return (
    <span className={`px-2.5 py-0.5 border-2 font-mono text-[9px] font-black uppercase tracking-wider inline-flex items-center shadow-[2px_2px_0px_#0B0B0B] ${styles[status] || styles.new}`}>
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
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] font-black bg-ink text-paper px-2 py-0.5 uppercase">MOD::05</span>
            <h1 className="font-display font-black text-2xl text-ink uppercase tracking-tight">Customer Inquiries & Quotes</h1>
          </div>
          <p className="font-mono text-xs text-ink/70 font-bold uppercase tracking-wider">
            Review custom CAD submissions, volume quote inquiries, and client technical requests
          </p>
        </div>
        <button
          className="border-2 border-ink font-mono font-black uppercase tracking-wider text-[10px] h-10 px-4 bg-white text-ink shadow-brutal-sm hover:bg-lemon flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5 transition-all self-start sm:self-auto"
          onClick={fetchInquiries}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Pipeline
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'new', 'contacted', 'quoted', 'completed', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase tracking-wider transition-all shadow-brutal-sm ${
              statusFilter === status
                ? 'bg-saturn-orange text-white border-ink -translate-y-0.5'
                : 'bg-white text-ink border-ink hover:bg-lemon'
            }`}
          >
            {status} ({status === 'all' ? inquiries.length : inquiries.filter((i) => i.status.toLowerCase() === status).length})
          </button>
        ))}
      </div>

      {/* Main Table / List */}
      <div className="card-slab bg-white border-3 border-ink shadow-brutal overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center space-y-3 font-mono">
            <div className="w-14 h-14 border-2 border-ink bg-paper flex items-center justify-center mx-auto text-ink shadow-brutal-sm">
              <Mail className="w-7 h-7" />
            </div>
            <div className="text-ink/60 font-black text-xs uppercase tracking-widest">
              No inquiries found in this pipeline view
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead className="bg-ink text-paper border-b-3 border-ink">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Contact & Organization</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Subject / Part</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Qty</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Status</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Date</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-black uppercase tracking-wider text-paper">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-lemon/15 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-xs text-ink uppercase">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-ink/70 font-bold flex items-center gap-1 mt-0.5">
                          {item.email} {item.phone && `• ${item.phone}`}
                        </span>
                        {item.company_name && (
                          <span className="text-[9px] text-ink/50 uppercase mt-0.5 flex items-center gap-1">
                            <Building className="w-2.5 h-2.5" /> {item.company_name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      <span className="font-bold text-xs text-ink">{item.subject || 'Custom 3D Print Quote'}</span>
                      <p className="text-[10px] text-ink/60 truncate mt-0.5">{item.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-xs text-ink">{item.quantity || 1} PCS</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-ink/70">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 ml-auto">
                        <button
                          title="View Inquiry Details"
                          onClick={() => setSelectedInquiry(item)}
                          className="w-8 h-8 border-2 border-ink bg-white flex items-center justify-center text-ink shadow-brutal-sm hover:bg-lemon active:translate-x-0.5 active:translate-y-0.5 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete Inquiry"
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 border-2 border-ink bg-white flex items-center justify-center text-ink shadow-brutal-sm hover:bg-red-500 hover:text-white active:translate-x-0.5 active:translate-y-0.5 transition-all"
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
          <DialogContent className="max-w-2xl bg-paper border-3 border-ink shadow-brutal p-6 font-mono">
            <DialogHeader className="border-b-3 border-ink pb-4">
              <DialogTitle className="font-display font-black text-xl text-ink uppercase flex items-center justify-between">
                <span>Inquiry Dossier</span>
                <StatusBadge status={selectedInquiry.status} />
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4 bg-white p-4 border-2 border-ink shadow-brutal-sm">
                <div>
                  <span className="text-[10px] text-ink/60 uppercase font-black block">Client Contact</span>
                  <div className="font-black text-ink mt-0.5">{selectedInquiry.name}</div>
                  <div className="text-ink/80 mt-0.5">{selectedInquiry.email}</div>
                  {selectedInquiry.phone && <div className="text-ink/80 mt-0.5">{selectedInquiry.phone}</div>}
                </div>
                <div>
                  <span className="text-[10px] text-ink/60 uppercase font-black block">Organization & Scale</span>
                  <div className="font-black text-ink mt-0.5">{selectedInquiry.company_name || 'Individual / Startup'}</div>
                  <div className="text-saturn-orange font-black mt-0.5">Quantity: {selectedInquiry.quantity || 1} units</div>
                  <div className="text-ink/60 mt-0.5">Received: {new Date(selectedInquiry.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-ink/60 uppercase font-black block mb-1">Subject / Specification Scope</span>
                <div className="p-3 bg-white border-2 border-ink font-bold text-ink">
                  {selectedInquiry.subject || 'Custom 3D Printing Service Request'}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-ink/60 uppercase font-black block mb-1">Project Brief & Details</span>
                <div className="p-4 bg-white border-2 border-ink whitespace-pre-wrap font-medium leading-relaxed max-h-60 overflow-y-auto">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-ink/60 uppercase font-black block mb-2">Update Pipeline Status</span>
                <div className="flex flex-wrap gap-2">
                  {['new', 'contacted', 'quoted', 'completed', 'archived'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedInquiry.id, st)}
                      className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase tracking-wider transition-all shadow-brutal-sm ${
                        selectedInquiry.status === st
                          ? 'bg-ink text-paper border-ink'
                          : 'bg-white text-ink border-ink hover:bg-lemon'
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
