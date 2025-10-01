import { spawn } from 'child_process';
import path from 'path';
import { logger } from '../utils/logger';

/**
 * Run database migrations
 * @param direction 'up' to apply migrations, 'down' to revert
 * @param options Additional options for migrations
 * @returns Promise that resolves when migrations are complete
 */
export const runMigrations = async (
  direction: 'up' | 'down' = 'up',
  options: {
    to?: string; // Migration to migrate up/down to
    count?: number; // Number of migrations to apply
    singleTransaction?: boolean; // Run all migrations in a transaction
  } = {}
): Promise<boolean> => {
  return new Promise((resolve) => {
    logger.info(`Running migrations ${direction}...`);

    // Build command arguments
    const args = [
      './node_modules/.bin/node-pg-migrate',
      direction,
      '--config-file',
      path.resolve('out/database/migration.config.js'),
      '--migration-file-language',
      'js',
    ];

    // Add optional parameters if provided
    if (options.to) {
      args.push('--to', options.to);
    }
    if (options.count !== undefined) {
      args.push('--count', options.count.toString());
    }
    if (options.singleTransaction) {
      args.push('--single-transaction');
    }

    const migrate = spawn('node', args, {
      stdio: ['inherit', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    // Handle stdout
    migrate.stdout.on('data', (data) => {
      logger.info(`Migration: ${data.toString().trim()}`);
    });

    // Handle stderr
    migrate.stderr.on('data', (data) => {
      logger.error(`Migration error: ${data.toString().trim()}`);
    });

    migrate.on('close', (code) => {
      if (code === 0) {
        logger.info('Migrations completed successfully');
        resolve(true);
      } else {
        logger.error(`Migration process exited with code ${code}`);
        resolve(false);
      }
    });
  });
};

/**
 * Create a new migration file
 * @param name The name of the migration (will be prefixed with timestamp)
 * @returns Promise that resolves when the migration file is created
 */
export const createMigration = async (name: string): Promise<boolean> => {
  return new Promise((resolve) => {
    logger.info(`Creating migration: ${name}...`);

    const args = [
      './node_modules/.bin/node-pg-migrate',
      'create',
      name,
      '--config-file',
      path.resolve('out/database/migration.config.js'),
      '--migration-file-language',
      'ts', // Create TypeScript files
    ];

    const create = spawn('node', args, {
      stdio: ['inherit', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    // Handle stdout
    create.stdout.on('data', (data) => {
      logger.info(`Migration creation: ${data.toString().trim()}`);
    });

    // Handle stderr
    create.stderr.on('data', (data) => {
      logger.error(`Migration creation error: ${data.toString().trim()}`);
    });

    create.on('close', (code) => {
      if (code === 0) {
        logger.info(`Migration file for '${name}' created successfully`);
        resolve(true);
      } else {
        logger.error(`Migration file creation exited with code ${code}`);
        resolve(false);
      }
    });
  });
};
