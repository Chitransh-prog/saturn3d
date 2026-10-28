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
    <div className="space-y-6 font-mono">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[9px] font-black bg-ink text-paper px-2 py-0.5 uppercase">MOD::08</span>
          <h1 className="font-display font-black text-2xl text-ink uppercase tracking-tight">Security & Audit Ledger</h1>
        </div>
        <p className="font-mono text-xs text-ink/70 font-bold uppercase tracking-wider">
          Immutable cryptographic trail of all administrative and financial mutations
        </p>
      </div>

      <div className="card-slab bg-white border-3 border-ink shadow-brutal overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-ink/50 font-mono font-black text-xs uppercase tracking-widest">
            No audit ledger events recorded yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead className="bg-ink text-paper border-b-3 border-ink">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Timestamp</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Action</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Target Entity</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Host / IP</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper">Mutation Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-lemon/15 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-ink/70 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-ink/40" />
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
                      <span className="font-mono font-black text-[10px] tracking-wider uppercase px-2 py-0.5 border border-ink bg-lemon text-ink shadow-[1px_1px_0px_#0B0B0B]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-ink">
                      <span className="text-[10px] font-black text-ink/60 uppercase mr-1">{log.target_type}:</span>
                      {log.target_id.slice(0, 16)}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-ink/70">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-ink/80 max-w-xs truncate">
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
