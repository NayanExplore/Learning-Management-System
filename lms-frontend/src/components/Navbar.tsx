import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-[#E5E7EB] dark:border-slate-800 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#172B4D] dark:bg-[#287C78] flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-[#20252B] dark:text-white">
                  SkillForge
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/')
                    ? 'text-[#172B4D] dark:text-white font-semibold bg-slate-100/80 dark:bg-slate-800'
                    : 'text-[#697386] dark:text-slate-400 hover:text-[#20252B] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/courses')
                    ? 'text-[#172B4D] dark:text-white font-semibold bg-slate-100/80 dark:bg-slate-800'
                    : 'text-[#697386] dark:text-slate-400 hover:text-[#20252B] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                Explore Courses
              </Link>
              <Link
                to="/verify-certificate"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/verify-certificate')
                    ? 'text-[#172B4D] dark:text-white font-semibold bg-slate-100/80 dark:bg-slate-800'
                    : 'text-[#697386] dark:text-slate-400 hover:text-[#20252B] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                Verify Credential
              </Link>
              <Link
                to="/about"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/about')
                    ? 'text-[#172B4D] dark:text-white font-semibold bg-slate-100/80 dark:bg-slate-800'
                    : 'text-[#697386] dark:text-slate-400 hover:text-[#20252B] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/contact')
                    ? 'text-[#172B4D] dark:text-white font-semibold bg-slate-100/80 dark:bg-slate-800'
                    : 'text-[#697386] dark:text-slate-400 hover:text-[#20252B] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/90 hover:bg-slate-800 transition-colors text-sm font-medium text-slate-100"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[140px] truncate text-slate-100 font-medium">{user.fullName || user.email}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 animate-in fade-in duration-100 ring-1 ring-black/40">
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-teal-400" />
                        <span>{user.role === 'ADMIN' ? 'Admin Console' : 'My Dashboard'}</span>
                      </Link>
                      <Link
                        to="/verify-certificate"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-teal-400" />
                        <span>Verify Certificate</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-800 pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-[#697386] dark:text-slate-300 hover:text-[#20252B] dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#172B4D] hover:bg-[#0E1E38] dark:bg-[#287C78] dark:hover:bg-[#1E615E] rounded-lg transition-colors shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-md text-sm font-medium text-[#20252B] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-md text-sm font-medium text-[#20252B] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Explore Courses
          </Link>
          <Link
            to="/verify-certificate"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-md text-sm font-medium text-[#20252B] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Verify Credential
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-md text-sm font-medium text-[#20252B] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-md text-sm font-medium text-[#20252B] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Contact
          </Link>

          <div className="border-t border-slate-800 pt-3 mt-2">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700/60">
                  <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                </div>
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-2 px-3 rounded-md text-sm font-medium text-teal-400 bg-slate-800 hover:bg-slate-750 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{user.role === 'ADMIN' ? 'Admin Console' : 'My Dashboard'}</span>
                </Link>
                <Link
                  to="/verify-certificate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-2 px-3 rounded-md text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Verify Credential</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full text-left py-2 px-3 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-sm font-medium text-[#20252B] dark:text-slate-200 border border-[#E5E7EB] dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-sm font-medium text-white bg-[#172B4D] dark:bg-[#287C78] rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
