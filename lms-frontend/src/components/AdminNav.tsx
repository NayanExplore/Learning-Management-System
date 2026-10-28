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
    { to: '/admin/enrollments', label: 'Student Enrollments', icon: GraduationCap, badge: 'Matrix' },
    { to: '/admin/students', label: 'Student Accounts', icon: Users },
    { to: '/admin/orders', label: 'Orders & Payments', icon: CreditCard },
    { to: '/admin/logs', label: 'System Logs', icon: FileText },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-xs mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
