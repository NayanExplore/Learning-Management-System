import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await api.get('/v1/auth/me');
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    const res = await api.post('/v1/auth/login', { email, password: pass });
    const data: AuthResponse = res.data.data;
    setUser({
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
      emailVerified: data.emailVerified,
      phoneVerified: data.phoneVerified,
    });
    return data;
  };

  const register = async (name: string, email: string, pass: string, phone?: string): Promise<AuthResponse> => {
    const res = await api.post('/v1/auth/register', {
      fullName: name,
      email,
      password: pass,
      phone: phone || undefined,
    });
    const data: AuthResponse = res.data.data;
    setUser({
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
      emailVerified: data.emailVerified,
      phoneVerified: data.phoneVerified,
    });
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/v1/auth/logout');
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
