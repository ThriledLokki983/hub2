import { NextFunction, Request, Response } from 'express';
import { redisClient, pool } from '@database';
import { RedisMonitor } from '@services/helper/redisMonitor';
import { apiResponse } from '@utils/responseFormatter';
import { HttpStatusCodes } from '@utils/httpStatusCodes';
import os from 'os';
import { logger } from '@/utils/logger';

export class HealthController {
  private redisMonitor: RedisMonitor;

  constructor() {
    // Initialize Redis monitor
    this.redisMonitor = new RedisMonitor(redisClient);

    // Start monitoring with 1-minute interval
    this.redisMonitor.startMonitoring(60000);
  }

  /**
   * Get basic health status
   */
  public getHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Basic system info
      const systemInfo = {
        uptime: process.uptime(),
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        platform: process.platform,
        arch: process.arch,
        hostname: os.hostname(),
        loadAverage: os.loadavg(),
        cpus: os.cpus().length,
      };

      // Redis health check
      const redisHealthy = this.redisMonitor.isHealthy();

      // Overall health status
      const healthy = redisHealthy;

      const healthData = {
        status: healthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        redis: {
          status: redisHealthy ? 'healthy' : 'unhealthy',
        },
        system: systemInfo,
      };

      const statusCode = healthy ? HttpStatusCodes.OK : HttpStatusCodes.SERVICE_UNAVAILABLE;

      apiResponse.success(res, `Health check ${healthy ? 'successful' : 'failed'}`, healthData, { statusCode });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get detailed Redis metrics
   */
  public getRedisMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metrics = this.redisMonitor.getMetrics();
      apiResponse.success(res, 'Redis metrics retrieved successfully', metrics);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get detailed Redis health report
   */
  public getRedisHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = this.redisMonitor.getHealthReport();
      const statusCode = report.healthy ? HttpStatusCodes.OK : HttpStatusCodes.SERVICE_UNAVAILABLE;

      apiResponse.success(res, `Redis health check ${report.healthy ? 'successful' : 'failed'}`, report, { statusCode });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Fix database schema by adding missing photo fields to users table
   */
  public fixDatabaseSchema = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Attempting to fix database schema by adding missing photo fields');

      const client = await pool.connect();
      try {
        // Begin transaction
        await client.query('BEGIN');

        // Check if columns exist before adding them
        const addPhotoUrlQuery = `
          DO $$
          BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.columns
                WHERE table_name = 'users' AND column_name = 'photo_url'
            ) THEN
                ALTER TABLE users ADD COLUMN photo_url text DEFAULT NULL;
                RAISE NOTICE 'Added photo_url column to users table';
            ELSE
                RAISE NOTICE 'photo_url column already exists';
            END IF;
          END $$;
        `;

        const addPhotoFilenameQuery = `
          DO $$
          BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.columns
                WHERE table_name = 'users' AND column_name = 'photo_filename'
            ) THEN
                ALTER TABLE users ADD COLUMN photo_filename text DEFAULT NULL;
                RAISE NOTICE 'Added photo_filename column to users table';
            ELSE
                RAISE NOTICE 'photo_filename column already exists';
            END IF;
          END $$;
        `;

        const addPhotoMimetypeQuery = `
          DO $$
          BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.columns
                WHERE table_name = 'users' AND column_name = 'photo_mimetype'
            ) THEN
                ALTER TABLE users ADD COLUMN photo_mimetype text DEFAULT NULL;
                RAISE NOTICE 'Added photo_mimetype column to users table';
            ELSE
                RAISE NOTICE 'photo_mimetype column already exists';
            END IF;
          END $$;
        `;

        // Execute queries
        await client.query(addPhotoUrlQuery);
        await client.query(addPhotoFilenameQuery);
        await client.query(addPhotoMimetypeQuery);

        // Commit transaction
        await client.query('COMMIT');

        logger.info('Successfully added missing photo fields to users table');

        apiResponse.success(res, 'Database schema fixed successfully', {
          message: 'Added missing photo fields to users table',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        logger.error(`Failed to fix database schema: ${error.message}`);
        throw error;
      } finally {
        // Release client back to the pool
        client.release();
      }
    } catch (error) {
      next(error);
    }
  };
}
