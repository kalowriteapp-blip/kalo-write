'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestTube, Zap, Home, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const TestNavigation: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Test & Development Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/">
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
              <Home className="h-6 w-6" />
              <span className="font-medium">Main App</span>
              <span className="text-xs text-gray-500">Production interface</span>
            </Button>
          </Link>
          
          <Link href="/test-humanize">
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
              <Zap className="h-6 w-6" />
              <span className="font-medium">Humanization Test</span>
              <span className="text-xs text-gray-500">Test humanization API</span>
            </Button>
          </Link>
          
          <Link href="/api-test">
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
              <TestTube className="h-6 w-6" />
              <span className="font-medium">API Test Suite</span>
              <span className="text-xs text-gray-500">Comprehensive API testing</span>
            </Button>
          </Link>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2 justify-center">
            <a 
              href="http://localhost:3001/graphql" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              GraphQL Playground <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-gray-300">•</span>
            <a 
              href="http://localhost:3001/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              API Docs <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-gray-300">•</span>
            <a 
              href="http://localhost:3001/health" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              Health Check <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
