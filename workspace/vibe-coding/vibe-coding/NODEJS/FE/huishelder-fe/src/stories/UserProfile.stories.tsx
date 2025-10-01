import type { Meta, StoryObj } from '@storybook/react';
import { QueryProvider } from '../contexts/providers';
import { UserProfile, UserProfileContainer } from '../components/examples/UserProfile';
import { User } from '../components/examples/UserProfile/UserProfile.interface';

// Mock handler for the presenter component
const mockUpdateHandler = (userData: Partial<User>) => {
  console.log('Update user with:', userData);
};

// Mock data for the presenter component
const mockUser: User = {
  id: '1',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  role: 'Administrator',
};

// Define meta for the UserProfile component
const meta = {
  title: 'Examples/UserProfile',
  component: UserProfile,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'UserProfile component demonstrating the Container/Presenter pattern with React Query',
      },
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '600px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UserProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story for the Presenter component with mock data
export const Presenter: Story = {
  args: {
    user: mockUser,
    isLoading: false,
    error: null,
    onUpdate: mockUpdateHandler,
    isUpdating: false,
  },
};

// Story for loading state
export const Loading: Story = {
  args: {
    user: null,
    isLoading: true,
    error: null,
    onUpdate: mockUpdateHandler,
    isUpdating: false,
  },
};

// Story for error state
export const Error: Story = {
  args: {
    user: null,
    isLoading: false,
    error: 'Failed to load user profile. Please try again later.',
    onUpdate: mockUpdateHandler,
    isUpdating: false,
  },
};

// Story for the Container component with React Query
// This requires the QueryProvider to work properly
export const Container: StoryObj<typeof UserProfileContainer> = {
  render: () => (
    <QueryProvider>
      <UserProfileContainer />
    </QueryProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This story shows the container component using React Query. In a real application, this would fetch data from an API.',
      },
    },
  },
};
