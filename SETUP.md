# Setup Instructions

This guide will help you set up and run the Student Feedback Analyzer application locally.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** v18 or later
- **npm** v9 or later
- **Docker** and **Docker Compose**
- **Git**

Verify your installations:
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
docker --version
docker-compose --version
```

---

## Quick Start

**Want to get running fast? Follow these steps:**

### Option A: Using DynamoDB (Recommended)

```bash
# 1. Navigate to project directory
cd take-home-assessment

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start Docker services (LocalStack, Postgres, Ollama)
docker-compose up -d

# 5. Wait for services to be ready (~20 seconds)
sleep 20

# 6. Pull the AI model (required for AI features)
# Note: Using llama3.2 for better accuracy in sentiment analysis (15-30 seconds)
docker exec take-home-assessment-ollama ollama pull llama3.2

# 7. Initialize DynamoDB tables
npm run db:setup

# 8. Start the application
npm run dev
```

### Option B: Using PostgreSQL

```bash
# 1-6. Same as Option A (install, env, docker, AI model)

# 7. Configure PostgreSQL in .env
# Change DATABASE_TYPE=postgres in your .env file

# 8. Initialize PostgreSQL tables
npm run db:migrate

# 9. Start the application
npm run dev
```

**That's it!** Open http://localhost:3000 in your browser.

- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000

**Note**: If you encounter any errors, continue to the detailed setup steps below or check [SETUP_TROUBLESHOOTING.md](./SETUP_TROUBLESHOOTING.md).

---

## Detailed Setup Steps

If you prefer step-by-step instructions or encounter issues with Quick Start:

### Step 1: Install Dependencies

```bash
npm install
```

This installs dependencies for all packages (backend, frontend, infrastructure) using npm workspaces.

### Step 2: Configure Environment Variables

```bash
cp .env.example .env
```

The default configuration works out of the box. Key settings:

```bash
# Database
DATABASE_TYPE=dynamodb
DYNAMODB_ENDPOINT=http://localhost:4566
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# AI (Ollama - FREE, runs locally)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# API
API_PORT=3001
NODE_ENV=development
```

You typically don't need to change anything unless you have port conflicts.

### Step 3: Start Docker Services

```bash
docker-compose up -d
```

This starts three containers:
- **LocalStack** (port 4566) - Local AWS services (DynamoDB)
- **PostgreSQL** (port 5432) - Alternative database option
- **Ollama** (port 11434) - Free local LLM for AI features

Verify all containers are running:
```bash
docker-compose ps
```

All three should show status "Up" or "Up (healthy)".

### Step 4: Pull AI Model

**This step is required for AI features to work:**

```bash
docker exec take-home-assessment-ollama ollama pull llama3.2
```

This downloads the llama3.2 model (~2GB) - the **recommended model for this assessment**. It provides good accuracy for sentiment analysis and theme extraction (15-30 seconds per request).

**Alternative models** (optional):
- `llama3.2` - **Recommended** - Good balance of speed and accuracy (~2GB, 15-30 sec)
- `llama3.2:1b` - Faster but less accurate for NLP tasks (~1.3GB, 5-15 sec)
- `llama3.1` - Larger/better quality (~4.7GB, slower)
- `mistral` - Alternative model (~4.1GB)

To use a different model, change `OLLAMA_MODEL` in `.env` and pull that model.

**Why llama3.2?** Feedback analysis requires understanding sentiment, extracting themes, and identifying actionable items - tasks where the standard llama3.2 model performs significantly better than the smaller :1b variant.

### Step 5: Initialize Database

**You can choose either DynamoDB or PostgreSQL** - both are fully supported.

#### Option A: DynamoDB (Recommended for AWS experience)

```bash
npm run db:setup
```

This creates the `feedback` table in LocalStack DynamoDB. Use this option if you want to demonstrate AWS/DynamoDB experience.

#### Option B: PostgreSQL (Alternative)

If you prefer PostgreSQL:

1. **Update `.env` file** - Change the database type:
   ```bash
   DATABASE_TYPE=postgres
   ```

2. **Run the migration**:
   ```bash
   npm run db:migrate
   ```

This creates the `feedback` table in PostgreSQL with the same schema.

**Note**: You can switch between databases at any time by:
1. Changing `DATABASE_TYPE` in `.env`
2. Restarting the backend: `npm run dev`

### Step 6: Start the Application

```bash
npm run dev
```

This starts both backend and frontend concurrently.

**Or run them separately:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## Verify Everything Works

### 1. Check Backend Health

```bash
curl http://localhost:3001/api/health
```

Expected response: `{"status":"ok","timestamp":"..."}`

### 2. Check Frontend

Open http://localhost:3000 in your browser. You should see the Student Feedback Analyzer interface.

---

## Running Tests

```bash
# Run all tests
npm test

# Run backend tests only
cd backend && npm test

# Run frontend tests only
cd frontend && npm test
```

---

## Building the Application

To verify that all TypeScript code compiles correctly:

```bash
# Build everything (backend + frontend)
npm run build
```

This compiles:
- Backend TypeScript → JavaScript
- Frontend TypeScript + React → Production bundle

You can also build individual packages:
```bash
npm run build:backend
npm run build:frontend
```

---

## Common Issues

### LocalStack not starting

```bash
# Check logs
docker logs take-home-assessment-localstack

# Restart
docker-compose restart localstack
```

### Port already in use

If ports 3000, 3001, or 4566 are occupied:
- Change `API_PORT` in `.env` for backend
- Update `docker-compose.yml` for LocalStack/Postgres/Ollama ports

### Ollama model not found

```bash
# Check if model is loaded
docker exec take-home-assessment-ollama ollama list

# Pull the recommended model if missing
docker exec take-home-assessment-ollama ollama pull llama3.2
```

### npm run db:setup fails (DynamoDB)

- Ensure Docker containers are running: `docker-compose ps`
- Ensure dependencies are installed: `npm install`
- Wait a few seconds after starting LocalStack before running db:setup

### npm run db:migrate fails (PostgreSQL)

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker logs take-home-assessment-postgres

# Test connection
docker exec take-home-assessment-postgres psql -U postgres -d feedback -c "\dt"
```

Common fixes:
- Ensure `DATABASE_TYPE=postgres` in `.env`
- Ensure PostgreSQL container is running
- Ensure `DATABASE_URL` in `.env` is correct (default should work)

---

## Cleanup

Stop containers:
```bash
docker-compose down
```

Stop containers and remove data:
```bash
docker-compose down -v
```

---

## Available Commands Reference

Here's a quick reference of all available npm scripts:

### Development
```bash
npm run dev              # Start backend + frontend concurrently
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
```

### Building
```bash
npm run build            # Build all packages (backend + frontend + infrastructure)
npm run build:backend    # Build backend only
npm run build:frontend   # Build frontend only
npm run build:infrastructure  # Build infrastructure only
```

### Database
```bash
npm run db:setup         # Initialize DynamoDB tables (LocalStack)
npm run db:migrate       # Initialize PostgreSQL tables
```

### Testing
```bash
npm test                 # Run all tests
```

### Other
```bash
npm run lint             # Run linters on backend + frontend
```

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [LocalStack Documentation](https://docs.localstack.cloud/) - For local DynamoDB
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Ollama Documentation](https://ollama.ai/docs) - Local LLM
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

## Need Help?

- Check [SETUP_TROUBLESHOOTING.md](./SETUP_TROUBLESHOOTING.md) for detailed troubleshooting
- Review the [README.md](./README.md) for assessment requirements
