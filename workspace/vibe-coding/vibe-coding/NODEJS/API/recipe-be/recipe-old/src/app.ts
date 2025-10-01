import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { Routes } from './interfaces/routes.interface';
import { connectDB } from './database';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { LOG_FORMAT, ORIGIN, NODE_ENV } from './config';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { logger, stream, requestLoggerMiddleware } from './utils/logger';
import path from 'path';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 8888;
    this.env = NODE_ENV || 'development';

    this.initializeMiddleware();
    this.initializeRoutes(routes);
    this.connectToDatabase();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public start() {
    const server = this.app.listen(this.port, () => {
      logger.info(`===============================================`);
      logger.info(`============== ENV: ${this.env} ===============`);
      logger.info(`🚀 App is listening on the port: ${this.port}`);
      logger.info(`📚 API Docs: http://localhost:${this.port}/api-docs`);
      logger.info(`===============================================`);
    });

    // Graceful shutdown
    const shutdown = () => {
      logger.info('Shutting down server...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  }

  public getServer() {
    return this.app;
  }

  // Middleware
  private initializeMiddleware() {
    this.app.use(requestLoggerMiddleware); // Add request ID middleware
    this.app.use(morgan(LOG_FORMAT || 'dev', { stream }));

    // Fixed CORS configuration to handle credentials properly
    const corsOptions = {
      origin: ORIGIN === '*'
        ? ['http://localhost:3000'] // Default to frontend origin if wildcard
        : ORIGIN.split(','), // Support multiple origins as comma-separated string
      credentials: true, // Always enable credentials
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    };
    this.app.use(cors(corsOptions));

    this.app.use(hpp() as unknown as express.RequestHandler);
    this.app.use(
      helmet({
        contentSecurityPolicy: this.env === 'production' ? undefined : false,
      })
    );
    this.app.use(compression() as unknown as express.RequestHandler);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // Add rate limiting middleware with different limits for different routes
    const standardLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    });

    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 300, // Higher limit for auth endpoints
      message: 'Too many auth requests from this IP, please try again later.',
    });

    // Apply stricter rate limiting to general routes
    this.app.use(standardLimiter);

    // Apply a more generous rate limit specifically to auth routes
    this.app.use('/api/auth', authLimiter);

    // Serve static files from the uploads directory
    this.app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  }

  private initializeRoutes(routes: Routes[]) {
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
      });
    });

    routes.forEach((route) => {
      this.app.use('/api', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'Recipe API',
          version: '1.0.0',
          description: 'Recipe management API documentation',
          contact: {
            name: 'API Support',
            email: 'support@recipe-api.com',
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
          },
        },
        servers: [
          {
            url: '/api',
            description: 'API Server',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      apis: [
        path.join(__dirname, './routes/*.js'), // For compiled JS files
        path.join(__dirname, './routes/*.ts'), // For TypeScript source files
        path.join(__dirname, './dto/*.js'),
        path.join(__dirname, './dto/*.ts'),
        path.join(__dirname, './interfaces/*.js'),
        path.join(__dirname, './interfaces/*.ts'),
      ],
    };

    const specs = swaggerJSDoc(options);
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(specs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
          docExpansion: 'list', // Options: 'list', 'full', 'none'
          filter: true,
          showRequestDuration: true,
          persistAuthorization: true,
        },
      })
    );
  }

  private connectToDatabase() {
    connectDB()
      .then(() => {
        logger.info('Connected to the database');
      })
      .catch((error) => {
        logger.error('Error connecting to the database', error);
      });
  }

  private initializeErrorHandling() {
    // Add a 404 handler for unhandled routes
    this.app.use((req, res, _next) => {
      res.status(404).json({ message: 'Route not found' });
    });
    this.app.use(ErrorMiddleware);
  }
}
