import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN } from '@config';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { initializeDatabase } from '@/database';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 5555;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public async listen() {
    // Connect to database before starting the server
    await this.connectDatabase();

    this.app.listen(this.port, () => {
      logger.info(`=============================================`);
      logger.info(`============= ENV: ${this.env} ==============`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=============================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));

    // Fixed CORS configuration to handle credentials properly
    const corsOptions = {
      origin:
        ORIGIN === '*'
          ? ['http://localhost:3000'] // Default to frontend origin if wildcard
          : ORIGIN.split(','), // Support multiple origins as comma-separated string
      credentials: true, // Always enable credentials
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    };

    this.app.use(cors(corsOptions));

    this.app.use(hpp() as unknown as express.RequestHandler);
    this.app.use(helmet());
    this.app.use(compression() as unknown as express.RequestHandler);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // Configure rate limiting with more granular controls
    this.setupRateLimiting();
  }

  private setupRateLimiting() {
    // Determine window size based on environment
    // In development mode, use a much larger window to avoid hitting limits
    const isDev = this.env === 'development';
    const windowMs = isDev
      ? 24 * 60 * 60 * 1000 // 24 hours in development
      : 15 * 60 * 1000; // 15 minutes in production

    logger.info(`Setting up rate limiting with window of ${windowMs}ms (${isDev ? 'development' : 'production'} mode)`);

    // Base rate limiter configuration
    const baseLimiterConfig = {
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      windowMs, // Use environment-aware window size
    };

    // Authentication endpoints rate limiter (login, registration)
    const authLimiter = rateLimit({
      ...baseLimiterConfig,
      max: isDev ? 1000 : 30, // Very high limit in dev, normal in prod
      message: 'Too many authentication attempts, please try again later',
    });

    // API endpoints with standard access patterns
    const standardApiLimiter = rateLimit({
      ...baseLimiterConfig,
      max: isDev ? 5000 : 100, // Very high limit in dev, normal in prod
      message: 'Too many requests from this IP, please try again later',
    });

    // Public read-only endpoints can have higher limits
    const publicReadLimiter = rateLimit({
      ...baseLimiterConfig,
      max: isDev ? 10000 : 300, // Very high limit in dev, normal in prod
      message: 'Too many requests from this IP, please try again later',
    });

    // Apply rate limiters to specific routes
    this.app.use('/api/v1/auth/login', authLimiter);
    this.app.use('/api/v1/auth/register', authLimiter);
    this.app.use('/api/v1/auth', standardApiLimiter); // For other auth routes

    // Health endpoint should be more accessible
    this.app.use('/health', publicReadLimiter);

    // Apply standard limiter to all other routes
    this.app.use('/api/v1', standardApiLimiter);
  }

  private initializeRoutes(routes: Routes[]) {
    // Root path - redirect to API docs or show API info
    this.app.get('/', (req, res) => {
      res.status(200).json({
        name: 'Huishelder API',
        version: '1.0.0',
        description: 'Backend API for the Huishelder application',
        documentation: '/api-docs',
        health: '/health',
        timestamp: new Date().toISOString(),
      });
    });

    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
      });
    });

    routes.forEach(route => {
      this.app.use('/api/v1', route.router);
    });
  }

  private initializeSwagger() {
    try {
      // Use the combined swagger file that includes journey and timeline documentation
      const swaggerFilePath = path.join(process.cwd(), 'swagger-combined.yaml');
      const swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
      const swaggerDocument = yaml.load(swaggerFile) as object;

      this.app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, {
          explorer: true,
          customCss: '.swagger-ui .topbar { display: none }',
          swaggerOptions: {
            docExpansion: 'list', // Options: 'list', 'full', 'none'
            filter: true,
            showRequestDuration: true,
            persistAuthorization: true,
          },
        }),
      );
      logger.info('Swagger initialized successfully using swagger-combined.yaml');
    } catch (error) {
      logger.error(`Swagger initialization failed: ${error.message}`);
      // Continue even if Swagger fails - don't block app startup
    }
  }

  private async connectDatabase() {
    try {
      // Connect to database and apply migrations
      await initializeDatabase();
    } catch (error) {
      logger.error(`Database initialization failed: ${error.message}`);
      // Don't exit if database fails - we want to be able to start the app even if DB is down
      // This allows API endpoints that don't need the DB to still work
    }
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
