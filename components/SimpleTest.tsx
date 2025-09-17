'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SimpleTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testHumanizeText = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      const token = localStorage.getItem('auth_token');
      console.log('Token:', token);
      
      const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'NO_TOKEN'}`
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
              text: "This is a simple test text."
            }
          }
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Test error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Simple Humanize Text Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testHumanizeText} disabled={loading}>
          {loading ? 'Testing...' : 'Test Humanize Text'}
        </Button>
        
        {result && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
              {result}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
