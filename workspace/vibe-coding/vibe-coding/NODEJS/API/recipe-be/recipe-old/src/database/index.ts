import { Client } from 'pg';
import { logger } from '../utils/logger';
import { DB_USER, DB_HOST, DB_DIALECT, DB_NAME, DB_PORT } from '../config';
import { runMigrations } from './migration.runner';

// Create connection string with password if provided
const connectionString = `${DB_DIALECT}://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const client = new Client({ connectionString });

// Variable to track connection state
let isConnected = false;

/**
 * Connect to the database
 * @returns {Promise<boolean>} Connection status
 */
export const connectDB = async (): Promise<boolean> => {
  try {
    await client.connect();
    isConnected = true;

    // Test query to validate connection works
    const result = await client.query('SELECT NOW()');
    logger.info(
      `Connected to the database - ${DB_DIALECT}://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
    );

    logger.info(`Database timestamp: ${result.rows[0].now}`);

    // Run migrations after successful connection
    await runMigrations('up');

    return true;
  } catch (error: unknown) {
    isConnected = false;
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error connecting to the database: ${errorMessage}`);
    return false;
  }
};

/**
 * Check if database is connected
 * @returns {Promise<boolean>} Connection status
 */
export const checkConnection = async (): Promise<boolean> => {
  if (!isConnected) {
    return false;
  }

  try {
    // Run a simple query to verify the connection is still active
    await client.query('SELECT 1');
    return true;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Database connection check failed: ${errorMessage}`);
    isConnected = false;
    return false;
  }
};

/**
 * Close the database connection
 */
export const closeDB = async (): Promise<void> => {
  try {
    await client.end();
    isConnected = false;
    logger.info('Disconnected from the database');
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error disconnecting from the database: ${errorMessage}`);
  }
};

client.connect();
export default client;
