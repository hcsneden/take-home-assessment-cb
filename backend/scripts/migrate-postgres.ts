#!/usr/bin/env tsx
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root (two levels up from scripts/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/feedback'
});

async function migratePostgres() {
  try {
    console.log('🔧 Running PostgreSQL migrations...');

    // Create feedback table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        course_name TEXT NOT NULL,
        student_name TEXT,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        feedback_text TEXT NOT NULL,
        analysis JSONB,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `);

    console.log('✅ Created feedback table');

    // Create indexes for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_feedback_course_name ON feedback(course_name)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC)
    `);

    console.log('✅ Created indexes');
    console.log('🎉 PostgreSQL migration complete!');

    await pool.end();
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    await pool.end();
    process.exit(1);
  }
}

migratePostgres();
