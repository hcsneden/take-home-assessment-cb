import { DynamoDBService } from '../src/db/dynamodb-service';

const mockSend = jest.fn();

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: () => ({ send: (...args: unknown[]) => mockSend(...args) })
  },
  PutCommand: jest.fn(),
  UpdateCommand: jest.fn(),
  GetCommand: jest.fn(),
  ScanCommand: jest.fn()
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234')
}));

describe('DynamoDBService', () => {
  let service: DynamoDBService;

  beforeEach(() => {
    mockSend.mockClear();
    service = new DynamoDBService();
  });

  describe('createFeedback', () => {
    it('should create feedback and return the created item', async () => {
      mockSend.mockResolvedValueOnce({});
      const request = {
        courseName: 'Introduction to Python',
        studentName: 'John Doe',
        rating: 4,
        feedbackText: 'Great course with helpful examples!'
      };

      const result = await service.createFeedback(request);

      expect(result).toMatchObject({
        id: 'test-uuid-1234',
        courseName: 'Introduction to Python',
        studentName: 'John Doe',
        rating: 4,
        feedbackText: 'Great course with helpful examples!'
      });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should default studentName to Anonymous when not provided', async () => {
      mockSend.mockResolvedValueOnce({});
      const request = {
        courseName: 'Data Structures',
        rating: 5,
        feedbackText: 'Excellent explanations throughout.'
      };

      const result = await service.createFeedback(request);
      expect(result.studentName).toBe('Anonymous');
    });
  });
});
