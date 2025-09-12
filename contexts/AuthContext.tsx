'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { LOGIN_MUTATION, REGISTER_MUTATION, GET_USER_QUERY } from '@/lib/graphql/queries';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription?: {
    id: string;
    plan: string;
    status: string;
    usedWords: number;
    wordLimit: number;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
  };
  humanizations: Array<{
    id: string;
    originalText: string;
    humanizedText: string;
    wordCount: number;
    createdAt: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  
  const { data: userData, refetch: refetchUser, error: userError } = useQuery<{ me: User }>(GET_USER_QUERY, {
    skip: !user,
  });

  // Handle user data when it changes
  useEffect(() => {
    if (userData?.me) {
      console.log('data', userData);
      setUser(userData.me);
    }
  }, [userData]);

  // Handle user query errors
  useEffect(() => {
    if (userError) {
      console.error('User query error:', userError);
      // Token might be invalid, clear it
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  }, [userError]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !user) {
      refetchUser();
    } else {
      setLoading(false);
    }
  }, [user, refetchUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if ((data as any)?.login) {
        localStorage.setItem('auth_token', (data as any).login.access_token);
        setUser((data as any).login.user);
        toast.success('Login successful!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data } = await registerMutation({
        variables: { email, password, name },
      });

      if ((data as any)?.register) {
        localStorage.setItem('auth_token', (data as any).register.access_token);
        setUser((data as any).register.user);
        toast.success('Registration successful!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};