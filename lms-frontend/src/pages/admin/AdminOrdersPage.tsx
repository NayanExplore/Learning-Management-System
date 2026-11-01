import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { AdminNav } from '../../components/AdminNav';
import { CreditCard, CheckCircle, Clock, XCircle, Search } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get('/v1/admin/orders', { params: { size: 50 } });
        if (res.data?.success) {
          setOrders(res.data.data.content);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 pb-16 min-h-screen">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Orders & Payment Transactions</h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete audit trail of course checkouts, verified payment amounts, and Razorpay transaction IDs.
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-850 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Razorpay Reference</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition font-sans">
                    <td className="px-6 py-4 font-mono font-bold text-teal-400">
                      {o.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white">{o.user?.fullName || '—'}</p>
                        <p className="text-xs text-slate-400">{o.user?.email || '—'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {o.course?.title || '—'}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">
                      ₹{o.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          o.status === 'PAID'
                            ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800'
                            : o.status === 'PENDING'
                            ? 'bg-amber-950/50 text-amber-300 border border-amber-800'
                            : 'bg-rose-950/50 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400 text-xs">
                      {o.razorpayOrderId || '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
