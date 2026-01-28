import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackList } from './components/FeedbackList';
import { FeedbackDetail } from './components/FeedbackDetail';
import { Feedback } from './types';
import { getAllFeedback, getFeedbackById } from './services/api';

type View = 'submit' | 'feedback';

function App() {
  const [activeView, setActiveView] = useState<View>('submit');
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all feedback on mount
  const fetchFeedback = useCallback(async () => {
    try {
      setError(null);
      const feedback = await getAllFeedback();
      setFeedbackList(feedback);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feedback');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  // Handle new feedback created
  const handleFeedbackCreated = (feedback: Feedback) => {
    setFeedbackList((prev) => [feedback, ...prev]);
    // Switch to feedback tab to show the new entry
    setActiveView('feedback');
  };

  // Handle selecting a feedback item (fetch latest to get analysis)
  const handleSelectFeedback = async (feedback: Feedback) => {
    try {
      const latestFeedback = await getFeedbackById(feedback.id);
      setSelectedFeedback(latestFeedback);
    } catch {
      // Fallback to cached data if fetch fails
      setSelectedFeedback(feedback);
    }
  };

  // Handle going back to list
  const handleBack = () => {
    setSelectedFeedback(null);
    // Refresh list to get updated analysis
    fetchFeedback();
  };

  // Show detail view if a feedback is selected
  if (selectedFeedback) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Student Feedback Analyzer</h1>
          <p>AI-powered course feedback insights</p>
        </header>
        <main className="app-main">
          <FeedbackDetail feedback={selectedFeedback} onBack={handleBack} />
        </main>
      </div>
    );
  }

  // Show tabbed view
  return (
    <div className="app">
      <header className="app-header">
        <h1>Student Feedback Analyzer</h1>
        <p>AI-powered course feedback insights</p>
      </header>

      <main className="app-main">
        {error && <div className="error-message">{error}</div>}

        <div className="tabs">
          <button
            className={`tab ${activeView === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveView('submit')}
          >
            Submit Feedback
          </button>
          <button
            className={`tab ${activeView === 'feedback' ? 'active' : ''}`}
            onClick={() => { setActiveView('feedback'); fetchFeedback(); }}
          >
            View Feedback ({feedbackList.length})
          </button>
        </div>

        <div className="tab-content">
          {activeView === 'submit' && (
            <div className="form-section">
              <h2>Submit Student Feedback</h2>
              <FeedbackForm onFeedbackCreated={handleFeedbackCreated} />
            </div>
          )}

          {activeView === 'feedback' && (
            <div className="list-section">
              <h2>Feedback List</h2>
              <FeedbackList
                feedbackList={feedbackList}
                isLoading={isLoading}
                onSelectFeedback={handleSelectFeedback}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
