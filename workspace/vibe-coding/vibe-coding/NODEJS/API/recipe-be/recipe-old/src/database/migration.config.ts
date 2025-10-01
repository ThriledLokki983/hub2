import { DB_USER, DB_HOST, DB_DIALECT, DB_NAME, DB_PORT } from '../config';

// Export database configuration for migrations
export const migrationConfig = {
  // Build auth part: include password only when provided
  connectionString: `${DB_DIALECT}://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  dir: 'src/database/migrations', // Migration files directory
  migrationsTable: 'pgmigrations', // Table to track migrations
  ignorePattern: '.*\\.ts$',
  // Use TypeScript for migrations
  // Only run .js files (transpiled from .ts)
  // TypeScript files will be ignored at runtime
};

export default migrationConfig;
