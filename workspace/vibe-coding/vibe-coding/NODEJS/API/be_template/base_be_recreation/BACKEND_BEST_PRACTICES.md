# Node.js Express TypeScript Backend Best Practices

## 📋 Table of Contents
1. [Project Structure](#-project-structure)
2. [Environment Configuration](#-environment-configuration)
3. [Security Best Practices](#-security-best-practices)
4. [Database Management](#-database-management)
5. [Error Handling](#-error-handling)
6. [Logging](#-logging)
7. [Testing](#-testing)
8. [API Design](#-api-design)
9. [Performance Optimization](#-performance-optimization)
10. [Development Workflow](#-development-workflow)
11. [Deployment](#-deployment)

---

## 🏗️ Project Structure

Your current structure follows excellent layered architecture principles. Here are the key practices:

### Directory Organization
```
src/
├── config/           # Configuration files
├── controllers/      # Route handlers (thin layer)
├── services/         # Business logic (thick layer)
├── middlewares/      # Express middlewares
├── routes/           # Route definitions
├── dtos/            # Data Transfer Objects
├── interfaces/      # TypeScript interfaces
├── utils/           # Utility functions
├── database/        # Database connection & setup
├── exceptions/      # Custom error classes
└── test/           # Test files
```

### Best Practices for Structure:
- **Keep controllers thin**: Only handle HTTP requests/responses
- **Keep services thick**: All business logic goes here
- **Single Responsibility**: Each file should have one clear purpose
- **Use TypeScript interfaces**: Define contracts for better type safety

---

## ⚙️ Environment Configuration

### Enhanced Environment Variables
Update your `.env` file with these security improvements:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database Credentials (PostgreSQL)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=gnimoh001
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=dev
POSTGRES_SSL=false
DATABASE_URL=postgresql://gnimoh001:password@localhost:5432/dev
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600

# Security
SECRET_KEY=your_very_long_random_secret_key_at_least_64_characters_long_please
JWT_SECRET=another_very_long_random_jwt_secret_key_at_least_64_characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Logging
LOG_LEVEL=info
LOG_FORMAT=dev
LOG_DIR=./logs
LOG_MAX_SIZE=20m
LOG_MAX_FILES=14d

# CORS - Be specific in production
ORIGIN=http://localhost:3000,http://localhost:3001
CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx

# Email Configuration
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
```

### Environment Validation Best Practices:
```typescript
// src/utils/validateEnv.ts
import { cleanEnv, port, str, num, bool } from 'envalid';

export const ValidateEnv = () => {
  return cleanEnv(process.env, {
    // Server
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port({ default: 3000 }),
    
    // Database
    POSTGRES_HOST: str({ default: 'localhost' }),
    POSTGRES_PORT: port({ default: 5432 }),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str({ minLength: 8 }),
    POSTGRES_DB: str(),
    
    // Security - Enforce strong secrets
    SECRET_KEY: str({ minLength: 64 }),
    JWT_SECRET: str({ minLength: 64 }),
    BCRYPT_ROUNDS: num({ default: 12, min: 10, max: 15 }),
    
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: num({ default: 900000 }),
    RATE_LIMIT_MAX_REQUESTS: num({ default: 100 }),
  });
};
```

---

## 🔒 Security Best Practices

### 1. Authentication & Authorization
```typescript
// JWT Best Practices
const jwtOptions = {
  expiresIn: process.env.JWT_EXPIRES_IN,
  issuer: 'your-app-name',
  audience: 'your-app-users',
  algorithm: 'HS256' as const
};

// Implement JWT blacklist for logout
// Use refresh tokens for better security
```

### 2. Input Validation
```typescript
// Use class-validator decorators in DTOs
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  password: string;

  @IsString()
  @Length(2, 50)
  @Matches(/^[a-zA-Z\s]+$/)
  name: string;
}
```

### 3. Security Headers & Middleware
```typescript
// In your app.ts, ensure these are configured:
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(compression());
```

### 4. Rate Limiting Strategy
```typescript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts',
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // General API limit
  standardHeaders: true,
  legacyHeaders: false,
});
```

---

## 🗄️ Database Management

### 1. Connection Pooling
```typescript
// src/database/index.ts
const poolConfig = {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};
```

### 2. Migration Best Practices
- **Always backup before migrations**
- **Test migrations in development first**
- **Use descriptive migration names**
- **Never modify existing migrations**

```bash
# Create migration
npm run migrate:create add_user_profile_table

# Run migrations
npm run migrate:up

# Check migration status
npm run migrate:status
```

### 3. Query Optimization
```typescript
// Use parameterized queries to prevent SQL injection
const getUserById = async (id: string) => {
  const query = 'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL';
  return await pool.query(query, [id]);
};

// Use indexes for frequently queried columns
// Add LIMIT clauses to prevent large result sets
// Use connection pooling for better performance
```

---

## 🚨 Error Handling

### 1. Custom Error Classes
```typescript
// src/exceptions/httpException.ts
export class HttpException extends Error {
  public status: number;
  public message: string;
  public code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.code = code;
  }
}

export class ValidationException extends HttpException {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}
```

### 2. Global Error Handler
```typescript
// src/middlewares/error.middleware.ts
export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    const code: string = error.code || 'INTERNAL_ERROR';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    
    res.status(status).json({
      success: false,
      status,
      message,
      code,
      ...(NODE_ENV === 'development' && { stack: error.stack })
    });
  } catch (err) {
    next(err);
  }
};
```

---

## 📝 Logging

### 1. Structured Logging
```typescript
// src/utils/logger.ts
import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    });
  })
);
```

### 2. Log Different Levels
```typescript
// Use appropriate log levels
logger.error('Database connection failed', { error: err.message });
logger.warn('High memory usage detected', { usage: '85%' });
logger.info('User authenticated successfully', { userId: user.id });
logger.debug('Query executed', { query, executionTime: '25ms' });
```

---

## 🧪 Testing

### 1. Test Structure
```typescript
// src/test/users.test.ts
describe('Users Controller', () => {
  beforeAll(async () => {
    // Setup test database
  });

  afterEach(async () => {
    // Clean up test data
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
    });
  });
});
```

### 2. Testing Best Practices
- **Unit tests**: Test individual functions/methods
- **Integration tests**: Test API endpoints
- **Use test database**: Never test against production
- **Mock external services**: Use jest.mock() for third-party APIs
- **Test error scenarios**: Don't just test happy paths

---

## 🌐 API Design

### 1. RESTful Conventions
```typescript
// Good API design
GET    /api/v1/users          // Get all users
GET    /api/v1/users/:id      // Get specific user
POST   /api/v1/users          // Create user
PUT    /api/v1/users/:id      // Update user (full)
PATCH  /api/v1/users/:id      // Update user (partial)
DELETE /api/v1/users/:id      // Delete user
```

### 2. Consistent Response Format
```typescript
// src/utils/responseFormatter.ts
export const formatResponse = (data: any, message: string = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

export const formatError = (message: string, code?: string) => {
  return {
    success: false,
    message,
    code,
    timestamp: new Date().toISOString()
  };
};
```

### 3. API Versioning
```typescript
// Use URL versioning
app.use('/api/v1', routes);

// Or header versioning
app.use((req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
});
```

---

## ⚡ Performance Optimization

### 1. Caching Strategy
```typescript
// Redis caching
export class CacheService {
  async get(key: string) {
    return await redis.get(key);
  }

  async set(key: string, value: any, ttl: number = 3600) {
    return await redis.setex(key, ttl, JSON.stringify(value));
  }

  async del(key: string) {
    return await redis.del(key);
  }
}

// Cache frequently accessed data
const getCachedUser = async (id: string) => {
  const cached = await cacheService.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await userService.findById(id);
  await cacheService.set(`user:${id}`, user, 3600);
  return user;
};
```

### 2. Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_status ON users(status) WHERE status = 'active';

-- Use partial indexes for better performance
CREATE INDEX idx_active_users ON users(id) WHERE deleted_at IS NULL;
```

### 3. Pagination
```typescript
export const paginateResults = async (
  query: string,
  params: any[],
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit;
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
  
  const [results, countResult] = await Promise.all([
    pool.query(`${query} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, 
               [...params, limit, offset]),
    pool.query(countQuery, params)
  ]);

  const total = parseInt(countResult.rows[0].count);
  
  return {
    data: results.rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};
