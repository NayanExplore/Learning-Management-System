import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  CreditCard,
  FileText,
} from 'lucide-react';

export const AdminNav: React.FC = () => {
  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/courses', label: 'Courses & Fees', icon: BookOpen },
    { to: '/admin/enrollments', label: 'Student Enrollments', icon: GraduationCap },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/orders', label: 'Orders & Payments', icon: CreditCard },
    { to: '/admin/logs', label: 'System Logs', icon: FileText },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 sticky top-16 z-40 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
