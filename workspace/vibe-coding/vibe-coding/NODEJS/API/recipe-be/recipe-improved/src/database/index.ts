import { Pool } from 'pg';
import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } from '@config';
import { logger } from '@utils/logger';
import migrate from 'node-pg-migrate';

// Create a connection pool instead of a single client
export const pool = new Pool({
  connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
});

// Expose a query function for simpler usage
export const query = (text: string, params?: any[]) => pool.query(text, params);

// For backward compatibility
export const client = pool;

/**
 * Connect to the database
 */
export const connectToDatabase = async (): Promise<void> => {
  try {
    // Test connection with the pool
    const connection = await pool.connect();
    connection.release(); // Release the client back to the pool
    logger.info('✅ Database connection pool established successfully');
  } catch (error) {
    logger.error(`❌ Failed to connect to database pool: ${error.message}`);
    throw error;
  }
};

/**
 * Apply database migrations using node-pg-migrate
 */
export const applyMigrations = async (): Promise<void> => {
  try {
    logger.info('Running database migrations...');

    // Run migrations using node-pg-migrate
    const result = await migrate({
      dir: 'migrations',
      migrationsTable: 'pgmigrations',
      direction: 'up',
      count: Infinity,
      databaseUrl: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
      ignorePattern: '.*\\.(map|md)', // Ignore sourcemap files and markdown files
      // Use NODE_ENV to determine which configuration to use from database.json
      singleTransaction: true,
      dryRun: false,
    });

    if (result.length === 0) {
      logger.info('No new migrations to apply');
    } else {
      logger.info(`✅ Applied ${result.length} migrations successfully`);
      result.forEach(migration => {
        logger.info(`- ${migration.name}`);
      });
    }
  } catch (error) {
    logger.error(`❌ Failed to apply migrations: ${error.message}`);
    throw error;
  }
};

/**
 * Initialize the database connection and apply migrations
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    await connectToDatabase();
    await applyMigrations();
  } catch (error) {
    logger.error('Failed to initialize database');
    throw error;
  }
};

// Export both the query function and pool for flexibility
export default { query, pool };
