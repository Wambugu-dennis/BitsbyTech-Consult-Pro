// src/context/auth-provider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { SystemUser } from '@/lib/types';
import { initialSystemUsers } from '@/lib/mockData'; // For mock login

interface AuthContextType {
  currentUser: SystemUser | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>; // Simulate login with email
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'consult-vista-auth-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for an existing session on mount
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error reading auth state from localStorage", error);
      localStorage.removeItem(AUTH_STORAGE_KEY); // Clear corrupted data
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call / user lookup
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const userToLogin = initialSystemUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (userToLogin) {
      setCurrentUser(userToLogin);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToLogin));
      } catch (error) {
         console.error("Error saving auth state to localStorage", error);
      }
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing auth state from localStorage", error);
    }
    router.push('/login'); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout }}>
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
