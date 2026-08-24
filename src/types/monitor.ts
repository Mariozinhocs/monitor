export type SocialChannel = 'instagram' | 'tiktok' | 'twitter' | 'youtube' | 'news' | 'reddit';

export type SentimentType = 'positive' | 'neutral' | 'negative' | 'critical';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Mention {
  id: string;
  channel: SocialChannel;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    followersCount: number;
  };
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  transcription?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  sentiment: SentimentType;
  sentimentScore: number; // 0.0 a 1.0
  riskLevel: RiskLevel;
  topics: string[];
  reachEstimate: number;
  aiAnalysis: {
    summary: string;
    emotion: string; // 'Alegria', 'Indignação', 'Frustração', 'Elogio', 'Dúvida'
    crisisIndicator: boolean;
    suggestedAction?: string;
  };
}

export interface CrisisAlert {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  channel: SocialChannel;
  mentionCount: number;
  negativeRatio: number;
  triggeredAt: string;
  status: 'active' | 'investigating' | 'resolved';
  recommendedAction: string;
  affectedTopics: string[];
}

export interface BrandOverview {
  brandName: string;
  reputationScore: number; // 0 a 100
  totalMentions: number;
  growthRate24h: number; // %
  sentimentSplit: {
    positive: number;
    neutral: number;
    negative: number;
    critical: number;
  };
  activeCrisisCount: number;
  estimatedReach: number;
}

export interface AIExecutiveReport {
  generatedAt: string;
  period: string;
  overallSentiment: string;
  executiveSummary: string;
  topDriversPositive: string[];
  topDriversNegative: string[];
  crisisRiskEvaluation: string;
  strategicRecommendations: string[];
}
