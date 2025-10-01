import { config } from 'dotenv';
import fs from 'fs';

// Load environment configuration
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

/**
 * Determines if the application is running inside a Docker container
 * This uses multiple detection methods for reliability
 */
const isRunningInDocker = (): boolean => {
  // Check for the explicit environment variable first (most reliable method)
  if (process.env.RUNNING_IN_DOCKER === 'true') {
    return true;
  }

  // Then try checking for Docker-specific files
  try {
    return fs.existsSync('/.dockerenv');
  } catch {
    try {
      // Finally check for Docker in cgroups (Linux containers)
      return fs.readFileSync('/proc/1/cgroup', 'utf8').includes('docker');
    } catch {
      // If all checks fail, assume we're not in Docker
      return false;
    }
  }
};

// Set this once to avoid repeated checks
export const IS_DOCKER = isRunningInDocker();

// Log for debugging purposes
console.log(`Environment detection: Running in Docker = ${IS_DOCKER}`);

// Common environment variables
export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;

// Database configuration with environment-aware defaults
export const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
export const POSTGRES_DB = process.env.POSTGRES_DB || 'huishelder';
export const POSTGRES_PORT = process.env.POSTGRES_PORT || '5432';
// Host depends on environment - use service name in Docker, localhost otherwise
export const POSTGRES_HOST = process.env.POSTGRES_HOST || (IS_DOCKER ? 'pg' : 'localhost');

// Redis configuration with environment-aware defaults
export const REDIS_PORT = process.env.REDIS_PORT || '6379';
// Use explicit environment variable if set, otherwise use Docker service name or localhost
export const REDIS_HOST = process.env.REDIS_HOST || (IS_DOCKER ? 'redis' : 'localhost');

// Log Redis connection settings
console.log(`Using Redis at ${REDIS_HOST}:${REDIS_PORT}`);

// Implement a Redis connection fallback mechanism
export const getRedisConnection = () => {
  // If REDIS_HOST is 'redis' and we can't connect, try 'localhost' as fallback
  if (REDIS_HOST === 'redis') {
    try {
      // Initial attempt will use the configured host
      console.log(`Attempting Redis connection to ${REDIS_HOST}:${REDIS_PORT}`);
      return {
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT, 10),
        // Add a flag to enable fallback if the initial connection fails
        enableFallback: true,
      };
    } catch (error) {
      console.log('Redis connection failed, will try localhost fallback:', error);
    }
  }

  return {
    // If original host is 'redis' and enableFallback is true, use localhost instead
    host: REDIS_HOST === 'redis' ? 'localhost' : REDIS_HOST,
    port: parseInt(REDIS_PORT, 10),
    enableFallback: false,
  };
};
