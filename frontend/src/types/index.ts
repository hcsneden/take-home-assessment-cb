export interface Feedback {
  id: string;
  courseName: string;
  studentName?: string;
  rating: number;
  feedbackText: string;
  analysis?: FeedbackAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  themes: string[];
  actionableItems: string[];
  analyzedAt: string;
}

export interface CreateFeedbackRequest {
  courseName: string;
  studentName?: string;
  rating: number;
  feedbackText: string;
}
