'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, Check, RefreshCw, TestTube, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

  // Test data
  const testTexts = [
    "I'm sorry, but I can't help you find free/full copies of copyrighted books unless they're legally released by the author or publisher.\n\nHowever, I can help you find legal free/open-access resources that cover the same topics. Here are some good ones:",
    "The implementation of artificial intelligence in modern business operations has revolutionized the way organizations approach data analysis and decision-making processes. This technological advancement enables companies to leverage machine learning algorithms for predictive analytics.",
    "In today's fast-paced digital landscape, it is important to note that businesses must adapt to changing consumer behaviors and market dynamics. Studies have shown that companies that embrace digital transformation are more likely to succeed in the long term."
  ];

  const testBackendConnection = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const response = await fetch('http://localhost:3001/graphql', {
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

      const data = await response.json();
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
    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Register($input: RegisterInput!) {
              register(registerInput: $input) {
                access_token
                user {
                  id
                  email
                  name
                  subscription {
                    id
                    plan
                    status
                    wordLimit
                    usedWords
                  }
                }
              }
            }
          `,
          variables: {
            input: {
              email: `test-${Date.now()}@example.com`,
              password: 'testpassword123',
              name: 'Test User'
            }
          }
        })
      });

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      if (response.ok && data.data?.register) {
        return {
          success: true,
          data: data.data.register,
          responseTime
        };
      } else {
        return {
          success: false,
          error: data.errors?.[0]?.message || 'Registration failed',
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

  const testHumanization = async (text: string, token: string): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const response = await fetch('http://localhost:3001/graphql', {
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

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      if (response.ok && data.data?.humanizeText) {
        return {
          success: true,
          data: data.data.humanizeText,
          responseTime
        };
      } else {
        return {
          success: false,
          error: data.errors?.[0]?.message || 'Humanization failed',
          responseTime
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Humanization request failed',
        responseTime: Date.now() - startTime
      };
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    setHumanizationResult(null);

    const results: TestResult[] = [];

    // Test 1: Backend Connection
    toast.loading('Testing backend connection...');
    const connectionTest = await testBackendConnection();
    results.push({ 
      ...connectionTest, 
      data: { 
        test: 'Backend Connection', 
        ...(connectionTest.data as Record<string, unknown> || {})
      } 
    });
    setTestResults([...results]);

    if (!connectionTest.success) {
      toast.error('Backend connection failed');
      setIsLoading(false);
      return;
    }

    toast.success('Backend connected successfully');

    // Test 2: User Registration
    toast.loading('Testing user registration...');
    const registrationTest = await testRegistration();
    results.push({ 
      ...registrationTest, 
      data: { 
        test: 'User Registration', 
        ...(registrationTest.data as Record<string, unknown> || {})
      } 
    });
    setTestResults([...results]);

    if (!registrationTest.success) {
      toast.error('User registration failed');
      setIsLoading(false);
      return;
    }

    toast.success('User registered successfully');

    // Test 3: Humanization
    const token = (registrationTest.data as RegistrationResponse)?.access_token;
    if (!token) {
      toast.error('No access token received');
      setIsLoading(false);
      return;
    }

    toast.loading('Testing humanization...');
    const humanizationTest = await testHumanization(inputText || testTexts[0], token);
    results.push({ 
      ...humanizationTest, 
      data: { 
        test: 'Text Humanization', 
        ...(humanizationTest.data as Record<string, unknown> || {})
      } 
    });
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
        </div>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Text (optional - will use sample text if empty)
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to humanize or leave empty to use sample text..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={runAllTests} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Run All Tests
              </Button>
              
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
              <CardTitle>Test Results</CardTitle>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Original Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Original Text</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(humanizationResult.originalText)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 border rounded-md bg-gray-50 min-h-[200px]">
                  <p className="whitespace-pre-wrap text-gray-900">
                    {humanizationResult.originalText}
                  </p>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Word Count: {humanizationResult.wordCount}
                </div>
              </CardContent>
            </Card>

            {/* Humanized Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Humanized Text</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(humanizationResult.humanizedText)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 border rounded-md bg-green-50 min-h-[200px]">
                  <p className="whitespace-pre-wrap text-gray-900">
                    {humanizationResult.humanizedText}
                  </p>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Created: {new Date(humanizationResult.createdAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
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
