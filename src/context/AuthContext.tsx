import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role, Employee } from '@/types';
import { mockEmployees } from '@/lib/mock-data';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: Role) => boolean;
  logout: () => void;
  isAdmin: boolean;
  currentEmployee: Employee | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, _password: string, role: Role): boolean => {
    // Mock auth - in production would validate against backend
    if (role === 'admin') {
      setUser({ id: 'admin1', name: 'Admin User', email, role: 'admin' });
      return true;
    }
    const emp = mockEmployees.find(e => e.email === email);
    if (emp) {
      setUser({ id: emp.id, name: emp.name, email: emp.email, role: 'employee' });
      return true;
    }
    // Allow any email for demo
    setUser({ id: 'e1', name: 'Sarah Chen', email, role: 'employee' });
    return true;
  };

  const logout = () => setUser(null);

  const isAdmin = user?.role === 'admin';
  const currentEmployee = mockEmployees.find(e => e.id === user?.id);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, currentEmployee }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
