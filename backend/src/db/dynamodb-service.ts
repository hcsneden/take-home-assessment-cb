import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Feedback, FeedbackAnalysis, CreateFeedbackRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Configuration constants
const ENDPOINT = process.env.DYNAMODB_ENDPOINT || 'http://localhost:4566';
const REGION = process.env.AWS_REGION || 'us-east-1';
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'feedback';

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({
  endpoint: ENDPOINT,
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  }
});

const client = DynamoDBDocumentClient.from(ddbClient);

export class DynamoDBService {

  async createFeedback(request: CreateFeedbackRequest): Promise<Feedback> {
    const now = new Date().toISOString();
    //ensure id is set as primary key in dynamodb
    const id = uuidv4();
    const feedback: Feedback = {
      id: id,
      courseName: request.courseName,
      studentName: request.studentName || 'Anonymous',
      rating: request.rating,
      feedbackText: request.feedbackText,
      createdAt: now,
      updatedAt: now
    };

    await client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: feedback
      })
    );

    return feedback;
  }

  // update feedback entry with analysis results
  async updateFeedbackAnalysis(id: string, analysis: FeedbackAnalysis): Promise<Feedback | null> {
    const now = new Date().toISOString();

    const result = await client.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'SET analysis = :analysis, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':analysis': analysis,
          ':updatedAt': now
        },
        ReturnValues: 'ALL_NEW'
      })
    );

    return (result.Attributes as Feedback) || null;
  }

  async getFeedbackById(id: string): Promise<Feedback | null> {
    const result = await client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id }
      })
    );

    return (result.Item as Feedback) || null;
  }

  async getAllFeedback(courseName?: string): Promise<Feedback[]> {
    let command: ScanCommand;

    if (courseName) {
      command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'courseName = :courseName',
        ExpressionAttributeValues: {
          ':courseName': courseName
        }
      });
    } else {
      command = new ScanCommand({
        TableName: TABLE_NAME
      });
    }

    const result = await client.send(command);
    const items = (result.Items as Feedback[]) || [];

    // Sort by created date
    return items.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const dynamoDBService = new DynamoDBService();
