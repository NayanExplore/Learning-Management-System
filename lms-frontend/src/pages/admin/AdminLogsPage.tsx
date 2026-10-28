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
    <div className="flex-1 bg-slate-50 pb-16">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Logs & Audit Trails</h1>
          <p className="text-slate-500 text-sm mt-1">
            Review delivery statuses across MSG91, WhatsApp Business Cloud API, and transactional emails.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex space-x-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition ${
              activeTab === 'NOTIFICATIONS'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Notification Logs (Email / SMS / WhatsApp)
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition ${
              activeTab === 'AUDIT'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Security & Audit Logs
          </button>
        </div>

        {activeTab === 'NOTIFICATIONS' ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Channel</th>
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Template / Subject</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Provider Message ID</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {notifLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition font-sans">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                            log.channel === 'EMAIL'
                              ? 'bg-blue-50 text-blue-700'
                              : log.channel === 'WHATSAPP'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-purple-50 text-purple-700'
                          }`}
                        >
                          {log.channel === 'EMAIL' && <Mail className="w-3.5 h-3.5" />}
                          {log.channel === 'WHATSAPP' && <MessageSquare className="w-3.5 h-3.5" />}
                          {log.channel === 'SMS' && <Phone className="w-3.5 h-3.5" />}
                          <span>{log.channel}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                        {log.recipient}
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-medium">
                        {log.templateName || log.subject || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                            log.status === 'SENT' || log.status === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                        {log.providerMessageId || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Entity</th>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition font-sans">
                      <td className="px-6 py-4 font-bold text-indigo-700">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-semibold">
                        {log.entityType} #{log.entityId}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {log.userId || 'System'}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 truncate max-w-xs">
                        {log.details || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
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
