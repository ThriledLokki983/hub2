// Script to manually mark a migration as completed without running it
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a connection to the database
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
  // Password is optional (not needed if using OS auth)
  password: process.env.POSTGRES_PASSWORD || undefined,
});

async function markMigrationAsCompleted() {
  try {
    const migrationName = '1745668474463_change-users-id-to-uuid';
    console.log(`Checking if migration ${migrationName} exists...`);

    // Check if the migration already exists to avoid duplicates
    const checkResult = await pool.query('SELECT * FROM pgmigrations WHERE name = $1', [migrationName]);

    if (checkResult.rows.length > 0) {
      console.log('Migration is already marked as completed.');
    } else {
      console.log(`Marking migration ${migrationName} as completed...`);

      // Insert the migration as completed (with default id sequence)
      await pool.query('INSERT INTO pgmigrations (name, run_on) VALUES ($1, NOW())', [migrationName]);

      console.log('Migration successfully marked as completed.');
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('relation "pgmigrations" does not exist')) {
      console.error('The pgmigrations table does not exist. Please run a migration first to create it.');
    }
  } finally {
    await pool.end();
  }
}

markMigrationAsCompleted();
