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
    <div className="flex-1 bg-slate-50 pb-16">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Orders & Payment Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete audit trail of course checkouts, verified payment amounts, and Razorpay transaction IDs.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
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
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition font-sans">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {o.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{o.user?.fullName || '—'}</p>
                        <p className="text-xs text-slate-400">{o.user?.email || '—'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {o.course?.title || '—'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₹{o.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          o.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : o.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                      {o.razorpayOrderId || '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
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
