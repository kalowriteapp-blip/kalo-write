'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GET_USER_HUMANIZATIONS_QUERY, 
  DELETE_HUMANIZATION_MUTATION 
} from '@/lib/graphql/queries';
import { Humanization } from '@/types';
import { toast } from 'react-hot-toast';
import { Trash2, Copy, Check, Calendar, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HumanizationHistoryProps {
  onSelectHumanization: (humanization: Humanization) => void;
}

export const HumanizationHistory: React.FC<HumanizationHistoryProps> = ({ 
  onSelectHumanization 
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, loading, error, refetch } = useQuery<{
    getUserHumanizations: Humanization[];
  }>(GET_USER_HUMANIZATIONS_QUERY, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteHumanization] = useMutation(DELETE_HUMANIZATION_MUTATION, {
    onCompleted: () => {
      toast.success('Humanization deleted successfully');
      refetch();
    },
    onError: (error) => {
      toast.error('Failed to delete humanization');
      console.error('Delete error:', error);
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this humanization?')) {
      try {
        await deleteHumanization({ variables: { id } });
      } catch (error) {
        console.error('Error deleting humanization:', error);
      }
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Text copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error copying text:', error);
      toast.error('Failed to copy text');
    }
  };

  const handleLoadMore = () => {
    setOffset(prev => prev + limit);
  };

  if (loading && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Humanization History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Humanization History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load history</p>
            <Button onClick={() => refetch()} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const humanizations = data?.getUserHumanizations || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Humanization History
          <Badge variant="secondary">{humanizations.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {humanizations.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No humanizations yet</p>
            <p className="text-sm text-gray-400">Your humanized texts will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {humanizations.map((humanization) => (
              <div
                key={humanization.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(humanization.createdAt), { addSuffix: true })}
                    </span>
                    <Badge variant="outline">{humanization.wordCount} words</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(humanization.humanizedText, humanization.id)}
                    >
                      {copiedId === humanization.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(humanization.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Original:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {humanization.originalText}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Humanized:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {humanization.humanizedText}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => onSelectHumanization(humanization)}
                >
                  View Details
                </Button>
              </div>
            ))}
            
            {humanizations.length >= limit && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
