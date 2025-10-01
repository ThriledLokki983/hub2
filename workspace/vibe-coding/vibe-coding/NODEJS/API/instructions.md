# Instructions for Recreating the Node.js Express Application (base_be)

This document provides highly detailed, step-by-step instructions for recreating the Node.js application found in the `base_be` directory. These instructions are intended for an AI agent to follow precisely.

## 1. Project Architecture Overview

The application follows a standard layered architecture pattern commonly used in Node.js/Express applications:

*   **Configuration (`src/config`):** Handles environment variables and application settings. Uses `envalid` for validation.
*   **Controllers (`src/controllers`):** Handle incoming HTTP requests, interact with services, and send responses.
*   **Database (`src/database`):** Contains database connection logic (likely PostgreSQL based on `pg` dependency) and potentially initialization scripts (`init.sql`).
*   **DTOs (`src/dtos`):** Data Transfer Objects used for request body validation, typically using `class-validator`.
*   **Exceptions (`src/exceptions`):** Custom error classes, like `HttpException`.
*   **HTTP (`src/http`):** Contains HTTP request files for testing API endpoints.
*   **Interfaces (`src/interfaces`):** TypeScript interfaces defining data structures and contracts (e.g., `Routes`, `User`, `Auth`).
*   **Middlewares (`src/middlewares`):** Functions executed before route handlers (e.g., authentication, error handling, request validation).
*   **Routes (`src/routes`):** Define API endpoints and link them to controller methods.
*   **Services (`src/services`):** Contain the core business logic, interacting with databases or external APIs.
*   **Tests (`src/test`):** Unit or integration tests for different application parts (using Jest).
*   **Utils (`src/utils`):** Utility functions like logging (`winston`) and environment validation (`envalid`).
*   **`app.ts`:** The core application class responsible for initializing Express, middleware, routes, Swagger, and error handling.
*   **`server.ts`:** The entry point that creates an instance of the `App` class and starts the server.

## 2. Prerequisites

*   Node.js (check `package.json` for potential engine requirements, though none specified)
*   npm or yarn
*   TypeScript
*   A PostgreSQL database instance (based on `pg` dependency and `init.sql`)

## 3. Step-by-Step Recreation

### Step 3.1: Project Setup

1.  **Create Project Directory:**
    ```bash
    mkdir base_be_recreation
    cd base_be_recreation
    ```
2.  **Initialize Node.js Project:**
    ```bash
    npm init -y
    ```
    *(Or `yarn init -y`)*

### Step 3.2: Install Dependencies

Install all production and development dependencies exactly as listed in the original `base_be/package.json`.

**Production Dependencies:**

```bash
npm install bcrypt class-transformer class-validator compression cookie-parser cors dotenv envalid express helmet hpp jsonwebtoken morgan pg reflect-metadata swagger-jsdoc swagger-ui-express typedi winston winston-daily-rotate-file
```

*(Or using yarn):*
```bash
yarn add bcrypt class-transformer class-validator compression cookie-parser cors dotenv envalid express helmet hpp jsonwebtoken morgan pg reflect-metadata swagger-jsdoc swagger-ui-express typedi winston winston-daily-rotate-file
```

**Development Dependencies:**

```bash
npm install --save-dev @swc/cli @swc/core @types/bcrypt @types/compression @types/cookie-parser @types/cors @types/express @types/hpp @types/jest @types/jsonwebtoken @types/morgan @types/node @types/pg @types/supertest @types/swagger-jsdoc @types/swagger-ui-express @typescript-eslint/eslint-plugin @typescript-eslint/parser cross-env eslint eslint-config-prettier eslint-plugin-prettier husky jest lint-staged node-config node-gyp nodemon pm2 prettier supertest ts-jest ts-node tsc-alias tsconfig-paths typescript
```

*(Or using yarn):*
```bash
yarn add --dev @swc/cli @swc/core @types/bcrypt @types/compression @types/cookie-parser @types/cors @types/express @types/hpp @types/jest @types/jsonwebtoken @types/morgan @types/node @types/pg @types/supertest @types/swagger-jsdoc @types/swagger-ui-express @typescript-eslint/eslint-plugin @typescript-eslint/parser cross-env eslint eslint-config-prettier eslint-plugin-prettier husky jest lint-staged node-config node-gyp nodemon pm2 prettier supertest ts-jest ts-node tsc-alias tsconfig-paths typescript
```

