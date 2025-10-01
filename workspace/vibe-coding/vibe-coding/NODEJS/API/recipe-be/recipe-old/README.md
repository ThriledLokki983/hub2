# Recipe API

A robust REST API for recipe management and discovery built with Node.js,
Express, TypeScript, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Migrations](#database-migrations)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [File Uploads](#file-uploads)
- [Error Handling & Logging](#error-handling--logging)
- [Rate Limiting](#rate-limiting)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Features

- **Recipe Management**: Create, read, update, and delete recipes with detailed
  information
- **Recipe Photos**: Upload and manage multiple photos for each recipe
- **Ingredients & Instructions**: Structured data for recipe ingredients and
  step-by-step instructions
- **User Authentication**: Secure signup, login, and JWT-based authentication
- **API Documentation**: Comprehensive Swagger UI documentation
- **Database Migrations**: Managed PostgreSQL schema migrations
- **Input Validation**: Request payload validation using Zod
- **Error Handling**: Centralized error handling with detailed logging
- **File Upload**: Support for image uploading and management
- **Rate Limiting**: Protection against abuse with rate limiting
- **Logging**: Comprehensive logging system with log rotation and compression

## 🛠️ Tech Stack

- **Core**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Validation**: Zod, class-validator
- **File Upload**: Multer
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston logger with daily rotation
- **Security**: Helmet, CORS, rate limiting

## 📋 Prerequisites

- Node.js (>= 16.0.0)
- PostgreSQL database
- npm or yarn

## 🏁 Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd recipe-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory using the provided `.env.example` as
a template.

4. **Run database migrations**

```bash
npm run migrate:up
```

5. **Start the development server**

```bash
npm run dev
```

The server will start on the port specified in your .env file (defaults to
8888).

6. **Build for production**

```bash
npm run build
```

7. **Start the production server**

```bash
npm start
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
NODE_ENV=development
PORT=8888
API_VERSION=v1
ORIGIN=*
CREDENTIALS=true
LOG_FORMAT=dev

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=recipe_db

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
```

## 📚 API Documentation

API documentation is auto-generated using Swagger. Once the server is running,
access the documentation at:

```
http://localhost:8888/api-docs
```

The documentation provides detailed information about all available endpoints,
request/response schemas, and allows you to test the API directly from the
browser.

## 🗄️ Database Migrations

The project uses node-pg-migrate for database schema management.

### Creating a new migration

```bash
npm run migrate:create -- migration_name
```

### Running migrations

```bash
# Apply all pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down
```

## 📁 Project Structure

```
recipe-api/
├── migrations/             # Database migration files
├── src/
│   ├── app.ts             # Express application setup
│   ├── server.ts          # Server entry point
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── database/          # Database connection and utilities
│   ├── dto/               # Data Transfer Objects
│   ├── exceptions/        # Custom exception classes
│   ├── interfaces/        # TypeScript interfaces
│   ├── logs/              # Application logs
│   ├── middlewares/       # Express middlewares
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
├── uploads/               # Uploaded files storage
├── .env                   # Environment variables
├── package.json           # Project dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🔒 Authentication

The API uses JWT-based authentication.

### Endpoints

- **POST /api/auth/signup**: Register a new user
- **POST /api/auth/login**: Authenticate and receive JWT token
- **POST /api/auth/logout**: Invalidate the current token
- **GET /api/auth/me**: Get the current user's profile

### Protecting Routes

Protected routes require the `Authorization` header with a valid JWT token:

```
Authorization: Bearer <token>
```

## 📷 File Uploads

The API supports file uploads for recipe images using Multer.

### Supported Formats

- Images: JPG, PNG, JPEG, WebP

### Endpoints

- **POST /api/recipes/:id/photo**: Upload a single photo
- **POST /api/recipes/:id/photos**: Upload multiple photos

Uploaded files are accessible through the `/uploads` path.

## 🚨 Error Handling & Logging

The application implements centralized error handling with detailed logging.

- **Development Logs**: Console output with colors
- **Production Logs**: Files in the `logs` directory, separated by level (debug,
  error)
- **Log Rotation**: Daily log files with compression of older logs

## 🛡️ Rate Limiting

To protect against abuse, the API implements rate limiting:

- 100 requests per 15-minute window per IP address
- Configurable in the `app.ts` file

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for
details.
