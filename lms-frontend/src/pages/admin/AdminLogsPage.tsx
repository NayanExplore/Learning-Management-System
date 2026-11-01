import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { AdminNav } from '../../components/AdminNav';
import { BellRing, ShieldCheck, Mail, MessageSquare, Phone, CheckCircle, XCircle } from 'lucide-react';

export const AdminLogsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'NOTIFICATIONS' | 'AUDIT'>('NOTIFICATIONS');
  const [notifLogs, setNotifLogs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [nRes, aRes] = await Promise.all([
        api.get('/v1/admin/notifications', { params: { size: 50 } }),
        api.get('/v1/admin/audit-logs', { params: { size: 50 } }),
      ]);
      if (nRes.data?.success) setNotifLogs(nRes.data.data.content);
      if (aRes.data?.success) setAuditLogs(aRes.data.data.content);
    } catch (err) {
      console.error('Failed to load logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 pb-16 min-h-screen">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Logs & Audit Trails</h1>
          <p className="text-slate-400 text-sm mt-1">
            Review delivery statuses across MSG91, WhatsApp Business Cloud API, and transactional emails.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex space-x-2 border-b border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition ${
              activeTab === 'NOTIFICATIONS'
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Notification Logs (Email / SMS / WhatsApp)
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition ${
              activeTab === 'AUDIT'
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Security & Audit Logs
          </button>
        </div>

        {activeTab === 'NOTIFICATIONS' ? (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-850 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Channel</th>
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Template / Subject</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Provider Message ID</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-xs">
                  {notifLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition font-sans">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                            log.channel === 'EMAIL'
                              ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                              : log.channel === 'WHATSAPP'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                              : 'bg-purple-950/60 text-purple-300 border border-purple-800/60'
                          }`}
                        >
                          {log.channel === 'EMAIL' && <Mail className="w-3.5 h-3.5" />}
                          {log.channel === 'WHATSAPP' && <MessageSquare className="w-3.5 h-3.5" />}
                          {log.channel === 'SMS' && <Phone className="w-3.5 h-3.5" />}
                          <span>{log.channel}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-white">
                        {log.recipient}
                      </td>
                      <td className="px-6 py-4 text-slate-200 font-medium">
                        {log.templateName || log.subject || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                            log.status === 'SENT' || log.status === 'DELIVERED'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                              : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-400 text-xs">
                        {log.providerMessageId || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-850 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Entity</th>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-xs">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition font-sans">
                      <td className="px-6 py-4 font-bold text-teal-400">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-slate-200 font-semibold">
                        {log.entityType} #{log.entityId}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {log.userId || 'System'}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400 truncate max-w-xs">
                        {log.details || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