### Step 3.3: Configure TypeScript

Create a `tsconfig.json` file in the project root with the exact following content:

```json
// filepath: tsconfig.json
{
  "compilerOptions": {
    "target": "ES2016", // Match original or update if needed
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true, // Crucial for reflect-metadata/typedi
    "emitDecoratorMetadata": true,   // Crucial for reflect-metadata/typedi
    "moduleResolution": "node",      // Explicitly set module resolution
    "resolveJsonModule": true,       // Allow importing JSON files
    "sourceMap": true,               // Generate source maps (useful for debugging)
    "baseUrl": ".",                  // Base directory for path aliases
    "paths": {                       // Define path aliases EXACTLY as below
      "@config": ["src/config/index"],
      "@config/*": ["src/config/*"], // Added for flexibility if needed
      "@controllers/*": ["src/controllers/*"],
      "@databases": ["src/database/index"], // Adjusted based on common patterns
      "@databases/*": ["src/database/*"],
      "@dtos/*": ["src/dtos/*"],
      "@exceptions/*": ["src/exceptions/*"],
      "@interfaces/*": ["src/interfaces/*"],
      "@middlewares/*": ["src/middlewares/*"],
      "@models/*": ["src/models/*"], // Assuming models might exist or be added
      "@routes/*": ["src/routes/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@tests/*": ["src/test/*"] // Added for test paths
    }
  },
  "include": ["src/**/*", "src/**/*.json"], // Files to include in compilation
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"] // Folders/files to exclude
}
```
*Note: Ensure `tsc-alias` and `tsconfig-paths` are installed (dev dependencies) for path aliases to work correctly after compilation and during runtime with `ts-node`.*

### Step 3.4: Create Project Structure

Replicate the **exact** directory structure found within the `base_be/src` directory precisely. Create all specified folders and empty files initially.

```
src/
├── app.ts
├── server.ts
├── config/
│   └── index.ts
├── controllers/
│   └── auth.controller.ts
│   └── users.controller.ts
├── database/
│   └── index.ts
│   └── init.sql  # Create this file. Content will be added later if applicable.
├── dtos/
│   └── users.dto.ts
├── exceptions/
│   └── httpException.ts
├── http/ # Added http directory
│   └── auth.http
│   └── users.http
├── interfaces/
│   └── auth.interface.ts
│   └── routes.interface.ts
│   └── users.interface.ts
├── middlewares/
│   └── auth.middleware.ts
│   └── error.middleware.ts
│   └── validation.middleware.ts
├── routes/
│   └── auth.route.ts
│   └── users.route.ts
├── services/
│   └── auth.service.ts
│   └── users.service.ts
├── test/ # Create if tests need to be replicated
│   └── auth.test.ts
│   └── users.test.ts
└── utils/
    └── logger.ts
    └── validateEnv.ts
```

### Step 3.5: Populate Source Files (`src/`)

Copy the **exact content** of every file from the original `base_be/src` directory into the corresponding file in the new project's `src` directory. This includes:

1.  **`src/app.ts`:** Core application setup. Pay close attention to `import 'reflect-metadata';`.
2.  **`src/server.ts`:** Application entry point.
3.  **`src/config/index.ts`:** Configuration export.
4.  **`src/controllers/*.ts`:** All controller files (`auth.controller.ts`, `users.controller.ts`).
5.  **`src/database/index.ts`:** Database connection logic.
6.  **`src/dtos/*.ts`:** All Data Transfer Object files (`users.dto.ts`).
7.  **`src/exceptions/*.ts`:** All exception files (`httpException.ts`).
8.  **`src/http/*.http`:** All HTTP request files (`auth.http`, `users.http`).
9.  **`src/interfaces/*.ts`:** All interface files (`auth.interface.ts`, `routes.interface.ts`, `users.interface.ts`).
10. **`src/middlewares/*.ts`:** All middleware files (`auth.middleware.ts`, `error.middleware.ts`, `validation.middleware.ts`).
11. **`src/routes/*.ts`:** All route definition files (`auth.route.ts`, `users.route.ts`).
12. **`src/services/*.ts`:** All service files (`auth.service.ts`, `users.service.ts`).
13. **`src/test/*.ts`:** All test files (`auth.test.ts`, `users.test.ts`) if replicating tests.
14. **`src/utils/*.ts`:** All utility files (`logger.ts`, `validateEnv.ts`).

