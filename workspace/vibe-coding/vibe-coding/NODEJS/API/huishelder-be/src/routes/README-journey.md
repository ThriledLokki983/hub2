# Your Home Journey Feature

This module provides a complete backend solution for guiding users through the home buying or selling process in the Netherlands with milestones, tasks, document uploads, and financial summaries.

## Features

- Personalized journey based on user's specific situation (first-time buyer, selling current home, etc.)
- Structured milestones and tasks representing the home buying/selling process
- Document upload functionality with automatic linking to related tasks
- Financial summary tracking (mortgage estimates, monthly payments, etc.)
- Complete API endpoints with authentication and validation

## Database Schema

The journey feature uses the following tables:

1. `user_journeys`: Stores the user's journey configuration
2. `milestones`: Contains template milestones for the journey
3. `user_milestones`: Links milestones to a user's journey with completion status
4. `user_tasks`: Contains tasks associated with milestones
5. `documents`: Stores metadata for uploaded documents
6. `financial_summaries`: Tracks financial information for a journey

## API Endpoints

### Journey Initialization

```
POST /api/v1/journey/init
```
Initializes or updates a user's journey based on their specific situation.

### Journey Timeline

```
GET /api/v1/journey/timeline
```
Returns all milestones and associated tasks for a user's journey.

### Journey Tasks

```
GET /api/v1/journey/tasks
```
Returns all active (non-completed) tasks for a user's journey.

### Complete Task

```
POST /api/v1/journey/tasks/:id/complete
```
Marks a task as complete and updates the milestone status if all tasks are complete.

### Document Upload

```
POST /api/v1/journey/documents/upload
```
Uploads a document and automatically links it to related tasks if applicable.

### Financial Summary

```
GET /api/v1/journey/finance/summary
POST /api/v1/journey/finance/summary
```
Retrieves or updates the financial information for a user's journey.

## Usage

1. First, a user completes the onboarding process
2. Initialize their journey with `POST /journey/init`
3. Retrieve the timeline with `GET /journey/timeline`
4. As the user progresses, they can:
   - Complete tasks
   - Upload documents
   - Update their financial information

## Running Tests

```bash
npm run test:journey
```

## API Documentation

Complete API documentation is available in the Swagger interface at `/api-docs` when the server is running.
