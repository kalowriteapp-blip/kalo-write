'use client';

import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/lib/apollo-client';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Temporarily disabled global error handlers
  // useEffect(() => {
  //   // Global error handler to catch any unhandled errors
  //   const handleError = (event: ErrorEvent) => {
  //     console.error('[Global Error Handler]', event.error);
  //     console.error('[Global Error Handler] Stack:', event.error?.stack);
  //     console.error('[Global Error Handler] Message:', event.message);
  //     console.error('[Global Error Handler] Filename:', event.filename);
  //     console.error('[Global Error Handler] Line:', event.lineno);
  //     console.error('[Global Error Handler] Column:', event.colno);
  //   };

  //   const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  //     console.error('[Global Unhandled Rejection]', event.reason);
  //     console.error('[Global Unhandled Rejection] Stack:', event.reason?.stack);
  //   };

  //   window.addEventListener('error', handleError);
  //   window.addEventListener('unhandledrejection', handleUnhandledRejection);

  //   return () => {
  //     window.removeEventListener('error', handleError);
  //     window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  //   };
  // }, []);

  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}
