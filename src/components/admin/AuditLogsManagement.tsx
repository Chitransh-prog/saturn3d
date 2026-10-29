import React, { useState, useEffect, useCallback } from 'react';
import { History, Shield, Loader2, Calendar, HardDrive } from 'lucide-react';
import { adminApi, getApiError, type AuditLog } from '@/lib/api';
import { toast } from 'sonner';

export default function AuditLogsManagement() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAuditLogs();
      if (res.data.success && res.data.data) {
        setLogs(res.data.data.logs || []);
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10">
            LOG // 08
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0B0D10]">
            Security &amp; Audit Ledger
          </h1>
        </div>
        <p className="text-xs text-[#5B616B] font-mono">
          Immutable cryptographic trail of all administrative and financial mutations
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-[#5B616B] font-mono text-xs uppercase tracking-widest">
            No audit ledger events recorded yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead className="bg-[#F5F6F8] border-b border-[#0B0D10]/10">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Timestamp</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Action</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Target Entity</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Host / IP</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Mutation Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B0D10]/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-[#5B616B] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#5B616B]/60" />
                        {new Date(log.created_at).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-[10px] tracking-wide uppercase px-2.5 py-0.5 rounded-full border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 text-[#FF5A1F]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-[#0B0D10]">
                      <span className="text-[10px] text-[#5B616B] uppercase mr-1">{log.target_type}:</span>
                      {log.target_id.slice(0, 16)}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-[#5B616B]">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-[#0B0D10]/80 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