**Crucially, ensure all imports, exports, class definitions, functions, and logic within these files are identical to the original `base_be` project.**

### Step 3.6: Configure Environment Variables

Create a `.env` file in the project root. Define all the environment variables required by `src/utils/validateEnv.ts`. Example variables (get actual required ones from the original project's `validateEnv.ts` or `.env`):

```dotenv
# .env
NODE_ENV=development
PORT=3000

# Database Credentials (Example)
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# Security
SECRET_KEY=your_very_secret_key_here # Change this!
LOG_FORMAT=dev # Or 'combined' etc.
LOG_DIR=../logs # Example log directory

# CORS
ORIGIN=http://localhost:8080 # Example frontend origin
CREDENTIALS=true
```

### Step 3.7: Configure Supporting Files (Root Directory)

Recreate **all** supporting configuration files found in the **root** of the original `base_be` project. Copy the **exact content** of each file listed below from the original `base_be` directory into the root of the new `base_be_recreation` project:

*   `package.json`: (Already created, but ensure scripts and dependencies match exactly).
*   `tsconfig.json`: (Already created, ensure content matches exactly).
*   `nodemon.json`: Configures `nodemon` for development.
*   `jest.config.js`: Jest test runner configuration.
*   `ecosystem.config.js`: PM2 process manager configuration.
*   `swagger.yaml`: OpenAPI specification file.
*   `.eslintrc.js` (or `.eslintrc.json`, `.eslint.yaml`): ESLint configuration (if present in original).
*   `.prettierrc.js` (or `.prettierrc.json`, etc.): Prettier configuration (if present in original).
*   `.gitignore`: Standard Node.js gitignore file (copy content).
*   `Dockerfile.dev`: Docker configuration for development environment.
*   `Dockerfile.prod`: Docker configuration for production environment.
*   `docker-compose.yml`: Docker Compose configuration.
*   `Makefile`: Make utility configuration (if present).
*   `nginx.conf`: Nginx configuration (if present, likely for a reverse proxy setup).

**It is critical that the content of these files is identical to the original project to ensure consistent behavior, build processes, testing, and deployment.**

### Step 3.8: Database Setup

1.  Ensure a PostgreSQL server is running and accessible.
2.  Configure the correct database credentials in the `.env` file (created in Step 3.6).
3.  Create the database specified in the `.env` file using a PostgreSQL client tool.
4.  **Copy Content:** Copy the exact content of the original `base_be/src/database/init.sql` file into the new project's `src/database/init.sql`.
5.  **Run Script:** Execute the `src/database/init.sql` script against the newly created database to set up the required tables, schemas, and initial data.
    ```bash
    # Example using psql (replace placeholders)
    psql -U your_db_user -d your_db_name -a -f src/database/init.sql
    ```
    *(Adjust the command based on your PostgreSQL client and authentication method)*.

## 4. Running the Application

*   **Development:**
    ```bash
    npm run dev
    ```
    *(Or `yarn dev`)*
    This should use `nodemon` and `ts-node` to run the server, automatically restarting on file changes.
*   **Production:**
    1.  Build the project:
        ```bash
        npm run build
        ```
        *(Or `yarn build`. This uses SWC as per the original scripts. Ensure SWC is correctly installed/configured. Alternatively, use `npm run build:tsc` if configured)*
    2.  Start the server:
        ```bash
        npm start
        ```
        *(Or `yarn start`. This runs the compiled JavaScript from the `dist` folder)*
    3.  **Deployment (using PM2):**
        ```bash
        npm run deploy:prod # For production environment
        # or
        npm run deploy:dev  # For development environment via PM2
        ```

## 5. Verification

1.  Check the console output for the "App listening on the port..." message from `app.listen()`.
2.  Access the Swagger UI endpoint (e.g., `http://localhost:3000/api-docs` based on `app.ts`) in a browser.
3.  Test the API endpoints defined in the routes using a tool like Postman, Insomnia, or `curl`, or by running the integration tests (`npm test` or `yarn test`).
4.  Verify database interactions are working as expected.
5.  Check logs (in the console and potentially log files if configured) for any errors.

This comprehensive guide should allow an AI agent to recreate the `base_be` application with high fidelity. Ensure all file contents and configurations are copied exactly.
