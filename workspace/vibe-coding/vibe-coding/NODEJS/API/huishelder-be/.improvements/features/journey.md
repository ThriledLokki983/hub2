# Your Home Journey Feature Documentation

## Table of Contents
- [Summary of Implementation](#summary-of-implementation)
  - [Database Schema](#database-schema)
  - [API Endpoints](#api-endpoints)
  - [Implementation Details](#implementation-details)
  - [Testing](#testing)
  - [Documentation](#documentation)
- [How to Use the Journey Feature](#how-to-use-the-journey-feature)

## Summary of Implementation

### Database Schema
- Created tables for user journeys, milestones, tasks, documents, and financial summaries
- Set up proper relationships between tables with foreign keys
- Added migration script for easy database setup

### API Endpoints
- Journey initialization based on user preferences
- Timeline retrieval with milestones and tasks
- Task completion functionality
- Document upload with automatic task linking
- Financial summary management

### Implementation Details
- Authentication and validation for all endpoints
- Comprehensive error handling
- Proper transaction management for database operations
- Support for complex journey customization based on user needs

### Testing
- Created unit tests for all endpoints
- Added a dedicated test script for journey features
- Docker-compose setup for isolated testing environment

### Documentation
- OpenAPI/Swagger documentation for all endpoints
- README for feature overview
- Code comments for better maintainability

## How to Use the Journey Feature

1. First, initialize the user's journey after onboarding:
   ```
   POST /api/v1/journey/init
   ```
   with the user's preferences like is_first_time_buyer, is_selling_current_home, etc.

2. The system will generate a personalized timeline with relevant milestones and tasks.

3. Retrieve the timeline to show the user their journey:
   ```
   GET /api/v1/journey/timeline
   ```

4. Allow users to complete tasks and upload necessary documents:
   ```
   POST /api/v1/journey/tasks/:id/complete
   POST /api/v1/journey/documents/upload
   ```

5. Track and update financial information throughout the journey:
   ```
   GET /api/v1/journey/finance/summary
   POST /api/v1/journey/finance/summary
   ```

The system is designed to be flexible and can adapt to different user scenarios, whether they're first-time buyers, selling their current home, or need a bridge loan.
