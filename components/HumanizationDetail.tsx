'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Humanization } from '@/types';
import { toast } from 'react-hot-toast';
import { Copy, Check, X, Calendar, FileText, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HumanizationDetailProps {
  humanization: Humanization | null;
  onClose: () => void;
}

export const HumanizationDetail: React.FC<HumanizationDetailProps> = ({ 
  humanization, 
  onClose 
}) => {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedHumanized, setCopiedHumanized] = useState(false);

  if (!humanization) return null;

  const handleCopy = async (text: string, type: 'original' | 'humanized') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'original') {
        setCopiedOriginal(true);
        setTimeout(() => setCopiedOriginal(false), 2000);
      } else {
        setCopiedHumanized(true);
        setTimeout(() => setCopiedHumanized(false), 2000);
      }
      toast.success('Text copied to clipboard!');
    } catch (error) {
      console.error('Error copying text:', error);
      toast.error('Failed to copy text');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Humanization Details</h2>
            <Badge variant="outline">{humanization.wordCount} words</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDistanceToNow(new Date(humanization.createdAt), { addSuffix: true })}
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Original Text</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(humanization.originalText, 'original')}
                  >
                    {copiedOriginal ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px] p-3 border rounded-md bg-gray-50">
                  <p className="whitespace-pre-wrap text-gray-900">
                    {humanization.originalText}
                  </p>
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
                    onClick={() => handleCopy(humanization.humanizedText, 'humanized')}
                  >
                    {copiedHumanized ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px] p-3 border rounded-md bg-green-50">
                  <p className="whitespace-pre-wrap text-gray-900">
                    {humanization.humanizedText}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Comparison View */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Side-by-Side Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Original</h4>
                    <div className="p-3 border rounded-md bg-gray-50 max-h-60 overflow-y-auto">
                      <p className="whitespace-pre-wrap text-sm text-gray-900">
                        {humanization.originalText}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Humanized</h4>
                    <div className="p-3 border rounded-md bg-green-50 max-h-60 overflow-y-auto">
                      <p className="whitespace-pre-wrap text-sm text-gray-900">
                        {humanization.humanizedText}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
