# Architecture Document

## Overview

The Student Feedback Analyzer is a full-stack web application that allows instructors to submit student feedback and receive AI-powered analysis including sentiment, themes, and actionable items.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Express API    │────▶│    DynamoDB     │
│  (Vite + TS)    │     │  (Node.js + TS) │     │  (LocalStack)   │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │     Ollama      │
                        │   (Local LLM)   │
                        │                 │
                        └─────────────────┘
```

## Backend

- **Singleton pattern** for database and AI service clients to avoid creating new connections on every request
- **Asynchronous AI analysis** - the API returns immediately after saving feedback, while AI processing happens in the background. This prevents timeouts (important for Lambda/API Gateway limits) and provides a better user experience since users aren't waiting 15-30 seconds for a response
- **Consistent error handling** across all routes with structured error responses
- **Graceful degradation** - returns a default analysis if Ollama is unavailable, so the app remains functional even without AI
- **Separated services** - database and AI logic are in their own files for easier navigation and maintenance

## Frontend

- **Loading states for AI analysis** - users see "Analyzing..." while AI is processing, providing clear feedback that something is happening
- **Organized service layer** - all API calls are grouped in a single `api.ts` file for readability and easier maintenance
- **Component structure** - form, list, and detail views are separate components with clear responsibilities

## Database

- **Flexible schema** - DynamoDB's schemaless design allows the `analysis` field to be added after initial creation, which works well with async AI processing
- **UUID primary key** - prevents collisions without needing auto-increment coordination
- **Timestamps** (`createdAt`, `updatedAt`) - useful for sorting feedback by date and tracking when AI analysis completed

## Trade-offs

Given the time constraint, I focused on functionality over polish:

- I would improve the UI look and feel
- No authentication - all feedback visible to everyone
- Some styles/components could be refactored into reusable pieces
- No pagination - works for now but would need it at scale

## Deploying to AWS

For production I'd use Terraform to manage the infrastructure. The setup would look something like:

- Frontend → S3 + CloudFront for hosting and CDN
- Backend → API Gateway + Lambda (or ECS if we need longer running processes)
- Database → DynamoDB (same as local, just swap the endpoint)
- AI → Bedrock with Claude instead of Ollama
- Could add SQS for the AI jobs to get retries and dead-letter queues
- CloudWatch for logs
- IAM roles scoped to least-privilege

## Improvements with More Time

- **Separate views** for submitting feedback vs. viewing the list (currently tabbed, could be distinct pages/routes)
- **Real-time updates** when AI analysis completes (WebSocket or polling) so users don't have to refresh
- **Filtering and search** - filter by course, search by keywords
- **Edit AI results** - allow instructors to modify or correct the AI-generated analysis

