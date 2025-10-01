# Recipe API Backend

A modern, feature-rich RESTful API backend for recipe management built with TypeScript, Express.js, and PostgreSQL. This application provides comprehensive functionality for recipe creation, management, search, and social interaction features.

## 📋 Features

### Core Features
- **User Authentication & Management**
  - Secure signup/login with JWT authentication
  - Password reset functionality
  - User profile management

- **Recipe Management**
  - Create, read, update, and delete recipes
  - Comprehensive recipe details (ingredients, instructions, nutritional info)
  - Support for recipe images with automatic thumbnail generation
  - Recipe categorization with tags and regions

- **Advanced Search & Filtering**
  - Search by keywords in title and description
  - Filter by category and tags
  - Filter by maximum prep/cook time
  - Filter by nutritional ranges (calories, protein, fat, carbs)
  - Exclude specific ingredients (for allergies or preferences)

- **Social Features**
  - "Fork" recipes (copy public recipes to your account)
  - Rate recipes (1-5 stars)
  - Add comments to recipes
  - View most popular recipes

### Technical Features
- RESTful API with well-documented endpoints
- PostgreSQL database with migration system
- Data validation and error handling
- Rate limiting and security features
- Comprehensive logging system
- Docker support for easy deployment
- Swagger API documentation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- Docker & Docker Compose (optional, for containerized setup)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd base_be
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:
   ```
   # App
   NODE_ENV=development
   PORT=3000

   # Database
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=recipe_app
   POSTGRES_SCHEMA=public

   # Authentication
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=86400
   ```

### Database Setup

1. Ensure PostgreSQL is running and the database specified in your `.env` file exists.

2. Run the migrations to set up the database schema:
   ```bash
   npm run migrate:up
   ```

3. (Optional) Seed the database with sample data:
   ```bash
   npm run seed:regions
   ```

### Running the Application

#### Development Mode

```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: 3000) with hot reloading enabled.

#### Production Mode

```bash
npm run build
npm start
```

#### Using Docker

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### API Documentation

Once the application is running, Swagger API documentation is available at:
```
http://localhost:3000/api-docs
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific tests
npm test -- --testNamePattern="auth"
```

## 🛠️ Development

### Project Structure

```
src/
├── app.ts                 # Express application setup
├── server.ts              # Server initialization
├── config/                # Configuration variables
├── controllers/           # Request controllers
├── database/              # Database setup and migrations
├── dtos/                  # Data Transfer Objects for validation
├── exceptions/            # Custom exceptions
├── interfaces/            # TypeScript interfaces
├── middlewares/           # Express middlewares
├── routes/                # API routes
├── services/              # Business logic
├── utils/                 # Utility functions
└── logs/                  # Application logs
```

### Database Migrations

```bash
# Create a new migration
npm run migrate:create your_migration_name

# Apply migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down

# View migration status
npm run migrate:status
```

### Code Style & Linting

```bash
# Check code style
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚢 Deployment

### Using PM2

```bash
# Production deployment
npm run deploy:prod

# Development deployment
npm run deploy:dev
```

### Docker Production Deployment

1. Build the production Docker image:
   ```bash
   docker build -f Dockerfile.prod -t recipe-api:prod .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env recipe-api:prod
   ```

## 📚 API Reference

The API is organized around REST principles. It accepts JSON request bodies, returns JSON responses, and uses standard HTTP response codes. All API endpoints are prefixed with `/api` by default.

### Authentication

- `POST /auth/signup`: Register a new user
- `POST /auth/login`: Authenticate a user and get JWT token
- `POST /auth/logout`: Log out current user
- `POST /auth/password-reset`: Request password reset
- `POST /auth/password-reset/:token`: Reset password with token

### Users

- `GET /users`: List users (admin access)
- `GET /users/:id`: Get user by ID
- `PUT /users/:id`: Update user information
- `DELETE /users/:id`: Delete user account
- `GET /users/:id/recipes`: Get all recipes from a specific user

### Recipes

