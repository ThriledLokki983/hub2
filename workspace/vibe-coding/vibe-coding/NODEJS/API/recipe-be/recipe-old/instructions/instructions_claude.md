# Recipe API - Comprehensive Implementation Guide

This document provides complete instructions for recreating the Recipe API application, including its architecture, dependencies, database setup, authentication system, and all required functionality. Following these instructions exactly will result in a fully functional recipe management API.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Setup](#project-setup)
4. [Application Architecture](#application-architecture)
5. [Database Configuration](#database-configuration)
6. [Authentication System](#authentication-system)
7. [Recipe Management](#recipe-management)
8. [File Upload System](#file-upload-system)
9. [API Documentation](#api-documentation)
10. [Error Handling and Logging](#error-handling-and-logging)
11. [Running the Application](#running-the-application)
12. [Testing](#testing)

## Project Overview

The Recipe API is a RESTful service that provides comprehensive recipe management capabilities including:
- User authentication (signup, login, profile management)
- CRUD operations for recipes
- Ingredient and instruction management
- Photo uploads for recipes
- API documentation with Swagger

## Technology Stack

### Core Technologies
- **Node.js** (v16+)
- **TypeScript** (v5.8+)
- **Express** (v5.1+) - Web server framework
- **PostgreSQL** - Database

### Key Dependencies
- **Authentication & Security**
  - bcrypt (v5.1+) - Password hashing
  - jsonwebtoken (v9.0+) - JWT authentication
  - helmet (v8.1+) - HTTP security headers
  - cors (v2.8+) - Cross-Origin Resource Sharing
  - express-rate-limit (v7.5+) - API rate limiting
  - hpp (v0.2+) - HTTP Parameter Pollution protection

- **Database & Data Handling**
  - pg (v8.14+) - PostgreSQL client
  - pg-format (v1.0+) - SQL formatting
  - node-pg-migrate (v7.9+) - Database migrations

- **Validation & Data Transfer**
  - zod (v3.24+) - Schema validation
  - class-validator (v0.14+) - Input validation

- **File Management**
  - multer (v1.4+) - File upload handling

- **Logging & Monitoring**
  - winston (v3.17+) - Logging framework
  - winston-daily-rotate-file (v5.0+) - Log rotation
  - morgan (v1.10+) - HTTP request logging

- **Configuration & Utilities**
  - dotenv (v16.5+) - Environment variable management
  - envalid (v8.0+) - Environment validation
  - uuid (v11.1+) - UUID generation

- **API Documentation**
  - swagger-jsdoc (v6.2+) - Swagger documentation generation
  - swagger-ui-express (v5.0+) - Swagger UI

## Project Setup

### Prerequisites
- Node.js (v16.0.0 or higher)
- PostgreSQL database server
- Git (optional, for version control)

### Initial Setup

1. **Create project directory and initialize:**
   ```bash
   mkdir recipe-api
   cd recipe-api
   npm init -y
   ```

2. **Install TypeScript and core dependencies:**
   ```bash
   npm install typescript ts-node @types/node --save-dev
   npx tsc --init
   ```

3. **Clone the repository structure:**

   Create the following directory structure:
   ```
   recipe-api/
   ├── migrations/
   ├── src/
   │   ├── config/
   │   ├── controllers/
   │   ├── database/
   │   │   └── migrations/
   │   ├── dto/
   │   ├── exceptions/
   │   ├── interfaces/
   │   ├── logs/
   │   │   ├── debug/
   │   │   └── error/
   │   ├── middlewares/
   │   ├── routes/
   │   ├── scripts/
   │   ├── services/
   │   ├── types/
   │   └── utils/
   ├── uploads/   # Create this directory for file uploads
   ```

4. **Install all dependencies:**

   ```bash
   npm install express express-rate-limit bcrypt class-validator compression cookie-parser cors dotenv envalid helmet hpp jsonwebtoken mkdirp morgan multer pg pg-format pg-pool pg-types rimraf swagger-jsdoc swagger-ui-express typedi uuid winston winston-daily-rotate-file zod
   ```

   ```bash
   npm install --save-dev @eslint/js @stylistic/eslint-plugin @types/compression @types/cookie-parser @types/cors @types/express @types/hpp @types/mkdirp @types/morgan @types/node @types/promisify-node @types/rimraf @types/vscode @types/bcrypt @types/jsonwebtoken @types/multer @types/pg @types/swagger-jsdoc @types/swagger-ui-express cross-env eslint node-pg-migrate nodemon ts-node typescript typescript-eslint
   ```

5. **Configure TypeScript:**
   
   Replace the content of `tsconfig.json` with:

   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "commonjs",
       "outDir": "./out",
       "rootDir": "./src",
       "esModuleInterop": true,
       "forceConsistentCasingInFileNames": true,
       "strict": true,
       "skipLibCheck": true,
       "emitDecoratorMetadata": true,
       "experimentalDecorators": true,
       "resolveJsonModule": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "**/*.test.ts"]
   }
   ```

6. **Configure ESLint:**
   
   Create `eslint.config.mjs` with your preferred linting rules.

7. **Setup package.json scripts:**

   Update the scripts section in package.json:

   ```json
   "scripts": {
     "dev": "cross-env NODE_ENV=development nodemon",
     "build": "tsc -p ./",
     "lint": "eslint",
     "start": "node ./out/server.js",
     "watch": "tsc -watch -p ./",
     "migrate:create": "ts-node ./src/scripts/create-migration.ts",
     "migrate:up": "ts-node ./src/scripts/run-migrations.ts up",
     "migrate:down": "ts-node ./src/scripts/run-migrations.ts down"
   }
   ```

8. **Configure Nodemon:**

   Create a `nodemon.json` file:

   ```json
   {
     "watch": ["src"],
     "ext": "ts,json",
     "ignore": ["src/**/*.spec.ts"],
     "exec": "ts-node ./src/server.ts"
   }
   ```

## Application Architecture

The application follows a layered architecture pattern:

1. **Entry Point:**
   - `server.ts` - Application entry point
   - `app.ts` - Express application setup

2. **Routes Layer:**
   - `routes/*.route.ts` - API endpoint definitions and route handlers

3. **Controller Layer:**
   - `controllers/*.controller.ts` - Request handling and response formatting

4. **Service Layer:**
   - `services/*.service.ts` - Business logic implementation

5. **Data Access Layer:**
   - `database/index.ts` - Database connection and query handling

6. **Cross-Cutting Concerns:**
   - `middlewares/*.middleware.ts` - Request processing middleware
   - `utils/*.ts` - Utility functions
   - `exceptions/*.ts` - Custom error classes
   - `interfaces/*.interface.ts` - TypeScript interfaces

This architecture promotes separation of concerns and makes the codebase easier to maintain.

## Environment Configuration

1. **Create environment files:**

   Create the following files:
   - `.env.development.local`
   - `.env.production.local`
   - `.env.test.local`

2. **Add environment variables to each file:**

   Example for `.env.development.local`:
   ```
   NODE_ENV=development
   PORT=8888
   
   # Database
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=recipe_api_dev
   DB_DIALECT=postgresql
   
   # JWT
   SECRET_TOKEN=your_very_secret_token_for_development
   
   # CORS
   CREDENTIALS=true
   ORIGIN=*
   
   # Logging
   LOG_FORMAT=dev
   LOG_DIR=../logs
   ```

## Database Configuration

1. **PostgreSQL Setup:**

   - Install PostgreSQL
   - Create databases:
     ```sql
     CREATE DATABASE recipe_api_dev;
     CREATE DATABASE recipe_api_test;
     CREATE DATABASE recipe_api_prod;
     ```

2. **Database Connection:**

   Create the database connection module `src/database/index.ts` with:
   - PostgreSQL client setup
   - Connection management functions
   - Automatic migration execution

3. **Migration System:**

   Implement the migration system in:
   - `src/database/migration.config.ts` - Configuration for migrations
   - `src/database/migration.runner.ts` - Functions to run migrations
   - `src/scripts/create-migration.ts` - Script to create new migrations
   - `src/scripts/run-migrations.ts` - Script to run migrations

4. **Database Schema:**

   Implement the following migrations:
   - Users table
   - Recipes table
   - Ingredients table
   - Instructions table
   - Recipe photos table

## Core Implementation

### 1. Server Setup

Create `src/server.ts`:
```typescript
import { App } from './app';
import AuthRoute from './routes/auth.route';
import RecipeRoute from './routes/recipe.route';

const app = new App([new AuthRoute(), new RecipeRoute()]);
app.start();
```

### 2. App Configuration

Create `src/app.ts` with:
- Express application setup
- Middleware configuration
  - CORS, security headers, compression, etc.
  - Rate limiting
  - Request logging
- Route initialization
- Swagger documentation setup
- Database connection
- Error handling configuration

### 3. Config Module

Create `src/config/index.ts` to handle environment variables:
- Use dotenv to load environment variables
- Use envalid to validate environment variables
- Export validated environment variables

### 4. Authentication System

1. **Interfaces:**
   - `src/interfaces/auth.interface.ts` - Authentication interfaces
   - `src/interfaces/user.interface.ts` - User data interfaces

2. **DTO:**
   - `src/dto/user.dto.ts` - User data validation schemas

3. **Controller:**
   - `src/controllers/auth.controller.ts` - Authentication controller

4. **Service:**
   - `src/services/auth.service.ts` - Authentication business logic

5. **Routes:**
   - `src/routes/auth.route.ts` - Authentication routes

6. **Middleware:**
   - `src/middlewares/auth.middleware.ts` - Authentication middleware

Implement the following endpoints:
- POST /auth/signup - User registration
- POST /auth/login - User login
- POST /auth/logout - User logout
- GET /auth/me - Get user profile
- GET /auth/users - Get all users (testing)
- GET /auth/verify-token - Verify JWT token
- POST /auth/random-user - Create random user (testing)

### 5. Recipe Management

1. **Interfaces:**
   - `src/interfaces/recipe.interface.ts` - Recipe data interfaces

2. **DTO:**
   - `src/dto/recipe.dto.ts` - Recipe data validation schemas

3. **Controller:**
   - `src/controllers/recipe.controller.ts` - Recipe controller

4. **Service:**
   - `src/services/recipe.service.ts` - Recipe business logic

5. **Routes:**
   - `src/routes/recipe.route.ts` - Recipe routes

Implement the following endpoints:
- GET /recipes - Get all recipes
- GET /recipes/featured - Get featured recipe
- GET /recipes/ingredients - Get all ingredients
- GET /recipes/instructions - Get all instructions
- GET /recipes/:id - Get recipe by ID
- GET /recipes/:id/photos - Get recipe photos
- POST /recipes - Create new recipe
- PUT /recipes/:id - Update recipe
- DELETE /recipes/:id - Delete recipe
- POST /recipes/:id/ingredients - Add ingredients
- POST /recipes/:id/instructions - Add instructions
- POST /recipes/:id/photo - Upload single photo
- POST /recipes/:id/photos - Upload multiple photos
- DELETE /recipes/:id/photos/:photoId - Delete recipe photo

### 6. File Upload Middleware

Create `src/middlewares/upload.middleware.ts`:
- Configure multer for file uploads
- Set up file storage location and naming
- Configure file size limits and allowed types
- Implement single and multiple file upload middleware

### 7. Error Handling and Validation

1. **Exception Classes:**
   - `src/exceptions/httpException.ts` - HTTP exception class

2. **Middleware:**
   - `src/middlewares/error.middleware.ts` - Error handling middleware
   - `src/middlewares/validation.middleware.ts` - Request validation middleware

### 8. Logging System

Set up a comprehensive logging system:
- `src/utils/logger.ts` - Winston logger configuration
- Log rotation and formatting
- Separate logs for errors and debug information

## Running the Application

1. **Development Mode:**
   ```bash
   npm run dev
   ```

2. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

3. **Migrations:**
   ```bash
   # Create a new migration
   npm run migrate:create -- migration-name
   
   # Run migrations
   npm run migrate:up
   
   # Rollback migrations
   npm run migrate:down
   ```

## Testing

For a complete test suite, implement tests for:
- API endpoints
- Authentication
- Data validation
- Database operations

## API Documentation

Access the Swagger documentation at: http://localhost:8888/api-docs

This will provide interactive documentation for all API endpoints, including:
- Request parameters
- Response formats
- Authentication requirements
- Example requests and responses

## Additional Scripts

1. **Database Seed Script:**
   - `src/scripts/populate-ghanaian-recipes.ts` - Seed the database with sample recipes

2. **Database Connection Test:**
   - `src/utils/test-db-connection.ts` - Test the database connection

## Conclusion

This Recipe API provides a robust foundation for a recipe management system. The architecture follows best practices for Node.js applications using Express and TypeScript, with proper separation of concerns and comprehensive error handling.

By following these instructions precisely, you will be able to recreate the complete application without any issues. The modular structure makes it easy to extend the functionality in the future if needed.