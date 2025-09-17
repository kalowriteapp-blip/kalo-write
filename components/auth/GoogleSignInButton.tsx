'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function GoogleSignInButton({ 
  onSuccess, 
  onError, 
  className = '' 
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Load Google Identity Services
      if (!window.google) {
        await loadGoogleScript();
      }

      // Initialize Google Identity Services
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('Google Client ID is not configured');
      }
      
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Trigger the Google Sign-In popup
      window.google.accounts.id.prompt();
      
    } catch (error) {
      console.error('Google Sign-In error:', error);
      onError?.(error instanceof Error ? error.message : 'Google Sign-In failed');
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (response: { credential: string }) => {
    try {
      setIsLoading(true);
      
      // Send the credential to your backend
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation GoogleAuth($code: String!) {
              googleAuth(code: $code) {
                access_token
                user {
                  id
                  email
                  name
                  avatar
                  subscription {
                    id
                    plan
                    status
                    usedWords
                    wordLimit
                  }
                }
              }
            }
          `,
          variables: {
            code: response.credential,
          },
        }),
      });

      const data = await result.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      if (data.data?.googleAuth) {
        const { access_token, user } = data.data.googleAuth;
        
        // Store the token and user data
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update auth context
        login(user, access_token);
        
        onSuccess?.();
      } else {
        throw new Error('No authentication data received');
      }
      
    } catch (error) {
      console.error('Google authentication error:', error);
      onError?.(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
      
      document.head.appendChild(script);
    });
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full ${className}`}
      variant="outline"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  );
}

// Extend the Window interface to include Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; auto_select: boolean; cancel_on_tap_outside: boolean }) => void;
          prompt: () => void;
        };
      };
    };
  }
}
