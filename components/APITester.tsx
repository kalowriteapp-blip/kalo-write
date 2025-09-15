'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, CheckCircle, XCircle, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface APITest {
  name: string;
  query: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
}

interface TestResult {
  success: boolean;
  data?: unknown;
  error?: string;
  responseTime?: number;
}

export const APITester: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [customQuery, setCustomQuery] = useState('');
  const [customVariables, setCustomVariables] = useState('{}');

  const predefinedTests: APITest[] = [
    {
      name: 'Schema Introspection',
      query: `
        query {
          __schema {
            types {
              name
              kind
            }
          }
        }
      `
    },
    {
      name: 'User Registration',
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
          name: 'API Test User'
        }
      }
    },
    {
      name: 'User Login',
      query: `
        mutation Login($input: LoginInput!) {
          login(loginInput: $input) {
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
          email: 'test@example.com',
          password: 'testpassword123'
        }
      }
    },
    {
      name: 'Get Remaining Words',
      query: `
        query {
          getRemainingWords
        }
      `,
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    },
    {
      name: 'Humanize Text',
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
          text: "This is a test text that needs to be humanized using the OpenAI API."
        }
      },
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    }
  ];

  const executeTest = async (test: APITest): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...test.headers
        },
        body: JSON.stringify({
          query: test.query,
          variables: test.variables
        })
      });

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      if (response.ok && !data.errors) {
        return {
          success: true,
          data: data.data,
          responseTime
        };
      } else {
        return {
          success: false,
          error: data.errors?.[0]?.message || 'Request failed',
          responseTime
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error',
        responseTime: Date.now() - startTime
      };
    }
  };

  const runPredefinedTest = async (test: APITest) => {
    setIsLoading(true);
    const result = await executeTest(test);
    setResults(prev => [...prev, { 
      ...result, 
      data: { 
        testName: test.name, 
        ...(result.data as Record<string, unknown> || {})
      } 
    }]);
    setIsLoading(false);
    
    if (result.success) {
      toast.success(`${test.name} completed successfully`);
    } else {
      toast.error(`${test.name} failed: ${result.error}`);
    }
  };

  const runCustomQuery = async () => {
    if (!customQuery.trim()) {
      toast.error('Please enter a GraphQL query');
      return;
    }

    setIsLoading(true);
    
    let variables = {};
    try {
      variables = JSON.parse(customVariables);
    } catch {
      toast.error('Invalid JSON in variables');
      setIsLoading(false);
      return;
    }

    const test: APITest = {
      name: 'Custom Query',
      query: customQuery,
      variables: Object.keys(variables).length > 0 ? variables : undefined
    };

    const result = await executeTest(test);
    setResults(prev => [...prev, { 
      ...result, 
      data: { 
        testName: 'Custom Query', 
        ...(result.data as Record<string, unknown> || {})
      } 
    }]);
    setIsLoading(false);
    
    if (result.success) {
      toast.success('Custom query executed successfully');
    } else {
      toast.error(`Custom query failed: ${result.error}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Predefined Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Predefined API Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predefinedTests.map((test, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => runPredefinedTest(test)}
                disabled={isLoading}
                className="h-auto p-4 flex flex-col items-start gap-2"
              >
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span className="font-medium">{test.name}</span>
                </div>
                <span className="text-xs text-gray-500 text-left">
                  {test.query.split('\n')[1]?.trim() || 'GraphQL query'}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Query */}
      <Card>
        <CardHeader>
          <CardTitle>Custom GraphQL Query</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GraphQL Query
            </label>
            <Textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Enter your GraphQL query here..."
              className="min-h-[150px] font-mono text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variables (JSON)
            </label>
            <Textarea
              value={customVariables}
              onChange={(e) => setCustomVariables(e.target.value)}
              placeholder='{"key": "value"}'
              className="min-h-[100px] font-mono text-sm"
            />
          </div>
          
          <Button onClick={runCustomQuery} disabled={isLoading} className="flex items-center gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Execute Query
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium">
                        {(result.data as any)?.testName || `Test ${index + 1}`}
                      </span>
                      {result.responseTime && (
                        <Badge variant="outline">{result.responseTime}ms</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(result.data, null, 2))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {result.error && (
                    <div className="text-red-600 text-sm mb-2">{result.error}</div>
                  )}
                  
                  {result.data ? (
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.data as Record<string, unknown>, null, 2)}
                    </pre>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