```

---

## 🔄 Development Workflow

### 1. Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/user-authentication
git add .
git commit -m "feat: implement user authentication"
git push origin feature/user-authentication

# Use conventional commits
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### 2. Code Quality
```json
// package.json scripts
{
  "scripts": {
    "lint": "eslint --ignore-path .gitignore --ext .ts src/",
    "lint:fix": "npm run lint -- --fix",
    "format": "prettier --write src/**/*.ts",
    "type-check": "tsc --noEmit",
    "test": "jest --forceExit --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 3. Pre-commit Hooks
```javascript
// lint-staged.config.js
module.exports = {
  '*.{ts,js}': [
    'eslint --fix',
    'prettier --write',
    'git add'
  ],
  '*.{json,md}': [
    'prettier --write',
    'git add'
  ]
};
```

---

## 🚀 Deployment

### 1. Environment-Specific Configurations
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    environment:
      - NODE_ENV=production
      - DATABASE_POOL_MAX=20
      - LOG_LEVEL=warn
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### 2. Health Checks
```typescript
// src/controllers/health.controller.ts
export class HealthController {
  public checkHealth = async (req: Request, res: Response) => {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };

    const isHealthy = checks.database && checks.redis;
    
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks
    });
  };
}
```

### 3. Production Monitoring
```typescript
// Add request tracking
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
});
```

---

## 📚 Additional Best Practices

### 1. Documentation
- **Use Swagger/OpenAPI**: Document all endpoints
- **Write README files**: Clear setup instructions
- **Comment complex logic**: Explain why, not what
- **Keep docs updated**: Documentation debt is technical debt

### 2. Monitoring & Alerting
```typescript
// Set up application metrics
const responseTime = new Map();

app.use((req, res, next) => {
  res.on('finish', () => {
    // Track response times, error rates, etc.
    const metrics = {
      endpoint: `${req.method} ${req.route?.path}`,
      statusCode: res.statusCode,
      responseTime: Date.now() - req.startTime
    };
    
    // Send to monitoring service
    sendMetrics(metrics);
  });
  
  next();
});
```

### 3. Security Headers Checklist
- [ ] HTTPS enforcement
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection for state-changing operations
- [ ] Secure session management

### 4. Performance Checklist
- [ ] Database queries optimized
- [ ] Proper indexing
- [ ] Connection pooling configured
- [ ] Caching strategy implemented
- [ ] API response compression
- [ ] Pagination for large datasets
- [ ] File upload size limits
- [ ] Memory leak monitoring

---

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run test                   # Run tests
npm run lint:fix               # Fix linting issues

# Database
npm run migrate:up             # Run migrations
npm run migrate:status         # Check migration status
npm run migrate:create <name>  # Create new migration

# Production
npm run deploy:prod            # Deploy to production
npm run deploy:dev             # Deploy to development

# Monitoring
docker-compose logs -f app     # View application logs
docker-compose ps              # Check service status
```

---

This guide covers the essential best practices for your Node.js Express TypeScript backend. Remember to adapt these practices to your specific use case and always prioritize security, performance, and maintainability.
