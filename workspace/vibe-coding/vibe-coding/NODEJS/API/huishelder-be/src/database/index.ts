import { Pool } from 'pg';
import Redis from 'ioredis';
import {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  REDIS_HOST,
  REDIS_PORT,
  IS_DOCKER,
  getRedisConnection,
} from '@config';
import { logger } from '@utils/logger';
import migrate from 'node-pg-migrate';

// Log environment detection for troubleshooting
logger.info(`Environment detection: Running in Docker container: ${IS_DOCKER}`);

// PostgreSQL connection string using configuration with built-in defaults
const pgConnectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

// Log the connection details (with password redacted for security)
logger.info(`Database connection: postgres://${POSTGRES_USER}:***@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`);

// PostgreSQL pool setup with optimized connection parameters
export const pool = new Pool({
  connectionString: pgConnectionString,
  // Explicit connection limits
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection cannot be established
  // Connection health check
  allowExitOnIdle: false, // Don't allow the Node process to exit while there are still clients in the pool
});

// Connection pool event listeners for monitoring and logging
pool.on('connect', () => {
  logger.debug(`New connection established to the database pool at ${POSTGRES_HOST}:${POSTGRES_PORT}`);
});

pool.on('error', (err: Error) => {
  logger.error(`Unexpected error on idle client: ${err.message}`);
});

// Expose a query function for simpler usage
export const query = (text: string, params?: any[], client?: any) => {
  return client ? client.query(text, params) : pool.query(text, params);
};

// For backward compatibility
export const client = pool;

// Get Redis connection config with fallback support
const redisConfig = getRedisConnection();
logger.info(`Redis connection: ${redisConfig.host}:${redisConfig.port}`);

// Initialize Redis client with enhanced configuration options
export const redisClient = new Redis({
  host: redisConfig.host,
  port: redisConfig.port,
  // Enable offline queue for better recovery when Redis becomes available again
  enableOfflineQueue: true,
  // Increase maximum retries
  maxRetriesPerRequest: 5,
  // Add connection timeout
  connectTimeout: 10000, // 10 seconds
  // Improved retry strategy with exponential backoff
  retryStrategy(times) {
    // If we're using the original 'redis' hostname and we've tried a few times,
    // attempt to fall back to localhost
    if (redisConfig.enableFallback && times > 3) {
      logger.warn(`Redis connection failed after ${times} attempts, falling back to localhost`);
      // Close current client
      this.disconnect();

      // Create a new client with localhost
      const fallbackClient = new Redis({
        host: 'localhost',
        port: redisConfig.port,
        enableOfflineQueue: true,
        maxRetriesPerRequest: 5,
        connectTimeout: 10000,
        retryStrategy(times) {
          const maxDelay = 30000; // 30 seconds maximum delay
          const delay = Math.min(times * 500, maxDelay);
          return delay;
        },
        lazyConnect: true,
      });

      // Replace the current client with the fallback
      Object.assign(redisClient, fallbackClient);
      logger.info(`Switched Redis connection to localhost:${redisConfig.port}`);

      return false; // Don't retry with the original connection
    }

    // Normal retry logic
    const maxDelay = 30000; // 30 seconds maximum delay
    const delay = Math.min(times * 500, maxDelay); // Exponential backoff starting at 500ms
    logger.info(`Redis retrying connection in ${delay}ms (attempt ${times})`);
    return delay;
  },
  // Add reconnect strategy
  reconnectOnError(err) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      // Only reconnect when specific error occurs
      return 1; // Reconnect with the same options
    }
    return false;
  },
  // Graceful failure handling
  lazyConnect: true, // Don't connect immediately (connect only when needed)
});

// Handle Redis client events
redisClient.on('error', (err: Error) => {
  logger.error(`Redis Error: ${err.message}`);

  // If the error is "getaddrinfo ENOTFOUND redis" and we haven't tried fallback yet
  if (err.message.includes('getaddrinfo ENOTFOUND redis') && redisConfig.enableFallback) {
    logger.info('Attempting to connect to Redis at localhost instead...');

    // Create a new client with localhost
    const fallbackClient = new Redis({
      host: 'localhost',
      port: redisConfig.port,
      enableOfflineQueue: true,
      maxRetriesPerRequest: 5,
      connectTimeout: 10000,
    });

    // Replace the current client with the fallback
    Object.assign(redisClient, fallbackClient);
  }
});

