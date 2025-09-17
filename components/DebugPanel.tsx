'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export const DebugPanel: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Don't render on server side
  }
  const [logs, setLogs] = useState<string[]>([]);
  const { login, user, loading } = useAuth();

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    // Override console.log to capture logs
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      originalLog(...args);
      addLog(`LOG: ${args.join(' ')}`);
    };
    
    console.error = (...args) => {
      originalError(...args);
      addLog(`ERROR: ${args.join(' ')}`);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const testLogin = async () => {
    addLog('Testing login with test credentials...');
    try {
      const result = await login('test@example.com', 'password');
      addLog(`Login result: ${result}`);
    } catch (error) {
      addLog(`Login error: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testLogin} variant="outline">
            Test Login
          </Button>
          <Button onClick={clearLogs} variant="outline">
            Clear Logs
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Current State:</h3>
          <p>User: {user ? 'Logged in' : 'Not logged in'}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Console Logs:</h3>
          <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
