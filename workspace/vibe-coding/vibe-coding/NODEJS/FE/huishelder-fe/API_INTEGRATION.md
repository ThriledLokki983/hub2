# API Integration Guide

## Overview

This document explains how the frontend integrates with the backend API for the journey/timeline feature.

## API Integration

### Journey Timeline Integration

The application uses real API endpoints to fetch and display the user's home-buying journey, including timeline milestones, tasks, financial data, and document requirements.

### Key Integration Points

1. **Timeline Data**:

   - Endpoint: `/journey/timeline`
   - Implementation: `useJourney.ts` hook fetches timeline data and transforms the backend format to the frontend model
   - Data includes milestones, tasks, and their current status

2. **Financial Summary**:

   - Endpoint: `/journey/finance/summary`
   - Implementation: Fetched separately and integrated with the timeline data
   - Displays mortgage costs, monthly payments, and additional fees

3. **Documents Management**:

   - Endpoint: `/journey/documents`
   - Upload Endpoint: `/journey/documents/upload`
   - Implementation: Optional feature that can be disabled in development via environment variables

4. **Task Completion**:
   - Endpoint: `/journey/tasks/{taskId}/complete`
   - Implementation: Allows users to mark tasks as complete and updates the timeline

## Feature Flags

The application supports feature flags to disable certain API endpoints during development:

- `VITE_FETCH_DOCUMENTS`: When set to "false", the application will not attempt to fetch documents from the API. Useful for development when the documents endpoint might not be available.

## Error Handling

The application has robust error handling for API calls:

1. **Silent Mode**: Some requests can be configured to fail silently without showing errors to the user
2. **Fallbacks**: Default values are provided when API data is missing or malformed
3. **Retry Logic**: Optional retry configuration for transient errors

## Data Transformation

The backend API format is transformed to match the frontend data model in the `useJourney` hook:

```typescript
// Example transformation from API format to frontend model
const transformedData = useMemo(
  () => {
    // Extract API response
    const apiTimelineData = timelineQuery.data?.data?.data;

    // Map to frontend model
    const timeline: Milestone[] = (Array.isArray(apiTimelineData) ? apiTimelineData : []).map(
      (item: ApiTimelineItem) => ({
        id: item.milestone_id,
        title: item.milestone.name,
        description: item.milestone.description,
        // ... additional mapping logic
      }),
    );

    // Return complete journey response
    return {
      user: {
        /* user data */
      },
      timeline,
      currentMilestone,
      upcomingTasks,
      financialSummary,
      requiredDocuments,
    };
  },
  [
    /* dependencies */
  ],
);
```

## Development Workflow

1. All API endpoints are defined in `src/configs/journey-endpoints.ts`
2. The `useQueryApi` hook provides a standardized way to call these endpoints
3. Feature flags can be configured in `.env.development` or `.env.production`
4. Components use the data provided by the `useJourney` hook, which handles all API logic

## Troubleshooting

If you encounter 404 errors for certain endpoints:

1. Check if the endpoint exists on your backend
2. Consider disabling the feature via environment variables
3. Look at the network tab to see the exact request being made
