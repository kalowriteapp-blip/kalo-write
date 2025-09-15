export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription?: Subscription;
  humanizations?: Humanization[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  wordLimit: number;
  usedWords: number;
}

export interface Humanization {
  id: string;
  userId: string;
  originalText: string;
  humanizedText: string;
  wordCount: number;
  createdAt: string;
}

export interface HumanizeTextInput {
  text: string;
}

export interface HumanizeRequest {
  text: string;
  userId?: string;
}

export interface HumanizeResponse {
  humanizedText: string;
  wordCount: number;
  success: boolean;
  error?: string;
}
