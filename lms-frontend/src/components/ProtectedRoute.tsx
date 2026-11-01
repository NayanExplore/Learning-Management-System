import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'STUDENT' | 'ADMIN';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-[#172B4D] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-[#E5E7EB] shadow-xs text-center space-y-4">
          <h2 className="text-lg font-semibold text-[#20252B]">Access Restricted</h2>
          <p className="text-xs text-[#697386]">You do not have permission to access this administration page.</p>
          <Link to="/">
            <Button variant="primary" size="sm">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
