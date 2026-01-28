# AI-Powered Student Feedback Analyzer

**Estimated Time**: Please don't spend more than 3 hours

---

## What You'll Build

A full-stack web application where:
- Instructors submit student course feedback (text + rating)
- AI automatically analyzes the feedback to extract sentiment, themes, and actionable items
- Instructors can view all feedback with AI-generated insights

**Tech Stack**: Node.js + TypeScript, React, DynamoDB or PostgreSQL, Ollama (local LLM)

---

## Problem Statement

An online learning platform collects student feedback about courses. Instructors receive text reviews like:
- "Great course! But the pacing in week 3 was too fast."
- "Loved the examples, but need more practice problems."

Currently, instructors read through dozens of reviews manually. They want an AI tool to analyze feedback and extract insights automatically.

Your task: Build a simple MVP (Minimum Viable product) that demonstrates AI-powered feedback analysis.

## How It Works (User Flow)

1. **Instructor enters student feedback** - An instructor receives feedback from students (via email, survey, etc.) and manually types it into the application
2. **AI analyzes the feedback** - The system uses AI to extract sentiment, themes, and actionable items
3. **Instructor views analyzed feedback** - The instructor can see all feedback entries with AI analysis

**Note**: In a real product, students would submit feedback directly through a form. For this MVP, we're simplifying by having instructors manually enter the feedback they received.

## Business Requirements

Build a simple web application with these features:

### Core Features (Required)

1. **Submit Feedback Form**
   - Course name (text input)
   - Student name (text input, optional - can be "Anonymous")
   - Rating (1-5 stars or number input)
   - Feedback text (textarea, minimum 10 characters)
   - Submit button that sends data to backend

2. **AI Analysis** (automatic when feedback is submitted)
   - Extract sentiment: positive, neutral, or negative
   - Extract 2-5 themes/topics mentioned (e.g., "pacing", "course content", "assignments")
   - Extract 1-3 actionable items for the instructor (e.g., "Add more practice problems")

3. **View Feedback List**
   - Display all submitted feedback entries
   - Show: course name, rating, sentiment, date submitted
   - Click on an entry to view full details

4. **View Feedback Detail**
   - Show complete feedback information
   - Display AI analysis results (sentiment, themes, actionable items)
   - Back button to return to list

## Example Scenario

**Instructor enters feedback they received:**
- Course: "Introduction to Python"
- Student: "John Smith" (or "Anonymous")
- Rating: 4/5
- Feedback: "Great course overall! The instructor explains concepts clearly and the assignments help reinforce learning. However, the pacing in week 3 felt rushed, and I struggled to keep up with the material. More practice problems would be helpful."

**AI automatically analyzes and extracts:**
- **Sentiment**: Positive
- **Themes**: ["instructor clarity", "assignments", "pacing", "practice problems"]
- **Actionable Items**: ["Slow down pacing in week 3", "Add more practice problems"]

**Result**: The instructor can quickly see this feedback in a list, click to view details, and see the AI-extracted insights without having to manually read and categorize everything.

### List View vs Detail View

**List View** shows summary information for all feedback entries:
```
Introduction to Python | 4/5 | Positive | Jan 6, 2026
Introduction to React  | 5/5 | Positive | Jan 5, 2026
Data Structures        | 2/5 | Negative | Jan 4, 2026
```

**Detail View** shows complete information when an entry is clicked:
```
Course: Introduction to Python
Student: John Smith
Rating: 4/5
Date: January 6, 2026

Feedback:
"Great course overall! The instructor explains concepts clearly and the
assignments help reinforce learning. However, the pacing in week 3 felt
rushed, and I struggled to keep up with the material. More practice
problems would be helpful."

AI Analysis:
Sentiment: Positive
Themes: instructor clarity, assignments, pacing, practice problems
Actionable Items:
  • Slow down pacing in week 3
  • Add more practice problems
```

## Technical Requirements

Your solution must include:

### Backend (Node.js/TypeScript)
- **RESTful API** with at least these endpoints:
  - `POST /api/feedback` - Submit new student feedback and trigger AI analysis
  - `GET /api/feedback` - List all feedback entries (optionally support filtering by course)
  - `GET /api/feedback/:id` - Get a specific feedback entry with its AI analysis
- **TypeScript** - Use proper type definitions throughout

### Database
Choose **ONE** of the following:
- **DynamoDB** (using LocalStack for local development), OR
- **PostgreSQL** (using Docker)

