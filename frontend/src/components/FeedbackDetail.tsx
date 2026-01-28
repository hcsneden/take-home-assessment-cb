import { Feedback } from '../types';

interface FeedbackDetailProps {
  feedback: Feedback;
  onBack: () => void;
}

export function FeedbackDetail({ feedback, onBack }: FeedbackDetailProps) {
  return (
    <div className="feedback-detail">
      <button className="back-button" onClick={onBack}>
        &larr; Back to List
      </button>

      <div className="detail-header">
        <h2>{feedback.courseName}</h2>
        <div className="detail-meta">
          <span>Student: {feedback.studentName || 'Anonymous'}</span>
          <span>Rating: {feedback.rating}/5</span>
          <span>Date: {formatDate(feedback.createdAt)}</span>
        </div>
      </div>

      <div className="detail-section">
        <h3>Feedback</h3>
        <div className="notes-content">{feedback.feedbackText}</div>
      </div>

      <div className="detail-section">
        <h3>AI Analysis</h3>
        {feedback.analysis ? (
          <div className="analysis-section">
            <p className="analysis-timestamp">
              Analyzed at: {formatDate(feedback.analysis.analyzedAt)}
            </p>
            <div className="analysis-content">
              <div className="analysis-item">
                <h4>Sentiment</h4>
                <SentimentDisplay sentiment={feedback.analysis.sentiment} />
              </div>

              <div className="analysis-item">
                <h4>Themes</h4>
                {feedback.analysis.themes.length > 0 ? (
                  <ul>
                    {feedback.analysis.themes.map((theme, index) => (
                      <li key={index}>{theme}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty">No themes identified</p>
                )}
              </div>

              <div className="analysis-item">
                <h4>Actionable Items</h4>
                {feedback.analysis.actionableItems.length > 0 ? (
                  <ul>
                    {feedback.analysis.actionableItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty">No actionable items identified</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="loading">AI analysis in progress...</div>
        )}
      </div>
    </div>
  );
}

function SentimentDisplay({ sentiment }: { sentiment: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    positive: { bg: '#d1fae5', text: '#065f46' },
    neutral: { bg: '#f3f4f6', text: '#374151' },
    negative: { bg: '#fee2e2', text: '#991b1b' }
  };

  const style = colors[sentiment] || colors.neutral;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        backgroundColor: style.bg,
        color: style.text,
        fontWeight: 500
      }}
    >
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}
