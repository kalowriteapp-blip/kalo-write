'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getGraphQLUrl } from '@/lib/config';

export const EnvironmentDebug: React.FC = () => {
  const [envInfo, setEnvInfo] = useState<any>(null);

  useEffect(() => {
    setEnvInfo({
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_REGION: process.env.VERCEL_REGION,
      currentGraphQLUrl: getGraphQLUrl(),
    });
  }, []);

  if (!envInfo) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-sm">Environment Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="font-medium">NODE_ENV:</span>
            <Badge variant={envInfo.NODE_ENV === 'production' ? 'default' : 'secondary'}>
              {envInfo.NODE_ENV || 'undefined'}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">VERCEL_ENV:</span>
            <Badge variant="outline">
              {envInfo.VERCEL_ENV || 'undefined'}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">NEXT_PUBLIC_GRAPHQL_URL:</span>
            <span className="text-blue-600 break-all">
              {envInfo.NEXT_PUBLIC_GRAPHQL_URL || 'NOT SET'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">NEXT_PUBLIC_API_URL:</span>
            <span className="text-blue-600 break-all">
              {envInfo.NEXT_PUBLIC_API_URL || 'NOT SET'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Current GraphQL URL:</span>
            <span className="text-green-600 break-all font-mono">
              {envInfo.currentGraphQLUrl}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">VERCEL_URL:</span>
            <span className="text-purple-600 break-all">
              {envInfo.VERCEL_URL || 'undefined'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
