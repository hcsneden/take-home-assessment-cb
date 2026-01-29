import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FeedbackDetail } from '../src/components/FeedbackDetail';
import { Feedback } from '../src/types';

const mockFeedbackWithAnalysis: Feedback = {
  id: 'test-id-123',
  courseName: 'Introduction to Python',
  studentName: 'John Doe',
  rating: 4,
  feedbackText: 'Great course with helpful examples!',
  createdAt: '2024-01-15T10:00:00.000Z',
  updatedAt: '2024-01-15T10:05:00.000Z',
  analysis: {
    sentiment: 'positive',
    themes: ['course content', 'examples'],
    actionableItems: ['Add more practice problems'],
    analyzedAt: '2024-01-15T10:05:00.000Z'
  }
};

const mockFeedbackWithoutAnalysis: Feedback = {
  id: 'test-id-456',
  courseName: 'Data Structures',
  rating: 3,
  feedbackText: 'Decent course but could use more examples.',
  createdAt: '2024-01-15T10:00:00.000Z',
  updatedAt: '2024-01-15T10:00:00.000Z'
};

describe('FeedbackDetail', () => {
  it('should display the course name', () => {
    render(<FeedbackDetail feedback={mockFeedbackWithAnalysis} onBack={vi.fn()} />);
    expect(screen.getByText('Introduction to Python')).toBeInTheDocument();
  });

  it('should display sentiment from AI analysis', () => {
    render(<FeedbackDetail feedback={mockFeedbackWithAnalysis} onBack={vi.fn()} />);
    expect(screen.getByText('Positive')).toBeInTheDocument();
  });

  it('should show loading state when analysis is not available', () => {
    render(<FeedbackDetail feedback={mockFeedbackWithoutAnalysis} onBack={vi.fn()} />);
    expect(screen.getByText('AI analysis in progress...')).toBeInTheDocument();
  });

  it('should call onBack when back button is clicked', async () => {
    const mockOnBack = vi.fn();
    render(<FeedbackDetail feedback={mockFeedbackWithAnalysis} onBack={mockOnBack} />);

    await userEvent.click(screen.getByText('← Back to List'));

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
