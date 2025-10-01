# API Hooks Architecture

This directory contains hooks for handling API requests and state management using React Query.

## Overview

The API architecture consists of several layers:

1. **React Query Layer** (`useQueryApi.ts`): The foundation that leverages React Query for caching, fetching, and state management.
2. **Domain-Specific Hooks** (`useUserProfile.ts`, `useUserDashboard.ts`, etc.): Feature-specific hooks that encapsulate business logic and provide a clean interface to components.

## Usage Patterns

### React Query Usage

### React Query for Data Fetching

For data fetching with caching and automatic state management:

```tsx
const { data, isLoading, error } = useQueryApi<ResponseType>({
  endpoint: '/api/resource',
  method: 'GET',
  json: true,
});

if (isLoading) return <Loading />;
if (error) return <ErrorMessage error={error} />;

return <DataDisplay data={data.data} />;
```

### Mutations (Update Operations)

For creating, updating, or deleting data:

```tsx
const { mutate, isPending } = useMutationApi<ResponseType>({
  endpoint: '/api/resource',
  method: 'POST',
  json: true,
});

const handleSubmit = formData => {
  mutate(formData, {
    onSuccess: result => {
      console.log('Success!', result);
    },
  });
};
```

### Domain-Specific Hooks

For feature-specific API operations:

```tsx
// In a component
const { user, isLoading, error, updateProfile, isUpdating } = useUserProfile();

// Simple interface for updating user data
const handleUpdateUser = data => {
  updateProfile(data);
};
```

## Best Practices

1. **Use Domain-Specific Hooks**: Create specialized hooks for different features/domains to keep components clean.

2. **Cache Invalidation**: Use query keys consistently for proper cache invalidation.

3. **Optimistic Updates**: Implement optimistic updates for better user experience.

4. **Error Handling**: Handle errors at the appropriate level - some in the base hooks, others in the UI.

5. **Mock API**: Use the mock API adapter during development for faster iterations.

6. **Type Safety**: Leverage TypeScript generics for type-safe API responses.

7. **Testing**: Create tests for your hooks to ensure they work as expected.

## Development with Mock API

The API hooks integrate with a mock API adapter that intercepts requests during development. To use it:

1. Ensure `VITE_USE_MOCK_API` is set to `true` in your `.env.development` file.

2. Add mock implementations in `mockApiAdapter.ts`.

3. Develop your UI components without waiting for backend APIs to be ready.

## Error Handling Strategy

1. **Base Layer**: Handles network errors, authentication issues, and general HTTP errors.

2. **React Query Layer**: Manages retry logic and exposing error states to components.

3. **Domain Layer**: Transforms errors into user-friendly messages.

4. **UI Layer**: Displays error messages and provides recovery options.

## Further Reading

- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [API Patterns and Best Practices](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
