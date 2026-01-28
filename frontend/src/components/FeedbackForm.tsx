import { useState } from 'react';
import { Feedback } from '../types';
import { createFeedback } from '../services/api';

interface FeedbackFormProps {
  onFeedbackCreated: (feedback: Feedback) => void;
}

export function FeedbackForm({ onFeedbackCreated }: FeedbackFormProps) {
  const [courseName, setCourseName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!courseName.trim()) {
      setError('Course name is required');
      return;
    }
    if (feedbackText.trim().length < 10) {
      setError('Feedback must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedback = await createFeedback({
        courseName: courseName.trim(),
        studentName: studentName.trim() || undefined,
        rating,
        feedbackText: feedbackText.trim()
      });

      onFeedbackCreated(feedback);

      // Reset form
      setCourseName('');
      setStudentName('');
      setRating(5);
      setFeedbackText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="courseName">Course Name *</label>
        <input
          id="courseName"
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="e.g., Introduction to Python"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="studentName">Student Name (optional)</label>
        <input
          id="studentName"
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Anonymous if left blank"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="rating">Rating *</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          disabled={isSubmitting}
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Good</option>
          <option value={3}>3 - Average</option>
          <option value={2}>2 - Poor</option>
          <option value={1}>1 - Very Poor</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="feedbackText">Feedback *</label>
        <textarea
          id="feedbackText"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Enter the student's feedback (minimum 10 characters)"
          rows={5}
          disabled={isSubmitting}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
