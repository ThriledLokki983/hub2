import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useQueryApi, useMutationApi } from '../../../src/hooks';

// Create a component to demonstrate the hooks
const ApiHookDemo: React.FC = () => {
  // React Query useQueryApi example
  const { data, isLoading, error } = useQueryApi<{ users: Array<{ id: string; name: string }> }>({
    endpoint: '/api/users',
    method: 'GET',
    json: true,
  });

  // React Query useMutationApi example
  const { mutate, isPending } = useMutationApi<{ user: { id: string; name: string } }>({
    endpoint: '/api/users',
    method: 'POST',
    json: true,
  });

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <h2>API Hooks Documentation</h2>

      <h3>React Query - useQueryApi</h3>
      <pre>{`
// Import the hook
import { useQueryApi } from 'hooks';

// Use the hook directly in your component
const { data, isLoading, error } = useQueryApi<ResponseType>(
  {
    endpoint: '/api/users',
    method: 'GET',
    json: true,
  }
);

// The data is automatically managed with caching, 
// refetching, and more by React Query
      `}</pre>

      <h3>React Query - useMutationApi</h3>
      <pre>{`
// Import the hook
import { useMutationApi } from 'hooks';

// Use the hook for data mutations
const { mutate, isPending } = useMutationApi<ResponseType>(
  {
    endpoint: '/api/users',
    method: 'POST',
    json: true,
  }
);

// Call mutate function with data when needed
function handleSubmit(data) {
  mutate(data, {
    onSuccess: (result) => {
      console.log('Success!', result);
    }
  });
}
      `}</pre>
    </div>
  );
};

const meta = {
  title: 'Hooks/API Hooks',
  component: ApiHookDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'API hooks for data fetching with and without React Query',
      },
    },
  },
} satisfies Meta<typeof ApiHookDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Documentation: Story = {};
