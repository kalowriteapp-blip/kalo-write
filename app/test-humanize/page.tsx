'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, Check, RefreshCw, TestTube, AlertCircle, User, LogOut, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface TestResult {
  success: boolean;
  data?: unknown;
  error?: string;
  responseTime?: number;
}

interface HumanizationResult {
  id: string;
  originalText: string;
  humanizedText: string;
  wordCount: number;
  createdAt: string;
}

interface RegistrationResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    subscription: {
      id: string;
      plan: string;
      status: string;
      wordLimit: number;
      usedWords: number;
    };
  };
}

export default function TestHumanizePage() {
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [humanizationResult, setHumanizationResult] = useState<HumanizationResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);
  const [testEmail, setTestEmail] = useState<string>('test@example.com');
  const [testPassword, setTestPassword] = useState<string>('testpassword123');

  // Use AuthContext for authentication
  const { user, login, register, logout } = useAuth();

  // Test data
  const testTexts = [
    "I'm sorry, but I can't help you find free/full copies of copyrighted books unless they're legally released by the author or publisher.\n\nHowever, I can help you find legal free/open-access resources that cover the same topics. Here are some good ones:",
    "The implementation of artificial intelligence in modern business operations has revolutionized the way organizations approach data analysis and decision-making processes. This technological advancement enables companies to leverage machine learning algorithms for predictive analytics.",
    "In today's fast-paced digital landscape, it is important to note that businesses must adapt to changing consumer behaviors and market dynamics. Studies have shown that companies that embrace digital transformation are more likely to succeed in the long term."
  ];

  const testBackendConnection = async (): Promise<TestResult> => {
    const startTime = Date.now();
    console.log('Starting backend connection test...');
    try {
      console.log('Making request to http://localhost:3001/graphql');
      const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              __schema {
                types {
                  name
                }
              }
            }
          `
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      const responseTime = Date.now() - startTime;

      if (response.ok && !data.errors) {
        return {
          success: true,
          data: data,
          responseTime
        };
      } else {
        return {
          success: false,
          error: data.errors?.[0]?.message || 'GraphQL schema query failed',
          responseTime
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Connection failed',
        responseTime: Date.now() - startTime
      };
    }
  };

  const testRegistration = async (): Promise<TestResult> => {
    const startTime = Date.now();
    console.log('Starting registration test...');
    try {
      console.log('Making registration request...');
      const success = await register(`test-${Date.now()}@example.com`, 'testpassword123', 'Test User');
      const responseTime = Date.now() - startTime;

      if (success) {
        return {
          success: true,
          data: { message: 'Registration successful', user: user },
          responseTime
        };
      } else {
        return {
          success: false,
          error: 'Registration failed',
          responseTime
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration request failed',
        responseTime: Date.now() - startTime
      };
    }
  };

  const testLogin = async (): Promise<TestResult> => {
    const startTime = Date.now();
    console.log('Starting login test...');
    try {
      console.log('Making login request...');
      const success = await login(testEmail, testPassword);
      const responseTime = Date.now() - startTime;

      if (success) {
        return {
          success: true,
          data: { message: 'Login successful', user: user },
          responseTime
        };
      } else {
        return {
          success: false,
          error: 'Login failed',
          responseTime
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login request failed',
        responseTime: Date.now() - startTime
      };
    }
  };

  const testHumanization = async (text: string): Promise<TestResult> => {
    const startTime = Date.now();
    console.log('[TestHumanization] Starting humanization test...');
    console.log('[TestHumanization] Text length:', text.length);
    console.log('[TestHumanization] User:', user);
    
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated',
        responseTime: Date.now() - startTime
      };
    }

    const token = localStorage.getItem('auth_token');
    console.log('[TestHumanization] Token:', token ? 'Present' : 'Missing');
    
    try {
      console.log('[TestHumanization] Making request to GraphQL...');
      const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation HumanizeText($input: HumanizeTextInput!) {
              humanizeText(input: $input) {
                id
                originalText
                humanizedText
                wordCount
                createdAt
              }
            }
          `,
          variables: {
            input: {
              text: text
            }
          }
        })
      });

      console.log('[TestHumanization] Response status:', response.status);
      console.log('[TestHumanization] Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      console.log('[TestHumanization] Response data:', data);
      console.log('[TestHumanization] Data type:', typeof data);
      console.log('[TestHumanization] Data keys:', data ? Object.keys(data) : 'null');

      if (response.ok && data.data?.humanizeText) {
        console.log('[TestHumanization] Humanization successful');
        return {
          success: true,
          data: data.data.humanizeText,
          responseTime
        };
      } else {
        const errorMessage = data.errors?.[0]?.message || 'Humanization failed';
        console.error('[TestHumanization] Humanization failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          errorMessage
        });
        return {
          success: false,
          error: errorMessage,
          responseTime
        };
      }
    } catch (error) {
      console.error('[TestHumanization] Error caught:', error);
      console.error('[TestHumanization] Error type:', typeof error);
      console.error('[TestHumanization] Error keys:', error ? Object.keys(error as any) : 'null');
      console.error('[TestHumanization] Error stack:', (error as any)?.stack);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Humanization request failed',
        responseTime: Date.now() - startTime
      };
    }
  };

  const runAllTests = async () => {
    console.log('=== RUN ALL TESTS CLICKED ===');
    setIsLoading(true);
    setTestResults([]);
    setHumanizationResult(null);

    const results: TestResult[] = [];

    // Test 1: Backend Connection
    toast.loading('Testing backend connection...');
    const connectionTest = await testBackendConnection();
    console.log('Connection test result:', connectionTest);
    results.push({ 
      ...connectionTest, 
      data: { 
        test: 'Backend Connection', 
        ...(connectionTest.data as Record<string, unknown> || {})
      } 
    });
    console.log('Results after connection test:', results);
    setTestResults([...results]);

    if (!connectionTest.success) {
      toast.error('Backend connection failed');
      setIsLoading(false);
      return;
    }

    toast.success('Backend connected successfully');

    // Test 2: User Registration
    toast.loading('Testing user registration...');
    console.log('Starting registration test...');
    const registrationTest = await testRegistration();
    console.log('Registration test result:', registrationTest);
    results.push({ 
      ...registrationTest, 
      data: { 
        test: 'User Registration', 
        ...(registrationTest.data as Record<string, unknown> || {})
      } 
    });
    setTestResults([...results]);

    if (!registrationTest.success) {
      console.log('Registration failed, trying login instead...');
      toast.loading('Trying login with existing credentials...');
      const loginTest = await testLogin();
      console.log('Login test result:', loginTest);
      results.push({ 
        ...loginTest, 
        data: { 
          test: 'User Login', 
          ...(loginTest.data as Record<string, unknown> || {})
        } 
      });
      setTestResults([...results]);

      if (!loginTest.success) {
        toast.error('Both registration and login failed');
        setIsLoading(false);
        return;
      }
    }

    toast.success('Authentication successful');

    // Test 3: Humanization
    toast.loading('Testing humanization...');
    const humanizationTest = await testHumanization(inputText || testTexts[0]);
    console.log('Humanization test result:', humanizationTest);
    results.push({ 
      ...humanizationTest, 
      data: { 
        test: 'Text Humanization', 
        ...(humanizationTest.data as Record<string, unknown> || {})
      } 
    });
    console.log('Final results:', results);
    setTestResults([...results]);

    if (humanizationTest.success) {
      setHumanizationResult(humanizationTest.data as HumanizationResult);
      toast.success('Humanization test completed successfully!');
    } else {
      toast.error('Humanization test failed');
    }

    setIsLoading(false);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Text copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy text');
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
    ) : (
      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
        <AlertCircle className="w-4 h-4 text-red-500" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <TestTube className="h-10 w-10 text-blue-600" />
            Humanization API Test Suite
          </h1>
          <p className="text-xl text-gray-600">
            Test the backend humanization API functionality
          </p>
          
          {/* Authentication Status */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Not authenticated</p>
                      <p className="text-sm text-gray-500">Login required for testing</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex gap-2">
                {user ? (
                  <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setShowAuth('login')}>
                      Login
                    </Button>
                    <Button onClick={() => setShowAuth('register')}>
                      Register
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-blue-600" />
              Text Humanization Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter text to humanize
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your AI-generated text here to see how it gets humanized..."
                className="min-h-[120px] text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to use sample text, or enter your own text to test the humanization.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={runAllTests} 
                disabled={isLoading || !user} 
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Run All Tests
              </Button>
              
              {!user && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowAuth('login')}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Login to Test
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => setInputText(testTexts[0])}
                disabled={isLoading}
              >
                Load Sample Text 1
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setInputText(testTexts[1])}
                disabled={isLoading}
              >
                Load Sample Text 2
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setInputText(testTexts[2])}
                disabled={isLoading}
              >
                Load Sample Text 3
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Results ({testResults.length} tests)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.success)}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {(result.data as any)?.test || `Test ${index + 1}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {result.success ? 'Success' : 'Failed'}
                          {result.responseTime && ` • ${result.responseTime}ms`}
                        </p>
                      </div>
                    </div>
                    {result.error && (
                      <Badge variant="destructive">{result.error}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Humanization Result */}
        {humanizationResult && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-green-800">Humanization Complete!</h3>
              </div>
              <p className="text-green-700 mt-1">Your text has been successfully humanized using AI.</p>
            </div>

            {/* Text Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Text */}
              <Card className="border-gray-200">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center justify-between text-gray-700">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      Original Text
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(humanizationResult.originalText)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Textarea
                    value={humanizationResult.originalText}
                    readOnly
                    className="min-h-[300px] border-0 resize-none focus:ring-0 text-gray-700 bg-gray-50"
                  />
                  <div className="px-4 py-2 bg-gray-100 text-sm text-gray-500 border-t">
                    {humanizationResult.wordCount} words
                  </div>
                </CardContent>
              </Card>

              {/* Humanized Text */}
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center justify-between text-green-700">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Humanized Text
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(humanizationResult.humanizedText)}
                      className="text-green-600 hover:text-green-800 border-green-300"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Textarea
                    value={humanizationResult.humanizedText}
                    readOnly
                    className="min-h-[300px] border-0 resize-none focus:ring-0 text-gray-700 bg-green-50"
                  />
                  <div className="px-4 py-2 bg-green-100 text-sm text-green-600 border-t">
                    ✨ AI Humanized • {new Date(humanizationResult.createdAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => handleCopy(humanizationResult.humanizedText)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Humanized Text
              </Button>
              <Button
                variant="outline"
                onClick={() => setHumanizationResult(null)}
                className="px-6 py-2"
              >
                Clear Results
              </Button>
            </div>
          </div>
        )}

        {/* Authentication Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {showAuth === 'login' ? 'Sign In' : 'Sign Up'}
                  </h2>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAuth(null)}
                    className="p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {showAuth === 'login' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="test@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={testPassword}
                        onChange={(e) => setTestPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="testpassword123"
                      />
                    </div>
                    <Button 
                      onClick={async () => {
                        const success = await login(testEmail, testPassword);
                        if (success) {
                          setShowAuth(null);
                        }
                      }}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAuth('register')}
                      className="w-full"
                    >
                      Switch to Register
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="test@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={testPassword}
                        onChange={(e) => setTestPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="testpassword123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value="Test User"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Test User"
                        readOnly
                      />
                    </div>
                    <Button 
                      onClick={async () => {
                        const success = await register(testEmail, testPassword, 'Test User');
                        if (success) {
                          setShowAuth(null);
                        }
                      }}
                      className="w-full"
                    >
                      Sign Up
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAuth('login')}
                      className="w-full"
                    >
                      Switch to Login
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* API Endpoints Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>GraphQL Endpoint:</strong> http://localhost:3001/graphql</div>
              <div><strong>GraphQL Playground:</strong> http://localhost:3001/graphql</div>
              <div><strong>API Documentation:</strong> http://localhost:3001/api</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
