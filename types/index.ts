export interface User {
  id: string;
  email: string;
  subscription?: Subscription;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: Date;
  wordLimit: number;
  usedWords: number;
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
