import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useQueryApi, useMutationApi, type ApiResponse } from '../hooks/useQueryApi';

// Mock the useApi hook that our queryApi hooks depend on
vi.mock('../hooks/useApi', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    get: vi.fn(() =>
      Promise.resolve({
        status: 'success',
        data: {
          data: {
            success: true,
            message: 'OK',
            statusCode: 200,
            data: { testData: 'test' },
          },
        },
        code: 200,
        message: 'OK',
      } as ApiResponse),
    ),
    post: vi.fn(() =>
      Promise.resolve({
        status: 'success',
        data: {
          data: {
            success: true,
            message: 'Created',
            statusCode: 201,
            data: { created: true },
          },
        },
        code: 201,
        message: 'Created',
      } as ApiResponse),
    ),
  })),
}));

// Create a wrapper component with QueryClientProvider for testing
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useQueryApi', () => {
  const apiConfig = {
    endpoint: '/api/test',
    method: 'GET',
    json: true,
  };

  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useQueryApi(apiConfig), {
      wrapper: createWrapper(),
    });

    // Initially in loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Check that data was loaded correctly
    expect(result.current.data).toEqual({
      status: 'success',
      data: {
        data: {
          success: true,
          message: 'OK',
          statusCode: 200,
          data: { testData: 'test' },
        },
      },
      code: 200,
      message: 'OK',
    });
    expect(result.current.isError).toBe(false);
  });

  it('should handle enabled option', async () => {
    const { result } = renderHook(
      () =>
        useQueryApi(apiConfig, undefined, {
          enabled: false,
          retry: false,
          queryKey: [apiConfig.endpoint],
        }),
      {
        wrapper: createWrapper(),
      },
    );

    // Should not start loading when enabled is false
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
  });
});

describe('useMutationApi', () => {
  const apiConfig = {
    endpoint: '/api/test',
    method: 'POST',
    json: true,
  };

  it('should execute mutations correctly', async () => {
    const { result } = renderHook(() => useMutationApi(apiConfig), {
      wrapper: createWrapper(),
    });

    // Initially not pending
    expect(result.current.isPending).toBe(false);

    // Execute the mutation
    result.current.mutate({ name: 'Test' });

    // Should be pending after mutation starts
    expect(result.current.isPending).toBe(true);

    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // Check the mutation result
    expect(result.current.data).toEqual({
      status: 'success',
      data: {
        data: {
          success: true,
          message: 'Created',
          statusCode: 201,
          data: { created: true },
        },
      },
      code: 201,
      message: 'Created',
    });
    expect(result.current.isError).toBe(false);
  });

  it('should execute callbacks correctly', async () => {
    const onSuccessMock = vi.fn();
    const { result } = renderHook(() => useMutationApi(apiConfig, { onSuccess: onSuccessMock }), {
      wrapper: createWrapper(),
    });

    // Execute the mutation with success handler
    result.current.mutate({ name: 'Test' });

    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // Success callback should be called
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onSuccessMock).toHaveBeenCalledWith(
      {
        status: 'success',
        data: {
          data: {
            success: true,
            message: 'Created',
            statusCode: 201,
            data: { created: true },
          },
        },
        code: 201,
        message: 'Created',
      },
      { name: 'Test' },
      undefined,
    );
  });
});
