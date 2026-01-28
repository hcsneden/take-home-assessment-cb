/**
 * Core type definitions for the Student Feedback Analyzer application
 */

export interface Feedback {
  id: string;
  courseName: string;
  studentName?: string; // Optional for anonymous feedback
  rating: number; // 1-5 star rating
  feedbackText: string;
  analysis?: FeedbackAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown';
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

export interface CreateFeedbackResponse {
  feedback: Feedback;
}

export interface GetFeedbackListResponse {
  feedback: Feedback[];
  total: number;
}

export interface GetFeedbackResponse {
  feedback: Feedback;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}
