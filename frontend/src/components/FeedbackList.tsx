import { Feedback } from '../types';

interface FeedbackListProps {
  feedbackList: Feedback[];
  isLoading: boolean;
  onSelectFeedback: (feedback: Feedback) => void;
}

export function FeedbackList({ feedbackList, isLoading, onSelectFeedback }: FeedbackListProps) {
  if (isLoading) {
    return <div className="loading">Loading feedback...</div>;
  }

  if (feedbackList.length === 0) {
    return <div className="empty-state">No feedback submitted yet.</div>;
  }

  return (
    <div className="feedback-list">
      {feedbackList.map((feedback) => (
        <div
          key={feedback.id}
          className="feedback-card"
          onClick={() => onSelectFeedback(feedback)}
        >
          <h3>{feedback.courseName}</h3>
          <div className="feedback-meta">
            <span>{feedback.rating}/5</span>
            <SentimentBadge sentiment={feedback.analysis?.sentiment} />
            <span>{formatDate(feedback.createdAt)}</span>
          </div>
          <div className="feedback-preview">
            <p>{truncateText(feedback.feedbackText, 100)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SentimentBadge({ sentiment }: { sentiment?: string }) {
  if (!sentiment) {
    return <span className="sentiment-badge analyzing">Analyzing...</span>;
  }

  const colors: Record<string, string> = {
    positive: '#10b981',
    neutral: '#6b7280',
    negative: '#ef4444'
  };

  return (
    <span
      className="sentiment-badge"
      style={{ color: colors[sentiment] || colors.neutral }}
    >
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
