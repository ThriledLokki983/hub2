import { connectDB, checkConnection, closeDB } from '../database';
import { logger } from './logger';

/**
 * Test database connection script
 * Run with: npx ts-node src/utils/test-db-connection.ts
 */
const testDatabaseConnection = async () => {
  logger.info('Testing database connection...');

  try {
    // Attempt to connect
    const isConnected = await connectDB();

    if (isConnected) {
      logger.info('✅ Successfully connected to the database!');

      // Double-check the connection is operational
      const connectionActive = await checkConnection();
      logger.info(`Connection is ${connectionActive ? 'active' : 'inactive'}`);
    } else {
      logger.error('❌ Failed to connect to the database.');
      logger.info('Check your database credentials in .env.development.local');
    }

    // Close the connection
    await closeDB();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Unexpected error: ${errorMessage}`);
  }
};

// Run the test if this script is executed directly
if (require.main === module) {
  testDatabaseConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { testDatabaseConnection };
