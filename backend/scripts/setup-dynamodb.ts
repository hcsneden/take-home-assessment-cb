#!/usr/bin/env tsx
import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root (two levels up from scripts/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const client = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:4566',
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  }
});

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'feedback';

async function setupDynamoDB() {
  try {
    console.log('🔧 Setting up DynamoDB tables...');

    // Check if table exists
    const listCommand = new ListTablesCommand({});
    const { TableNames } = await client.send(listCommand);

    if (TableNames?.includes(TABLE_NAME)) {
      console.log(`✅ Table "${TABLE_NAME}" already exists`);
      return;
    }

    // Create feedback table
    const createCommand = new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    });

    await client.send(createCommand);
    console.log(`✅ Created table "${TABLE_NAME}"`);
    console.log('🎉 DynamoDB setup complete!');
  } catch (error) {
    console.error('❌ Error setting up DynamoDB:', error);
    process.exit(1);
  }
}

setupDynamoDB();
