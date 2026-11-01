import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  User as UserIcon,
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
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#172B4D] flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-[#20252B]">
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
                    ? 'text-[#172B4D] font-semibold bg-slate-100/80'
                    : 'text-[#697386] hover:text-[#20252B] hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/courses')
                    ? 'text-[#172B4D] font-semibold bg-slate-100/80'
                    : 'text-[#697386] hover:text-[#20252B] hover:bg-slate-50'
                }`}
              >
                Explore Courses
              </Link>
              <Link
                to="/verify-certificate"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/verify-certificate')
                    ? 'text-[#172B4D] font-semibold bg-slate-100/80'
                    : 'text-[#697386] hover:text-[#20252B] hover:bg-slate-50'
                }`}
              >
                Verify Credential
              </Link>
              <Link
                to="/about"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/about')
                    ? 'text-[#172B4D] font-semibold bg-slate-100/80'
                    : 'text-[#697386] hover:text-[#20252B] hover:bg-slate-50'
                }`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/contact')
                    ? 'text-[#172B4D] font-semibold bg-slate-100/80'
                    : 'text-[#697386] hover:text-[#20252B] hover:bg-slate-50'
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
                  className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-50 transition-colors text-sm font-medium text-[#20252B]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#172B4D] text-white text-xs flex items-center justify-center font-semibold">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[140px] truncate">{user.fullName || user.email}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 rounded-lg bg-white border border-[#E5E7EB] shadow-lg py-1.5 z-50 animate-in fade-in duration-100">
                    <div className="px-3.5 py-2 border-b border-[#E5E7EB]">
                      <p className="text-xs font-semibold text-[#20252B] truncate">{user.fullName}</p>
                      <p className="text-xs text-[#697386] truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#20252B] hover:bg-slate-50"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        <span>{user.role === 'ADMIN' ? 'Admin Console' : 'My Dashboard'}</span>
                      </Link>
                      <Link
                        to="/verify-certificate"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#20252B] hover:bg-slate-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-slate-500" />
                        <span>Verify Certificate</span>
                      </Link>
                    </div>

                    <div className="border-t border-[#E5E7EB] pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50"
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
                  className="px-3.5 py-2 text-sm font-medium text-[#697386] hover:text-[#20252B] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#172B4D] hover:bg-[#0E1E38] rounded-lg transition-colors shadow-xs"
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
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 pt-3 pb-5 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-md text-sm font-medium text-[#20252B] hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-md text-sm font-medium text-[#20252B] hover:bg-slate-50"
          >
            Explore Courses
          </Link>
          <Link
            to="/verify-certificate"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-md text-sm font-medium text-[#20252B] hover:bg-slate-50"
          >
            Verify Credential
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-md text-sm font-medium text-[#20252B] hover:bg-slate-50"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-md text-sm font-medium text-[#20252B] hover:bg-slate-50"
          >
            Contact
          </Link>

          <div className="border-t border-[#E5E7EB] pt-3 mt-2">
            {user ? (
              <div className="space-y-1">
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium text-[#172B4D] bg-slate-50"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{user.role === 'ADMIN' ? 'Admin Console' : 'My Dashboard'}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left py-2 px-3 text-sm text-rose-600 hover:bg-rose-50 rounded-md"
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
                  className="block w-full text-center py-2 text-sm font-medium text-[#20252B] border border-[#E5E7EB] rounded-lg hover:bg-slate-50"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-sm font-medium text-white bg-[#172B4D] hover:bg-[#0E1E38] rounded-lg"
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
