# Financial Dashboard Feature Documentation

## Table of Contents
- [Summary of Implementation](#summary-of-implementation)
  - [Database Schema](#database-schema)
  - [API Endpoints](#api-endpoints)
  - [Implementation Details](#implementation-details)
  - [Testing](#testing)
  - [Documentation](#documentation)
- [How to Use the Financial Dashboard Feature](#how-to-use-the-financial-dashboard-feature)

## Summary of Implementation

### Database Schema
- Created tables for financial inputs and financial outputs
- Set up proper relationships between tables with foreign keys
- Added migration script for easy database setup
- Used UUID for primary keys and enforced data integrity with CASCADE deletions

### API Endpoints
- Financial snapshot creation endpoint for storing user financial data
- Financial calculations performed on the backend
- Retrieval endpoints for viewing current and historical snapshots
- Secure user-scoped data access

### Implementation Details
- Authentication and validation for all endpoints
- Comprehensive error handling
- Proper transaction management for database operations
- Complex financial calculations including mortgage, bridge loans, and monthly payments
- Support for user-specific financial scenarios

### Testing
- Created unit tests for calculation logic
- Added integration tests for API endpoints
- Isolated test environment with database mocking

### Documentation
- OpenAPI/Swagger documentation for all endpoints
- README for feature overview
- Code comments for better maintainability

## How to Use the Financial Dashboard Feature

1. Submit financial information to create a snapshot:
   ```
   POST /api/v1/financial-snapshot
   ```
   with the user's financial details like current_home_value, current_mortgage_left, new_home_price, etc.

2. The system will calculate and return financial insights:
   - Estimated mortgage amount
   - Estimated boeterente (penalty interest)
   - Bridge loan calculation
   - Total buyer costs
   - Monthly payment estimates (both gross and net)

3. Retrieve all financial snapshots history:
   ```
   GET /api/v1/financial-snapshots
   ```

4. Get a specific financial snapshot by ID:
   ```
   GET /api/v1/financial-snapshots/:id
   ```

The system is designed to provide accurate financial calculations based on user inputs and is fully integrated with the user authentication system to ensure data privacy and security.

### Example Input

```json
{
  "current_home_value": 450000,
  "current_mortgage_left": 300000,
  "new_home_price": 600000,
  "interest_rate": 3.5,
  "fixed_term_years": 20,
  "monthly_income": 5500,
  "include_nhg": true,
  "extra_savings": 20000
}
```

### Example Output

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "created_at": "2025-05-14T10:30:00Z",
  "estimated_mortgage": 300000,
  "estimated_boeterente": 5000,
  "bridge_loan_amount": 100000,
  "total_buyer_costs": 25000,
  "monthly_payment_gross": 1350,
  "monthly_payment_net": 1150
}
```

The Financial Dashboard feature works seamlessly with the Home Journey feature to provide comprehensive financial insights throughout the home buying or selling process.
