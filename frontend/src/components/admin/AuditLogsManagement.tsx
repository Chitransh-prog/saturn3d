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
        <h1 className="text-2xl font-black text-black tracking-tighter">Security & Audit Logs</h1>
        <p className="text-slate-400 text-sm font-medium">Immutable audit trail of all administrative and financial mutations</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-black text-xs uppercase tracking-widest">
            No audit events recorded yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Target</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">IP / Source</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
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
                      <span className="font-mono font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md bg-black text-white">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-black">
                      <span className="text-[10px] font-black text-slate-400 uppercase mr-1">{log.target_type}:</span>
                      {log.target_id.slice(0, 16)}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 max-w-xs truncate">
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
