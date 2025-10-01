# 🍲 Recipe API Backend

A RESTful API built with **Node.js**, **Express**, and **PostgreSQL** to manage recipes — including creating, reading, updating, and deleting recipe entries.

---

## 🚀 Tech Stack

- **Node.js** – JavaScript runtime
- **Express** – Web framework
- **PostgreSQL** – Relational SQL database
- **Sequelize** – ORM for PostgreSQL
- **dotenv** – Environment variable management
- **morgan** – HTTP request logger
- **cors** – Cross-Origin Resource Sharing
- **nodemon** – Dev-time server reloader
- **eslint** – Linting tool for JavaScript
- **prettier** – Code formatter
- **jest** – Testing framework
- **typescript-express-starter
- **typescript** – TypeScript for type safety
- **typescript-sequelize** – TypeScript support for Sequelize
- **typescript-jest** – TypeScript support for Jest

---

## 🧱 Project Structure
/recipe-api
├── controllers/           # Route logic and business rules
│   └── recipeController.js
├── models/                # Sequelize models
│   └── recipe.js
├── routes/                # API route definitions
│   └── recipeRoutes.js
├── config/                # Database connection & config
│   └── db.js
├── middlewares/           # Custom middleware (e.g., error handling)
│   └── errorMiddleware.js
├── utils/                 # Utility/helper functions
│   └── logger.js
├── .env                   # Environment variables
├── .gitignore             # Ignored files/folders
├── app.js                 # Entry point
├── package.json           # Project metadata & scripts
└── README.md              # Project documentation

---

## ✅ Naming Conventions

| Element       | Convention       | Example                 |
|---------------|------------------|--------------------------|
| Folders/files | kebab-case       | `recipe-routes.js`       |
| Variables     | camelCase        | `createdAt`              |
| Models        | PascalCase       | `Recipe`                 |
| Routes        | RESTful endpoints| `GET /api/recipes`       |

---

## 📦 Environment Variables (`.env`)

- Define the port and database connection credentials:
  - Application port
  - Database host
  - Database name
  - Username
  - Password
  - Port for PostgreSQL server

---

## 🛠 Best Practices

### Environment
- Store credentials securely using `.env`
- Never commit secrets to version control

### API Design
- Version all APIs under `/api/v1`
- Follow REST conventions and predictable naming

### Code Organization
- Separate controllers, routes, models, and configs
- Keep business logic in controllers, not in routes
- Avoid large files with mixed responsibilities

### Error Handling
- Use centralized error middleware
- Return consistent JSON error format

### Data Validation
- Use Sequelize’s model validation features
- Optionally integrate libraries like Joi or Zod

### Logging
- Use `morgan` for request logs
- Add a custom logger if needed for errors

---

## 📋 Example Scripts (`package.json`)

- Start the server
- Run in development mode
- Run linters and tests

---

## 🧪 Optional Enhancements

| Feature       | Tool                | Description                          |
|---------------|---------------------|--------------------------------------|
| Validation    | Joi, Zod            | Schema-based input validation        |
| Testing       | Jest, Supertest     | Unit and integration testing         |
| Linting       | ESLint, Prettier    | Code style and formatting            |
| Hooks         | Husky, lint-staged  | Run checks before commits            |
| Documentation | Swagger UI          | Auto-generate and view API docs      |
| Deployment    | Docker, Railway     | Containerization & hosting           |

---

# 🛠 Step-by-Step Setup Instructions

### 1. Initialize Project
- Create a project folder and initialize it
- Install dependencies for Express, Sequelize, PostgreSQL, and common utilities
- Install development dependencies such as nodemon

### 2. Set Up Project Structure
- Create the following folders: `controllers`, `models`, `routes`, `config`, `middlewares`, `utils`
- Create key files: `app.js`, `.env`, `.gitignore`, `README.md`

### 3. Configure Express App
- Load environment variables
- Set up middleware for JSON parsing, logging, and CORS
- Import and initialize the database
- Mount the recipe routes
- Start the server on the specified port

### 4. Connect to PostgreSQL
- Configure Sequelize using environment variables
- Authenticate the connection and log status

### 5. Create Recipe Model
- Define a Sequelize model with fields:
  - Title (required)
  - Ingredients (as an array or JSON)
  - Instructions (required)
  - Image (optional)
  - CreatedAt (default to now)

### 6. Define Routes
- Create RESTful endpoints for:
  - Fetching all recipes
  - Fetching a recipe by ID
  - Creating a new recipe
  - Updating an existing recipe
  - Deleting a recipe
- Connect each route to its controller function

### 7. Write Controllers
- Write logic to:
  - Get all recipes from the database
  - Get a recipe by its ID
  - Create a recipe with request data
  - Update a recipe by ID
  - Delete a recipe by ID
- Include error handling for each operation

### 8. Use Environment Variables
- Store database connection values in `.env`
- Access them using `process.env` in your config and application files

### 9. Test the API
- Use Postman or Insomnia to test the API:
  - Send requests to each endpoint
  - Verify that responses are correct and data is being persisted
  - Check error responses and edge cases

---

## 🔗 API Endpoints (Versioned)

| Method | Endpoint             | Description           |
|--------|----------------------|-----------------------|
| GET    | `/api/recipes`       | Get all recipes       |
| GET    | `/api/recipes/:id`   | Get a recipe by ID    |
| POST   | `/api/recipes`       | Create a new recipe   |
| PUT    | `/api/recipes/:id`   | Update an existing recipe |
| DELETE | `/api/recipes/:id`   | Delete a recipe       |

---

## 🧠 Best Practices Summary

- Use versioned API routes like `/api/v1/...`
- Keep logic modular: separate models, routes, controllers
- Centralize error handling with middleware
- Reuse code where possible (DRY principle)
- Never hard-code secrets — use environment variables
- Validate all user input
- Log important operations and failures
- Write clear, meaningful commit messages

---