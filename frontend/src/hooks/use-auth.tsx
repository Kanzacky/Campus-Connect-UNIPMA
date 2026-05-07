'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { authApi, getToken } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'pengurus' | 'anggota';
  nim?: string;
  jurusan?: string;
  angkatan?: string;
  no_hp?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentToken = getToken();
      if (!currentToken) {
        setUser(null);
        setToken(null);
        return;
      }

      const response = await authApi.me();
      if (response.success && response.data) {
        setUser(response.data.user as User);
        setToken(currentToken);
      }
    } catch {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    if (response.success && response.data) {
      const { user: userData, token: newToken } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData as User);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { User };
