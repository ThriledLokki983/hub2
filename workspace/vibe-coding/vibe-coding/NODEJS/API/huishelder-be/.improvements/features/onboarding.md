# User Onboarding Feature Documentation

## Table of Contents
- [Summary of Implementation](#summary-of-implementation)
  - [Database Schema](#database-schema)
  - [API Endpoints](#api-endpoints)
  - [Implementation Details](#implementation-details)
  - [Testing](#testing)
  - [Documentation](#documentation)
- [How to Use the Onboarding Feature](#how-to-use-the-onboarding-feature)

## Summary of Implementation

### Database Schema
- Added `onboarding_completed` column to the users table
- Created a dedicated `user_onboarding` table for user preferences
- Set up proper relationships between tables with foreign keys
- Added migration script for easy database setup
- Implemented data validation with check constraints

### API Endpoints
- Onboarding data retrieval endpoint
- Onboarding data submission endpoint with validation
- Secure user-scoped data access

### Implementation Details
- Authentication and validation for all endpoints
- Comprehensive error handling
- Support for various user goals (buying, selling, exploring)
- Timeline and budget preference tracking
- Current home ownership status tracking

### Testing
- Created unit tests for onboarding endpoints
- Added validation tests for different user scenarios
- Test coverage for error handling

### Documentation
- OpenAPI/Swagger documentation for all endpoints
- README for feature overview
- Code comments for better maintainability

## How to Use the Onboarding Feature

1. Retrieve the current onboarding status and data (if any) for the authenticated user:
   ```
   GET /api/v1/user/onboarding
   ```
   This endpoint returns whether the user has completed onboarding and the saved preferences.

2. Submit onboarding information for a new or existing user:
   ```
   POST /api/v1/user/onboarding
   ```
   with the following data structure:

### Example Input

```json
{
  "goal": "buying",
  "budget_min": 300000,
  "budget_max": 500000,
  "owns_home": true,
  "has_existing_mortgage": true,
  "timeline": "3_6_months"
}
```

### Valid Options

1. **Goal** (required): The user's primary objective
   - `buying` - User is looking to purchase a home
   - `selling` - User is looking to sell their current home
   - `both` - User is looking to both buy and sell
   - `exploring` - User is just exploring options

2. **Budget Range** (optional): Price range for home purchase
   - `budget_min` - Minimum budget in euros
   - `budget_max` - Maximum budget in euros

3. **Current Status** (required): Information about current living situation
   - `owns_home` - Whether the user currently owns a home
   - `has_existing_mortgage` - Whether the user has a mortgage

4. **Timeline** (required): Expected timeframe for buying/selling
   - `<3_months` - Less than 3 months
   - `3_6_months` - Between 3 and 6 months
   - `6_12_months` - Between 6 and 12 months
   - `just_looking` - No specific timeline (exploring)

### Example Response

```json
{
  "success": true,
  "message": "Onboarding data saved successfully",
  "statusCode": 201,
  "data": {
    "onboarding_completed": true,
    "onboarding_data": {
      "goal": "buying",
      "budget_min": 300000,
      "budget_max": 500000,
      "owns_home": true,
      "has_existing_mortgage": true,
      "timeline": "3_6_months"
    }
  }
}
```

## Integration with Other Features

The onboarding process is the first step in the user journey and directly influences other features:

1. **Journey Feature**: The onboarding data is used to personalize the user's home buying/selling journey, setting up appropriate milestones and tasks.

2. **Financial Dashboard**: The budget range and mortgage status from onboarding can be used as initial data for financial calculations.

The onboarding feature serves as the entry point for users to indicate their preferences and needs, allowing the HuisHelder app to provide a personalized experience throughout their home buying or selling process.