- `GET /recipes`: List recipes with filtering and pagination
  - Query params:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
    - `search`: Search in title and description
    - `category`: Filter by category
    - `tags`: Comma-separated tag names
    - `tag_ids`: Comma-separated tag IDs
    - `sort`: Field to sort by
    - `sort_direction`: ASC or DESC
    - `max_prep_time`: Maximum preparation time in minutes
    - `max_cook_time`: Maximum cooking time in minutes
    - `max_total_time`: Maximum total time in minutes
    - `min_calories`, `max_calories`: Calorie range
    - `min_protein`, `max_protein`: Protein range
    - `min_fat`, `max_fat`: Fat range
    - `min_carbs`, `max_carbs`: Carbohydrates range
    - `exclude_ingredients`: Comma-separated ingredients to exclude

- `GET /recipes/:id`: Get detailed recipe by ID
- `POST /recipes`: Create a new recipe
- `PUT /recipes/:id`: Update a recipe
- `DELETE /recipes/:id`: Delete a recipe
- `POST /recipes/:id/fork`: Fork a recipe (create a copy for personal use)

### Recipe Ingredients

- `GET /recipes/:id/ingredients`: Get all ingredients for a recipe
- `POST /recipes/:id/ingredients`: Add an ingredient to a recipe
- `POST /recipes/:id/ingredients/batch`: Add multiple ingredients to a recipe
- `PUT /recipes/:id/ingredients/:ingredientId`: Update an ingredient
- `DELETE /recipes/:id/ingredients/:ingredientId`: Delete an ingredient
- `GET /recipes/ingredients/all`: Get all unique ingredients across recipes

### Recipe Instructions

- `GET /recipes/:id/instructions`: Get all instructions for a recipe
- `POST /recipes/:id/instructions`: Add an instruction step to a recipe
- `POST /recipes/:id/instructions/batch`: Add multiple instruction steps
- `PUT /recipes/:id/instructions/:instructionId`: Update an instruction step
- `DELETE /recipes/:id/instructions/:instructionId`: Delete an instruction step
- `GET /recipes/instructions/all`: Get all instructions across recipes

### Recipe Photos

- `POST /recipes/:id/photo`: Upload a single photo for a recipe
- `POST /recipes/:id/photos`: Upload multiple photos for a recipe
- `GET /recipes/:id/photos`: Get all photos for a recipe
- `DELETE /recipes/:id/photos/:photoId`: Delete a photo
- `PUT /recipes/:id/photos/:photoId/primary`: Set a photo as primary

### Recipe Tags

- `GET /tags`: List all available tags
- `GET /tags/:id`: Get a specific tag
- `POST /tags`: Create a new tag
- `PUT /tags/:id`: Update a tag
- `DELETE /tags/:id`: Delete a tag
- `GET /recipes/:recipeId/tags`: Get all tags for a recipe
- `POST /recipes/:recipeId/tags`: Add tags to a recipe
- `DELETE /recipes/:recipeId/tags/:tagId`: Remove a tag from a recipe

### Recipe Ratings

- `GET /recipes/:id/ratings`: Get all ratings for a recipe
- `GET /recipes/:id/ratings/mine`: Get current user's rating for a recipe
- `POST /recipes/:id/ratings`: Rate a recipe (1-5 stars)
- `PUT /recipes/:id/ratings`: Update user's rating
- `DELETE /recipes/:id/ratings`: Delete user's rating

### Recipe Comments

- `GET /recipes/:id/comments`: Get all comments for a recipe
- `POST /recipes/:id/comments`: Add a comment to a recipe
- `PUT /recipes/comments/:commentId`: Update a comment
- `DELETE /recipes/comments/:commentId`: Delete a comment

### Recipe Regions

- `GET /regions`: Get all available regions
- `GET /regions/:id`: Get a specific region
- `POST /regions`: Create a new region
- `PUT /regions/:id`: Update a region
- `DELETE /regions/:id`: Delete a region
- `POST /recipes/:recipeId/region`: Set a region for a recipe

### Statistics and Reports

- `GET /recipes/stats/popular`: Get most popular recipes
- `GET /recipes/stats/recent`: Get recently added recipes
- `GET /recipes/stats/top-rated`: Get highest-rated recipes
- `GET /users/:id/stats`: Get user statistics (recipes, comments, ratings)

For detailed request/response schemas and examples, please refer to the Swagger documentation available at `/api-docs` when the server is running.

## 🛡️ Security

This application implements several security best practices:

- HTTPS enforcement in production
- JWT-based authentication
- Data validation
- Rate limiting
- Security headers using Helmet
- SQL injection prevention
- XSS protection

## 📜 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
