import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Sparkles,
  ChevronDown,
  ArrowRight,
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50">
      {/* Top micro-announcement bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-slate-300 text-xs py-1.5 px-4 text-center border-b border-indigo-500/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white font-semibold">2026 Cohort Enrollment Open:</span>
          <span>Earn verifiable professional certificates and build industry-grade projects.</span>
          <Link to="/courses" className="text-indigo-400 hover:text-indigo-300 font-bold underline inline-flex items-center ml-1">
            Explore Programs <ArrowRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>

      {/* Main Glassmorphic Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand Logo */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    SkillForge<span className="text-indigo-600">.</span>
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 -mt-1">
                    Academy
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center space-x-1 text-sm font-medium">
                <Link
                  to="/courses"
                  className={`px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                    isActive('/courses')
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span>Explore Courses</span>
                </Link>

                <Link
                  to="/verify-certificate"
                  className={`px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                    isActive('/verify-certificate')
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verify Certificate</span>
                </Link>

                <Link
                  to="/about"
                  className={`px-3.5 py-2 rounded-lg transition-all ${
                    isActive('/about')
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  About Us
                </Link>

                <Link
                  to="/contact"
                  className={`px-3.5 py-2 rounded-lg transition-all ${
                    isActive('/contact')
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* User Auth Section */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 px-3.5 py-1.5 rounded-full text-sm font-medium transition shadow-xs"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-800">{user.fullName.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{user.email}</p>
                        <span className="inline-flex items-center mt-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        {user.role === 'ADMIN' ? (
                          <>
                            <Link
                              to="/admin"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 space-x-2.5 font-medium transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                              <span>Admin Console</span>
                            </Link>
                            <Link
                              to="/admin/courses"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 space-x-2.5 font-medium transition-colors"
                            >
                              <BookOpen className="w-4 h-4 text-indigo-600" />
                              <span>Courses & Fees</span>
                            </Link>
                          </>
                        ) : (
                          <Link
                            to="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 space-x-2.5 font-medium transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                            <span>My Learning Dashboard</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 space-x-2.5 font-medium transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2.5">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3.5 py-2 rounded-lg hover:bg-slate-50 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center space-x-1.5 text-sm font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-4 py-2 rounded-xl shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <span>Get Started</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 py-2 px-3 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Explore Courses</span>
            </Link>
            <Link
              to="/verify-certificate"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 py-2 px-3 rounded-lg text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verify Certificate</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
            >
              Contact
            </Link>

            <div className="border-t border-slate-100 pt-3">
              {user ? (
                <>
                  <Link
                    to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 py-2.5 px-3 rounded-lg font-bold text-indigo-600 hover:bg-indigo-50"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Learning Dashboard'}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left py-2 px-3 text-rose-600 font-medium hover:bg-rose-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 text-sm font-bold border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/30"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
