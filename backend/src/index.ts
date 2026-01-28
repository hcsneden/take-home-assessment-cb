import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { feedbackRoutes } from './handlers/feedback';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors()); // Note: Allows all origins for development. In production, restrict this.
app.use(express.json({ limit: '10mb' })); // Limit payload size to prevent abuse

// Health check endpoint
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/feedback', feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
