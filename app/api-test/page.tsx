'use client';

import { APITester } from '@/components/APITester';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestTube, Database, Zap } from 'lucide-react';
import Link from 'next/link';

export default function APITestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <TestTube className="h-10 w-10 text-blue-600" />
            API Test Suite
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive testing for the KaloWrite backend API
          </p>
        </div>

        {/* API Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Backend Status</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">
                http://localhost:3001
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">GraphQL Endpoint</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Active</div>
              <p className="text-xs text-muted-foreground">
                /graphql
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Documentation</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">Available</div>
              <p className="text-xs text-muted-foreground">
                /api
              </p>
            </CardContent>
          </Card>
        </div>

        {/* API Tester Component */}
        <APITester />

        {/* Quick Links */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Backend Endpoints</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• <a href="http://localhost:3001/graphql" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GraphQL Playground</a></li>
                  <li>• <a href="http://localhost:3001/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">API Documentation</a></li>
                  <li>• <a href="http://localhost:3001/health" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Health Check</a></li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Frontend Pages</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• <Link href="/" className="text-blue-600 hover:underline">Main App</Link></li>
                  <li>• <Link href="/test-humanize" className="text-blue-600 hover:underline">Humanization Test</Link></li>
                  <li>• <Link href="/api-test" className="text-blue-600 hover:underline">API Test Suite</Link></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