**Required schema:**
- Store feedback: course name, student name, rating, feedback text, timestamps
- Store AI analysis: sentiment, themes (array), actionable items (array)

### Frontend (React + TypeScript)
- **Form component** - Submit new feedback with validation
- **List component** - Display all feedback (course, rating, sentiment badge, date)
- **Detail component** - Show full feedback + AI analysis
- **Loading states** - Show loading indicator when appropriate
- **Error handling** - Display user-friendly error messages
- **Basic styling** - Functional UI (CSS is provided, customize as needed)

### GenAI Integration (Ollama)
- You are free to use other AI providers like Claude, OpenAI, etc. but please update the 
  code accordingly
- Use **Ollama** to analyze feedback text (it's included in Docker setup - free and local)
- **No API keys needed** - runs on your machine
- Call Ollama API to extract:
  - Sentiment (positive/neutral/negative)
  - Themes (array of topics)
  - Actionable items (array of suggestions)
- Handle errors if Ollama is unavailable
- Handle timeouts (AI analysis takes 15-30 seconds)

### Testing
- Write **at least 3-4 tests** demonstrating your testing approach:
- Tests should run with `npm test`
- **Focus on quality over quantity** - we want to see your approach, not 100% coverage

## Getting Started

The boilerplate includes:
- ✅ Project structure (backend, frontend, database scripts)
- ✅ TypeScript types and interfaces
- ✅ Docker setup (LocalStack, PostgreSQL, Ollama)
- ✅ Basic CSS styling
- ✅ Reference database implementations (DynamoDB and PostgreSQL)

**Setup**: See [SETUP.md](./SETUP.md) for detailed setup instructions. Quick start:
```bash
npm install
cp .env.example .env
docker-compose up -d
docker exec take-home-assessment-ollama ollama pull llama3.2
npm run db:setup  # or npm run db:migrate for PostgreSQL
npm run dev
```

---

## What You Should Deliver

### 1. Working Code
- Complete, functional source code
- Runs with: `npm install && npm run dev`
- Builds with: `npm run build`
- All 4 core features work end-to-end

### 2. Architecture Document
Create a file `ARCHITECTURE.md` that explains:
- Your architecture decisions and rationale
- Database schema design
- Trade-offs made due to time constraints
- How you would deploy to production (AWS or similar)
- What you'd improve with more time

### 3. API Documentation
Document your API endpoints. Include:
- Request/response formats with examples
- Validation rules
- Error responses

Format: Inline code comments, `API.md` file, or OpenAPI spec (your choice)

### 4. Setup Instructions
Update this README or SETUP.md with:
- Any changes to the setup process
- How to run tests
- Special notes or environment requirements

## Important Guidelines

### Use of AI Tools
You are welcome to use AI tools (like ChatGPT, Claude, Copilot, etc.) to assist with your implementation. However:
- **You must be able to explain the reasoning and code flow** for any code you submit
- Be prepared to walk through your implementation decisions during review
- The code should reflect your understanding, not just copy-pasted AI output

### Additional Dependencies
You are free to install additional libraries or packages beyond what's provided. However:
- **Be ready to explain why you chose each dependency** and what problem it solves
- Consider the trade-offs (bundle size, maintenance, learning curve)
- Document any new dependencies in your architecture document

## Scope Boundaries

**To keep this achievable in 3 hours:**

### ✅ DO Focus On:
- Getting all 4 core features working end-to-end (form → AI → list → detail)
- Clean, readable code with proper error handling and validation
- Making pragmatic trade-offs (document what you'd improve)
- Simple, functional UI (you don't need fancy CSS)
- Demonstrating your testing approach

### ❌ DON'T Spend Time On:
- Building authentication/authorization systems
- Deploying to actual AWS (just describe how you would in your doc)
- Complex UI animations or pixel-perfect design

**Key Point**: We value a simple, working implementation with clean code over a complex solution with missing pieces.

## Bonus Points (Optional - Only If You Have Time)

If you finish the core features early, feel free to implement some bonus features here:

- **Filter by course**: Add a dropdown to filter the feedback list by course name
- **Search**: Add keyword search for feedback text
- **Caching**: Cache AI responses to avoid re-analyzing identical feedback

## Submission

Please submit:
1. A zip file or GitHub repository with your code
2. Architecture document (as described above)
3. API documentation
4. Setup instructions

## Questions?

If you have questions about requirements, make reasonable assumptions and document them in your architecture document. This is part of the evaluation - we want to see how you handle ambiguity.

Good luck! We're excited to see your solution.
