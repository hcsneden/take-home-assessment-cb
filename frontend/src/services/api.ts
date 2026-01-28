import { Feedback, CreateFeedbackRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function createFeedback(request: CreateFeedbackRequest): Promise<Feedback> {
  const response = await fetch(`${API_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to submit feedback');
  }

  const { feedback } = await response.json();
  return feedback;
}

export async function getAllFeedback(): Promise<Feedback[]> {
  const response = await fetch(`${API_URL}/api/feedback`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch feedback');
  }

  const data = await response.json();
  return data.feedback;
}

export async function getFeedbackById(id: string): Promise<Feedback> {
  const response = await fetch(`${API_URL}/api/feedback/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch feedback details');
  }

  const data = await response.json();
  return data.feedback;
}
