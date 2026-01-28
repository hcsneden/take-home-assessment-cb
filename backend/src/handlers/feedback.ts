import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { dynamoDBService } from '../db/dynamodb-service';
import { ollamaService } from '../services/ollama-service';

export const feedbackRoutes = Router();

// Validation schema for creating feedback
const createFeedbackSchema = z.object({
  courseName: z.string().min(1, 'Course name is required').max(200),
  studentName: z.string().max(100).optional(),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  feedbackText: z.string().min(10, 'Feedback must be at least 10 characters').max(5000)
});

//POST /api/feedback - Submit new feedback and trigger AI analysis
feedbackRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const validationResult = createFeedbackSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: validationResult.error.errors
      });
    }

    // Create feedback in database
    //await respone 
    const feedback = await dynamoDBService.createFeedback(validationResult.data);

    // Trigger AI analysis (runs in background, doesn't block response)
    // no await for analyzeFeedback, so it runs asynchronously
    // response from ollamaService may take time, so we handle it in a separate promise
    // .then to update the feedback entry with analysis results
    ollamaService.analyzeFeedback(feedback.feedbackText)
      .then(async (analysis) => {
        await dynamoDBService.updateFeedbackAnalysis(feedback.id, analysis);
        console.log(`AI analysis completed for feedback ${feedback.id}`);
      })
      .catch((error) => {
        console.error(`AI analysis failed for feedback ${feedback.id}:`, error);
      });

    return res.status(201).json({ feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create feedback'
    });
  }
});


//GET /api/feedback - List all feedback entries
//if course is passed in, filter by course name

feedbackRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const courseName = req.query.course as string | undefined;
    const feedbackList = await dynamoDBService.getAllFeedback(courseName);

    return res.json({
      feedback: feedbackList,
      total: feedbackList.length
    });
  } catch (error) {
    console.error('Error fetching feedback list:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch feedback'
    });
  }
});

//GET /api/feedback/:id - Get a specific feedback entry
 
feedbackRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const feedback = await dynamoDBService.getFeedbackById(id);

    if (!feedback) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Feedback with id '${id}' not found`
      });
    }

    return res.json({ feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch feedback'
    });
  }
});
