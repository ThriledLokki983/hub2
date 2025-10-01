import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { HealthController } from '@controllers/health.controller';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { refreshConnectionPool } from '@/database';
import { logger } from '@/utils/logger';

export class HealthRoute implements Routes {
  public path = '/health';
  public router = Router();
  public health = new HealthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.health.getHealth);
    this.router.get(`${this.path}/redis`, AuthMiddleware, this.health.getRedisHealth);
    this.router.get(`${this.path}/redis/metrics`, AuthMiddleware, this.health.getRedisMetrics);
    this.router.post(`${this.path}/refresh-db`, AuthMiddleware, this.refreshDatabase);
    this.router.post(`${this.path}/fix-schema`, AuthMiddleware, this.health.fixDatabaseSchema);
  }

  private refreshDatabase = async (req: any, res: any) => {
    try {
      logger.info('Manual database connection refresh requested');
      await refreshConnectionPool();
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Database connections refreshed successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Failed to refresh database connections: ${error.message}`);
      res.status(500).json({
        status: 'ERROR',
        message: 'Failed to refresh database connections',
        timestamp: new Date().toISOString(),
      });
    }
  };
}
