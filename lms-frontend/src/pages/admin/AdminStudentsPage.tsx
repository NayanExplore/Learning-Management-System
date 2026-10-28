import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { User } from '../../types';
import { AdminNav } from '../../components/AdminNav';
import { Users, Search, CheckCircle, XCircle, ShieldCheck, UserCheck, UserX, GraduationCap } from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/admin/students', {
        params: { q: searchTerm || undefined, size: 50 },
      });
      if (res.data?.success) {
        setStudents(res.data.data.content);
      }
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleToggleStatus = async (studentId: number, currentlyEnabled: boolean) => {
    try {
      await api.patch(`/v1/admin/students/${studentId}/status`, {
        enabled: !currentlyEnabled,
      });
      fetchStudents();
    } catch {
      alert('Failed to update student account status.');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 pb-16">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Student Directory</h1>
            <p className="text-slate-500 text-sm mt-1">
              Search and manage student accounts, phone verification, and access controls.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Email Verified</th>
                  <th className="px-6 py-4">Phone Verified</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                          {s.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{s.fullName}</p>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                      {s.phone || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {s.emailVerified ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                          <CheckCircle className="w-4 h-4 mr-1 text-emerald-500" /> Verified
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {s.phoneVerified ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                          <CheckCircle className="w-4 h-4 mr-1 text-emerald-500" /> Verified
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          s.enabled !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {s.enabled !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        to={`/admin/enrollments?q=${encodeURIComponent(s.email)}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                        title="View Courses Enrolled"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Courses</span>
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(s.id, s.enabled !== false)}
                        className={`p-1.5 rounded-lg transition ${
                          s.enabled !== false
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={s.enabled !== false ? 'Deactivate Student Account' : 'Reactivate Student Account'}
                      >
                        {s.enabled !== false ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
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
