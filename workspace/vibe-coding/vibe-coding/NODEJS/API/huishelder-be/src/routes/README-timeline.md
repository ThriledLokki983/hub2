# Timeline Feature Documentation

## Overview

The enhanced timeline feature provides a personalized, dynamic timeline for users throughout their home buying or selling journey. It extends the basic journey milestone system with more granular steps, dependencies, and progress tracking.

## API Endpoints

### Generate User Timeline

Creates or regenerates a user's timeline based on their onboarding profile data.

```
POST /api/v1/journey/timeline/generate
```

**Request:**
- Requires authentication
- Optional request body:
  ```json
  {
    "onboardingData": {
      // User onboarding data (optional - will use stored data if not provided)
    }
  }
  ```

**Response:**
- Status: 201 Created
- Body: Array of timeline steps with their details

**Example response:**
```json
{
  "success": true,
  "message": "Timeline generated successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "timeline_step_id": "550e8400-e29b-41d4-a716-446655440002",
      "status": "pending",
      "due_date": "2023-06-15T00:00:00Z",
      "completed_at": null,
      "notes": null,
      "priority": 1,
      "notification_enabled": true,
      "created_at": "2023-05-15T10:30:00Z",
      "updated_at": "2023-05-15T10:30:00Z",
      "timeline_step": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Get pre-approval for mortgage",
        "description": "Contact a mortgage advisor to get pre-approved for a mortgage",
        "order": 1,
        "default_due_in_days": 14,
        "category": "buying",
        "priority": 1,
        "dependencies": [],
        "related_tool_ids": []
      }
    }
  ]
}
```

### Get Enhanced Timeline

Retrieves a user's timeline with enhanced filtering and sorting options.

```
GET /api/v1/journey/timeline/enhanced
```

**Request:**
- Requires authentication
- Query parameters:
  - `status` (optional): Filter by status (`pending`, `in_progress`, `completed`)
  - `category` (optional): Filter by category (`buying`, `selling`, `shared`)
  - `sort` (optional): Sort field and direction (e.g., `due_date:asc`, `priority:desc`)

**Response:**
- Status: 200 OK
- Body: Timeline steps with progress summary

**Example response:**
```json
{
  "success": true,
  "message": "Enhanced timeline retrieved successfully",
  "data": {
    "steps": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "user_id": "550e8400-e29b-41d4-a716-446655440001",
        "timeline_step_id": "550e8400-e29b-41d4-a716-446655440002",
        "status": "pending",
        "due_date": "2023-06-15T00:00:00Z",
        "completed_at": null,
        "notes": null,
        "priority": 1,
        "notification_enabled": true,
        "created_at": "2023-05-15T10:30:00Z",
        "updated_at": "2023-05-15T10:30:00Z",
        "timeline_step": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "name": "Get pre-approval for mortgage",
          "description": "Contact a mortgage advisor to get pre-approved for a mortgage",
          "order": 1,
          "default_due_in_days": 14,
          "category": "buying",
          "priority": 1,
          "dependencies": [],
          "related_tool_ids": []
        },
        "is_blocked": false
      }
    ],
    "progress": {
      "total": 10,
      "completed": 2,
      "in_progress": 1,
      "pending": 7,
      "percentage": 20
    }
  }
}
```

### Update Timeline Step

Updates an individual timeline step's status, due date, or other attributes.

```
PATCH /api/v1/journey/timeline/steps/:stepId
```

**Request:**
- Requires authentication
- Path parameter:
  - `stepId`: UUID of the timeline step to update
- Request body: Partial step update
  ```json
  {
    "status": "in_progress",
    "due_date": "2023-07-01T00:00:00Z",
    "priority": 2,
    "notification_enabled": true,
    "notes": "Called mortgage advisor, waiting for callback"
  }
  ```

**Response:**
- Status: 200 OK
- Body: Updated step

**Example response:**
```json
{
  "success": true,
  "message": "Timeline step updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "timeline_step_id": "550e8400-e29b-41d4-a716-446655440002",
    "status": "in_progress",
    "due_date": "2023-07-01T00:00:00Z",
    "completed_at": null,
    "notes": "Called mortgage advisor, waiting for callback",
    "priority": 2,
    "notification_enabled": true,
    "created_at": "2023-05-15T10:30:00Z",
    "updated_at": "2023-05-15T12:45:00Z",
    "timeline_step": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Get pre-approval for mortgage",
      "description": "Contact a mortgage advisor to get pre-approved for a mortgage",
      "order": 1,
      "default_due_in_days": 14,
      "category": "buying",
      "priority": 1,
      "dependencies": [],
      "related_tool_ids": []
    }
  }
}
```

### Get Timeline Progress

Retrieves progress statistics for a user's timeline.

```
GET /api/v1/journey/timeline/progress
```

**Request:**
- Requires authentication

**Response:**
- Status: 200 OK
- Body: Progress metrics and statistics

**Example response:**
```json
{
  "success": true,
  "message": "Timeline progress retrieved successfully",
  "data": {
    "overall": {
      "total": 10,
      "completed": 2,
      "in_progress": 1,
      "pending": 7,
      "completion_percentage": 20
    },
    "by_category": [
      {
        "category": "buying",
        "total": 6,
        "completed": 1,
        "completion_percentage": 17
      },
      {
        "category": "shared",
        "total": 4,
        "completed": 1,
        "completion_percentage": 25
      }
    ],
    "upcoming_deadlines": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "due_date": "2023-05-25T00:00:00Z",
        "name": "Schedule property inspections",
        "category": "buying"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "due_date": "2023-06-15T00:00:00Z",
        "name": "Get pre-approval for mortgage",
        "category": "buying"
      }
    ]
  }
}
```

## Timeline Step States

Timeline steps can have the following statuses:

- `pending`: The step hasn't been started yet
- `in_progress`: The user is currently working on this step
- `completed`: The step has been completed

## Dependencies

Timeline steps can have dependencies (prerequisites). A user cannot mark a step as complete until all its dependencies have been completed. This is enforced by the API.

## Categories

Timeline steps are divided into three categories:

- `buying`: Steps related to purchasing a new home
- `selling`: Steps related to selling an existing home
- `shared`: Common steps for both buying and selling

## Integration with Other Features

### Milestones

Timeline steps can be linked to milestones from the journey feature through the `milestone_timeline_step_links` table. This allows the timeline to reflect milestone completions and vice versa.

### Notifications

Timeline steps with upcoming due dates can trigger notifications to users. Steps can have notifications enabled or disabled individually.

### Financial Dashboard

Timeline steps related to financial aspects (like mortgage approvals, offers, etc.) can be integrated with the financial dashboard to provide users with a complete picture of their journey.

## Best Practices

### Generating Timelines

- Generate a timeline once when the user completes onboarding
- Regenerate the timeline if significant changes occur in the user's journey (e.g., they decide to sell their current home)

### Dependencies

- Use dependencies sparingly to avoid frustrating users with blocked steps
- Group related steps together with dependencies to ensure logical progression

### Due Dates

- Set realistic due dates for timeline steps
- Consider the timeline type from onboarding (`<3_months`, `3_6_months`, etc.) when calculating due dates

### Priority

- Use the priority field (1-5) to highlight important steps
- Higher priority (lower number) steps should appear more prominently in the UI
