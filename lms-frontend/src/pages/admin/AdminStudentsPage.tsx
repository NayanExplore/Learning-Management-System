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
    <div className="flex-1 bg-slate-950 text-slate-100 pb-16 min-h-screen">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Student Directory</h1>
            <p className="text-slate-400 text-sm mt-1">
              Search and manage student accounts, phone verification, and access controls.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-850 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Email Verified</th>
                  <th className="px-6 py-4">Phone Verified</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-teal-950/60 text-teal-400 border border-teal-850 font-bold flex items-center justify-center text-xs">
                          {s.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{s.fullName}</p>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                      {s.phone || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {s.emailVerified ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
                          <CheckCircle className="w-4 h-4 mr-1 text-emerald-400" /> Verified
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {s.phoneVerified ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
                          <CheckCircle className="w-4 h-4 mr-1 text-emerald-400" /> Verified
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          s.enabled !== false
                            ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950/50 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {s.enabled !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        to={`/admin/enrollments?q=${encodeURIComponent(s.email)}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-teal-400 hover:text-teal-300 bg-teal-950/40 hover:bg-teal-900/40 border border-teal-800/60 px-2.5 py-1.5 rounded-lg transition"
                        title="View Courses Enrolled"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Courses</span>
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(s.id, s.enabled !== false)}
                        className={`p-1.5 rounded-lg transition ${
                          s.enabled !== false
                            ? 'text-rose-400 hover:bg-slate-800'
                            : 'text-emerald-400 hover:bg-slate-800'
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
