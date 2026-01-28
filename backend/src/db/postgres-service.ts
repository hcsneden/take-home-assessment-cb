import { Pool } from 'pg';

/**
 * PostgreSQL implementation of database operations
 *
 * NOTE: This is a reference implementation. You can:
 * - Use this as-is and implement the TODO methods
 * - Modify the structure to fit your design
 * - Delete this and create your own database layer
 * - Use DynamoDB instead (see dynamodb-service.ts)
 *
 * Documentation: https://node-postgres.com/
 */
export class PostgresService {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/feedback';

    this.pool = new Pool({
      connectionString
    });
  }
}
