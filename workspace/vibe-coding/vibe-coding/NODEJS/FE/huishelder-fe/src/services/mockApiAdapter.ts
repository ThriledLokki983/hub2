/**
 * Mock API adapter for development and testing
 *
 * This module provides mock implementations of API endpoints
 * to enable development without a backend dependency.
 */

import { User } from 'components/examples/UserProfile';
import {
  FinancialInput,
  FinancialOutput,
} from '../components/FinancialDashboard/FinancialDashboard.interface';
import { mockFinancialCalculator } from './mockFinancialService';

// Delay utility to simulate network latency
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Mock database
const mockDb = {
  users: {
    currentUser: {
      id: '1',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Administrator',
    } as User,
  },
};

/**
 * Mock API responses for development and testing
 */
export const mockApiResponses = {
  /**
   * Calculate financial snapshot based on user inputs
   */
  calculateFinancialSnapshot: async (input: FinancialInput): Promise<FinancialOutput> => {
    // Simulate network latency
    await delay(1500);

    // Use our mock calculator
    return mockFinancialCalculator(input);
  },

  /**
   * Get current user profile
   */
  getUserProfile: async (): Promise<{ user: User }> => {
    // Simulate network latency
    await delay(800);

    return {
      user: { ...mockDb.users.currentUser },
    };
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (userData: Partial<User>): Promise<{ user: User }> => {
    // Simulate network latency
    await delay(1200);

    // Update user in mock database
    mockDb.users.currentUser = {
      ...mockDb.users.currentUser,
      ...userData,
    };

    return {
      user: { ...mockDb.users.currentUser },
    };
  },

  /**
   * Simulate API error (for testing error handling)
   */
  simulateApiError: async (): Promise<never> => {
    await delay(500);
    throw new Error('API Error: Something went wrong');
  },
};

/**
 * Enable or disable mock API based on environment
 * This can be controlled via environment variable or feature flag
 */
export const isMockApiEnabled = (): boolean => {
  // Enable mock API for development
  return true;

  // Original implementation:
  // return import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== 'false';
};

/**
 * Mock request interceptor
 * This function intercepts API requests and returns mock responses
 *
 * @param endpoint - API endpoint
 * @param method - HTTP method
 * @param payload - Request payload
 * @returns Mock response or null if no mock is available
 */
export const mockRequestInterceptor = async (
  endpoint: string,
  method: string,
  payload?: Record<string, unknown>,
): Promise<unknown | null> => {
  // Only intercept if mock API is enabled
  if (!isMockApiEnabled()) return null;

  // Match endpoint and method to mock implementation
  const endpointKey = `${method.toUpperCase()}:${endpoint}`;

  switch (endpointKey) {
    case 'GET:/api/user/me':
      return mockApiResponses.getUserProfile();

    case 'PATCH:/api/user/me':
      return mockApiResponses.updateUserProfile(payload as Partial<User>);

    case 'POST:/api/financial-snapshot':
      // Validate the payload has the required FinancialInput properties
      if (payload && typeof payload === 'object') {
        // Type guard function to check if payload has FinancialInput properties
        const isFinancialInput = (obj: unknown): obj is FinancialInput => {
          const requiredProps = [
            'current_home_value',
            'current_mortgage_left',
            'new_home_price',
            'interest_rate',
            'fixed_term_years',
            'monthly_income',
            'extra_savings',
            'include_nhg',
          ];
          return requiredProps.every(prop => prop in (obj as Record<string, unknown>));
        };

        if (isFinancialInput(payload)) {
          return mockApiResponses.calculateFinancialSnapshot(payload);
        }
      }
      return Promise.reject(new Error('Invalid financial input data'));

    case 'GET:/api/error-test':
      return mockApiResponses.simulateApiError();

    default:
      // No mock implementation for this endpoint
      console.warn(`No mock implementation for ${endpointKey}`);
      return null;
  }
};

export default mockRequestInterceptor;
