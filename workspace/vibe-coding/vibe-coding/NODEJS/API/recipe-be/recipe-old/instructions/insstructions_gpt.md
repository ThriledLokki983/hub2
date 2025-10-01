# Recipe API – Complete Reproduction Instructions (GPT Edition)

This document provides a step-by-step, exhaustive guide for recreating the Recipe API application. It covers architecture, dependencies, setup, database, authentication, recipe management, file uploads, error handling, logging, and all other critical aspects. Follow every step precisely for a flawless reproduction.

---

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack & Dependencies](#technology-stack--dependencies)
3. [Project Structure](#project-structure)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup & Migrations](#database-setup--migrations)
6. [Application Architecture](#application-architecture)
7. [Core Implementation](#core-implementation)
8. [API Documentation](#api-documentation)
9. [Running & Testing](#running--testing)
10. [Utility Scripts](#utility-scripts)

---

## 1. Overview

The Recipe API is a Node.js RESTful service using Express and TypeScript. It provides user authentication, recipe CRUD, ingredient/instruction management, photo uploads, and Swagger API docs. PostgreSQL is used for persistent storage.

---

## 2. Technology Stack & Dependencies

### Core
- Node.js (>=16.0.0)
- TypeScript (~5.8.2)
- Express (~5.1.0)
- PostgreSQL

### Main Packages (from `package.json`)
- express, express-rate-limit, cors, helmet, hpp, compression, morgan, cookie-parser
- bcrypt, jsonwebtoken, class-validator, zod
- multer (file uploads)
- pg, pg-format, pg-pool, pg-types
- dotenv, envalid
- swagger-jsdoc, swagger-ui-express
- winston, winston-daily-rotate-file
- uuid

### Dev Packages
- typescript, ts-node, nodemon
- node-pg-migrate
- eslint, @eslint/js, @stylistic/eslint-plugin, typescript-eslint
- @types/* for all used libraries
- cross-env

---

## 3. Project Structure

```
recipe-api/
├── migrations/                # node-pg-migrate migration files
├── src/
│   ├── app.ts                 # Express app setup
│   ├── server.ts              # Entry point
│   ├── config/                # env config
│   ├── controllers/           # auth & recipe controllers
│   ├── database/              # db connection, migration config/runner
│   ├── dto/                   # Zod/class-validator DTOs
│   ├── exceptions/            # Custom error classes
│   ├── interfaces/            # TS interfaces
│   ├── logs/                  # Winston logs (auto-generated)
│   ├── middlewares/           # Auth, error, upload, validation
│   ├── routes/                # auth.route.ts, recipe.route.ts
│   ├── scripts/               # create-migration, run-migrations, seeding
│   ├── services/              # auth & recipe business logic
│   ├── types/                 # express.d.ts
│   └── utils/                 # logger, test-db-connection
├── uploads/                   # For uploaded files (create manually)
├── instructions/              # Instruction files
├── .env.*.local               # Environment files
├── tsconfig.json
├── nodemon.json
├── eslint.config.mjs
├── package.json
└── README.md
```

---

## 4. Environment Configuration

1. Create `.env.development.local`, `.env.production.local`, `.env.test.local` in the root.
2. Add variables (see `src/config/index.ts`):
   ```
   NODE_ENV=development
   PORT=8888
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=recipe_api_dev
   DB_DIALECT=postgresql
   SECRET_TOKEN=your_jwt_secret
   CREDENTIALS=true
   ORIGIN=*
   LOG_FORMAT=dev
   LOG_DIR=../logs
   ```
3. All variables are validated at runtime with `envalid`.

---

## 5. Database Setup & Migrations

1. Install PostgreSQL and create the database(s):
   ```sql
   CREATE DATABASE recipe_api_dev;
   CREATE DATABASE recipe_api_test;
   CREATE DATABASE recipe_api_prod;
   ```
2. Migrations are managed with `node-pg-migrate`:
   - Migration files are in `/migrations/`.
   - Use npm scripts:
     - `npm run migrate:create -- <name>`
     - `npm run migrate:up`
     - `npm run migrate:down`
3. Schema includes tables for users, recipes, ingredients, instructions, recipe_photos (see migration files for details).

---

## 6. Application Architecture

- **Entry:** `src/server.ts` (instantiates `App` with all routes, calls `start()`)
- **App Setup:** `src/app.ts` (middleware, routes, Swagger, DB connect, error handling)
- **Routes:** `src/routes/` (auth, recipe)
- **Controllers:** `src/controllers/` (handle requests, call services)
- **Services:** `src/services/` (business logic, DB queries)
- **DTOs:** `src/dto/` (Zod schemas for validation)
- **Middleware:** `src/middlewares/` (auth, error, validation, upload)
- **Database:** `src/database/` (connection, migration runner)
- **Config:** `src/config/` (env loading/validation)
- **Utils:** `src/utils/` (logger, test-db-connection)
- **Interfaces:** `src/interfaces/` (TS types)
- **Exceptions:** `src/exceptions/` (custom error classes)

---

## 7. Core Implementation

### 7.1 Server & App
- `server.ts`:
  ```ts
  import { App } from './app';
  import AuthRoute from './routes/auth.route';
  import RecipeRoute from './routes/recipe.route';
  const app = new App([new AuthRoute(), new RecipeRoute()]);
  app.start();
  ```
- `app.ts`: Sets up all middleware (CORS, helmet, hpp, compression, morgan, cookie-parser, rate-limit, static uploads), routes, Swagger, DB, error handling, and graceful shutdown.

### 7.2 Authentication
- Endpoints: `/api/auth/signup`, `/login`, `/logout`, `/me`, `/users`, `/verify-token`, `/random-user`
- Uses JWT (in header or cookie), bcrypt for password hashing, Zod for validation, custom middleware for auth.
- User data in DB: id (UUID), name, email, password hash, timestamps.

### 7.3 Recipe Management
- Endpoints: `/api/recipes` (CRUD), `/ingredients`, `/instructions`, `/photos`, etc.
- Recipes have: id, title, description, image, chef, times, servings, difficulty, ingredients, instructions, photos, timestamps.
- Ingredients/instructions/photos are separate tables, linked by recipe_id.
- File uploads handled by multer, stored in `/uploads/`.

### 7.4 Middleware
- `auth.middleware.ts`: Verifies JWT, attaches user to request.
- `validation.middleware.ts`: Validates request bodies/params with Zod.
- `error.middleware.ts`: Central error handler, uses custom `HttpException`.
- `upload.middleware.ts`: Configures multer for single/multiple file uploads.

### 7.5 Logging
- Winston logger (`src/utils/logger.ts`), with daily rotation, separate debug/error logs, and morgan integration for HTTP logs.

---

## 8. API Documentation

- Swagger docs auto-generated from JSDoc comments in routes and DTOs.
- Served at `/api-docs` (see `app.ts` for config).
- Includes all endpoints, schemas, security, and example requests/responses.

---

## 9. Running & Testing

- **Development:** `npm run dev` (nodemon + ts-node)
- **Production:** `npm run build` then `npm start`
- **Lint:** `npm run lint`
- **Migrations:** See above
- **Swagger:** Visit `http://localhost:8888/api-docs`

---

## 10. Utility Scripts

- `src/scripts/create-migration.ts`: Create new migration file
- `src/scripts/run-migrations.ts`: Run/rollback migrations
- `src/scripts/populate-ghanaian-recipes.ts`: Seed DB with sample data
- `src/utils/test-db-connection.ts`: Test DB connection

---

## Final Notes

- All code is modular and follows best practices for maintainability and security.
- All dependencies and configuration must be present for the app to work as intended.
- The instructions above are exhaustive; do not skip any step for a perfect reproduction.
