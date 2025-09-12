'use client';

import { SetStateAction, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy, Check, User, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery } from '@apollo/client/react';
import { useAuth } from '@/contexts/AuthContext';
import { HUMANIZE_TEXT_MUTATION, GET_REMAINING_WORDS_QUERY } from '@/lib/graphql/queries';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

interface HumanizeTextResponse {
  humanizeText: {
    id: string;
    originalText: string;
    humanizedText: string;
    wordCount: number;
    createdAt: string;
  };
}

interface RemainingWordsResponse {
  getRemainingWords: number;
}

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [humanizedText, setHumanizedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);

  const { user, logout } = useAuth();

  const [humanizeTextMutation] = useMutation<HumanizeTextResponse>(HUMANIZE_TEXT_MUTATION);
  const { data: remainingWordsData, refetch: refetchRemainingWords } = useQuery<RemainingWordsResponse>(GET_REMAINING_WORDS_QUERY, {
    skip: !user,
  });

  const handleHumanize = async (): Promise<void> => {
    if (!user) {
      setShowAuth('login');
      return;
    }

    if (!inputText.trim()) {
      toast.error('Please enter some text to humanize');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await humanizeTextMutation({
        variables: { originalText: inputText },
      });

      if (data?.humanizeText) {
        setHumanizedText(data.humanizeText.humanizedText);
        toast.success('Text humanized successfully!');
        refetchRemainingWords(); // Refresh remaining words
      }
    } catch (error: unknown) {
      console.error('Error humanizing text:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to humanize text. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(humanizedText);
      setCopied(true);
      toast.success('Text copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying text:', error);
      toast.error('Failed to copy text');
    }
  };

  const remainingWords = remainingWordsData?.getRemainingWords || 0;
  const wordCount = inputText.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">KaloWrite</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                    </div>
                    <div className="text-xs">
                      {remainingWords} words remaining
                    </div>
                  </div>
                  <Button variant="outline" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowAuth('login')}>
                    Sign In
                  </Button>
                  <Button onClick={() => setShowAuth('register')}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              {showAuth === 'login' ? (
                <LoginForm 
                  onSuccess={() => setShowAuth(null)}
                  onSwitchToRegister={() => setShowAuth('register')}
                />
              ) : (
                <RegisterForm 
                  onSuccess={() => setShowAuth(null)}
                  onSwitchToLogin={() => setShowAuth('login')}
                />
              )}
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setShowAuth(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI Text Humanizer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform AI-generated content into natural, human-like text that passes all detection tools
            </p>
          </div>

          {/* Main Text Humanization Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Original Text</span>
                  <span className="text-sm font-normal text-gray-500">
                    ({wordCount} words)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputText}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setInputText(e.target.value)}
                  placeholder="Paste your AI-generated text here..."
                  className="min-h-[300px] resize-none"
                />
                {user && wordCount > remainingWords && (
                  <p className="text-red-500 text-sm mt-2">
                    Not enough words remaining. You need {wordCount} but have {remainingWords}.
                  </p>
                )}
                <Button
                  onClick={handleHumanize}
                  disabled={isLoading || !inputText.trim() || (user ? wordCount > remainingWords : false)}
                  className="w-full mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Humanizing...
                    </>
                  ) : (
                    user ? 'Humanize Text' : 'Sign In to Humanize'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Humanized Text</span>
                  {humanizedText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] p-3 border rounded-md bg-gray-50">
                  {humanizedText ? (
                    <p className="whitespace-pre-wrap text-gray-900">{humanizedText}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      Your humanized text will appear here...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rest of your existing sections... */}
    </div>
  );
}