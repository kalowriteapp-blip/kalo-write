'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { LOGIN_MUTATION, REGISTER_MUTATION, GET_USER_QUERY } from '@/lib/graphql/queries';
import { toast } from 'react-hot-toast';
import { User } from '@/types';

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
    // Only run on client side to avoid hydration mismatch
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (token && !user) {
      refetchUser();
    } else {
      setLoading(false);
    }
  }, [user, refetchUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('[AuthContext] Login called with email:', email);
    try {
      if (!loginMutation) {
        console.error('[AuthContext] Login mutation not available');
        toast.error('Login service not available');
        return false;
      }

      console.log('[AuthContext] Calling login mutation...');
      const { data } = await loginMutation({
        variables: { email, password },
      });

      console.log('[AuthContext] Login mutation response:', data);
      console.log('[AuthContext] Data type:', typeof data);
      console.log('[AuthContext] Data keys:', data ? Object.keys(data) : 'null');

      if (data && typeof data === 'object' && 'login' in data && data.login) {
        console.log('[AuthContext] Login successful, setting token and user');
        localStorage.setItem('auth_token', (data as any).login.access_token);
        setUser((data as any).login.user);
        toast.success('Login successful!');
        return true;
      }
      console.log('[AuthContext] No login data in response');
      return false;
    } catch (error: any) {
      console.error('[AuthContext] Login error:', error);
      console.error('[AuthContext] Error type:', typeof error);
      console.error('[AuthContext] Error keys:', error ? Object.keys(error) : 'null');
      console.error('[AuthContext] Error stack:', error?.stack);
      const errorMessage = error?.message || error?.graphQLErrors?.[0]?.message || 'Login failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      if (!registerMutation) {
        console.error('Register mutation not available');
        toast.error('Registration service not available');
        return false;
      }

      const { data } = await registerMutation({
        variables: { email, password, name },
      });

      if (data && typeof data === 'object' && 'register' in data && data.register) {
        localStorage.setItem('auth_token', (data as any).register.access_token);
        setUser((data as any).register.user);
        toast.success('Registration successful!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error?.message || error?.graphQLErrors?.[0]?.message || 'Registration failed';
      toast.error(errorMessage);
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