redisClient.on('connect', () => {
  logger.info(`Redis client connected to ${redisClient.options.host}:${redisClient.options.port}`);
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis client reconnecting');
});

redisClient.on('end', () => {
  logger.warn('Redis client connection closed');
});

/**
 * Refresh the database connection pool to ensure schema changes are recognized
 */
export const refreshConnectionPool = async (): Promise<void> => {
  try {
    logger.info('Refreshing database connection pool to apply schema changes...');
    // Drain the pool and create a new one to refresh schema cache
    await pool.end();
    // Small delay to ensure all connections are fully closed
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Re-initialize the pool with the same configuration
    const newPool = new Pool({
      connectionString: pgConnectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      allowExitOnIdle: false,
    });

    // Replace the old pool with the new one
    Object.assign(pool, newPool);
    logger.info('✅ Database connection pool refreshed successfully');
  } catch (error) {
    logger.error(`❌ Failed to refresh connection pool: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Connect to the database
 */
export const connectToDatabase = async (): Promise<void> => {
  try {
    // Add retry logic for initial connection
    let retries = 0;
    const maxRetries = 5;
    const retryDelay = 2000;

    while (retries < maxRetries) {
      try {
        const connection = await pool.connect();
        connection.release(); // Release the client back to the pool
        logger.info(`✅ Database connection pool established successfully to ${POSTGRES_HOST}:${POSTGRES_PORT}`);
        return;
      } catch (err) {
        retries++;
        if (retries < maxRetries) {
          logger.warn(`Failed to connect to database (attempt ${retries}/${maxRetries}), retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          throw err;
        }
      }
    }
  } catch (error) {
    logger.error(`❌ Failed to connect to database pool: ${error instanceof Error ? error.message : String(error)}`);
    logger.error(`Connection details: ${pgConnectionString.replace(/(postgres:\/\/[^:]+:)[^@]+(@.*)/, '$1******$2')}`);
    throw error;
  }
};

/**
 * Connect to Redis
 */
export const connectRedis = async (): Promise<void> => {
  try {
    // Test connection by pinging Redis
    await redisClient.ping();
    logger.info(`✅ Redis client connected successfully to ${REDIS_HOST}:${REDIS_PORT}`);
  } catch (error) {
    logger.error(`❌ Failed to connect to Redis at ${REDIS_HOST}:${REDIS_PORT}: ${error instanceof Error ? error.message : String(error)}`);
    logger.warn('Application will continue without Redis service. Token blacklisting may use in-memory fallback.');

    // Set a flag to indicate Redis is unavailable
    (global as any).redisUnavailable = true;
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
      databaseUrl: pgConnectionString,
      ignorePattern: '(^\\..*|.*\\.(map|md))', // Ignore hidden files (like .DS_Store), sourcemaps, and markdown files
      singleTransaction: false, // Changed to false to allow continuing after errors
      dryRun: false,
      filterFunction: (fileName: string) => {
        // Additional filter to exclude macOS .DS_Store files and other problematic files
        if (fileName === '.DS_Store' || fileName.startsWith('.')) {
          logger.debug(`Ignoring file during migration: ${fileName}`);
          return false;
        }
        return true;
      },
    });

    if (result.length === 0) {
      logger.info('No new migrations to apply');
    } else {
      logger.info(`✅ Applied ${result.length} migrations successfully`);
      result.forEach(migration => {
        logger.info(`- ${migration.name}`);
      });

      // Refresh connection pool after migrations to ensure schema changes are recognized
      await refreshConnectionPool();
    }
  } catch (error) {
    logger.error(`❌ Failed to apply migrations: ${error instanceof Error ? error.message : String(error)}`);
    logger.warn('Continuing application startup despite migration issues');
    // Don't rethrow the error, allow the application to continue
  }
};

/**
 * Initialize the database connection and apply migrations
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    await connectToDatabase();

    try {
      await applyMigrations();
    } catch (error) {
      // Check if the error is about relations already existing
      if (error instanceof Error && error.message && error.message.includes('already exists')) {
        logger.warn(`Migration warning: ${error.message}`);
        logger.info('Continuing application startup despite migration issues');
      } else {
        // Rethrow if it's a different error
        throw error;
      }
    }

    await connectRedis();
  } catch (error) {
    logger.error(`Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

// Export both the query function and pool for flexibility
export default { query, pool, redisClient };
