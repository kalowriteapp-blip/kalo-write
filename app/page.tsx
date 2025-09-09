'use client';

import { SetStateAction, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { humanizeText } from '@/lib/gemini';

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [humanizedText, setHumanizedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleHumanize = async (): Promise<void> => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to humanize');
      return;
    }

    setIsLoading(true);
    try {
      const result = await humanizeText(inputText);
      setHumanizedText(result);
      toast.success('Text humanized successfully!');
    } catch (error) {
      console.error('Error humanizing text:', error);
      toast.error('Failed to humanize text. Please try again.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">KaloWrite</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
          </div>
        </div>
      </header>

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
                    ({inputText.length} characters)
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
                <Button
                  onClick={handleHumanize}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Humanizing...
                    </>
                  ) : (
                    'Humanize Text'
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose KaloWrite?</h3>
            <p className="text-xl text-gray-600">Advanced AI technology for natural text generation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">AI-Powered</h4>
              <p className="text-gray-600">Uses advanced Gemini AI to create natural, human-like text</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Lightning Fast</h4>
              <p className="text-gray-600">Get results in seconds with our optimized processing</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
              <p className="text-gray-600">Your content is processed securely and never stored</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h3>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="text-3xl font-bold">$0</div>
                <p className="text-gray-600">Perfect for trying out</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✓ 1,000 words/month</li>
                  <li>✓ Basic humanization</li>
                  <li>✓ Email support</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card className="text-center border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Most Popular</span>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">$19<span className="text-lg">/month</span></div>
                <p className="text-gray-600">For professionals</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✓ 50,000 words/month</li>
                  <li>✓ Advanced humanization</li>
                  <li>✓ Priority support</li>
                  <li>✓ API access</li>
                </ul>
                <Button className="w-full mt-6">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold">$99<span className="text-lg">/month</span></div>
                <p className="text-gray-600">For teams</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✓ Unlimited words</li>
                  <li>✓ Custom models</li>
                  <li>✓ Dedicated support</li>
                  <li>✓ Team management</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h3>
            <p className="text-xl text-gray-600">Have questions? We&apos;d love to hear from you</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message"
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">KaloWrite</h4>
            <p className="text-gray-400 mb-6">AI Text Humanizer for the modern web</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact</a>
            </div>
            <p className="text-gray-500 mt-6">&copy; 2024 KaloWrite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}