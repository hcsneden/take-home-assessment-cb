import { FeedbackAnalysis } from '../types';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

interface OllamaResponse {
  response: string;
  done: boolean;
}

export class OllamaService {

  async analyzeFeedback(feedbackText: string): Promise<FeedbackAnalysis> {
    const prompt = this.buildPrompt(feedbackText);

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
          format: 'json'
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = (await response.json()) as OllamaResponse;
      return this.parseResponse(data.response);
    } catch (error) {
      console.error('Ollama analysis failed:', error);
      // Return default analysis if AI is unavailable
      return this.getDefaultAnalysis();
    }
  }

  //build prompt for ollama
  private buildPrompt(feedbackText: string): string {
    return `Analyze the following student course feedback and extract insights.

        Feedback: "${feedbackText}"

        Respond with a JSON object containing:
        1. "sentiment": either "positive", "neutral", or "negative"
        2. "themes": an array of 2-5 themes/topics mentioned (e.g., "pacing", "course content", "assignments")
        3. "actionableItems": an array of 1-3 specific suggestions for the instructor

        Example response format:
        {
        "sentiment": "positive",
        "themes": ["instructor clarity", "assignments", "pacing"],
        "actionableItems": ["Add more practice problems", "Slow down week 3 content"]
        }

        Respond ONLY with the JSON object, no additional text.`;
  }

  //parse response from ollama
  private parseResponse(response: string): FeedbackAnalysis {
    try {
      const parsed = JSON.parse(response);

      // Validate and sanitize the response
      const sentiment = ['positive', 'neutral', 'negative'].includes(parsed.sentiment)
        ? parsed.sentiment
        : 'unknown';

      const themes = Array.isArray(parsed.themes)
        ? parsed.themes.slice(0, 5).map(String)
        : [];

      const actionableItems = Array.isArray(parsed.actionableItems)
        ? parsed.actionableItems.slice(0, 3).map(String)
        : [];

      return {
        sentiment,
        themes,
        actionableItems,
        analyzedAt: new Date().toISOString()
      };
    } catch {
      console.error('Failed to parse Ollama response:', response);
      return this.getDefaultAnalysis();
    }
  }

  private getDefaultAnalysis(): FeedbackAnalysis {
    return {
      sentiment: 'unknown',
      themes: ['general feedback'],
      actionableItems: ['Review feedback manually'],
      analyzedAt: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const ollamaService = new OllamaService();
