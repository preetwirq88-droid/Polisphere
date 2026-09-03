import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, getAdminProfile, AdminProfile } from '../api/adminAuth';

interface AdminAuthContextType {
  token: string | null;
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: str) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await getAdminProfile();
          setAdmin(profile);
        } catch (err) {
          console.error("Session expired or invalid token:", err);
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email: string, password: str) => {
    const res = await adminLogin(email, password);
    localStorage.setItem('admin_token', res.access_token);
    setToken(res.access_token);
    setAdmin({ id: 'admin', email: res.admin_email, name: res.admin_name });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ token, admin, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
