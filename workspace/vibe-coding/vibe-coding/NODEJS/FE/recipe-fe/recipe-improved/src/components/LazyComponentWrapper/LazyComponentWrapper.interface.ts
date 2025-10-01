import { ReactNode } from 'react';

export interface LazyComponentWrapperProps {
  /**
   * The component or components to be lazy-loaded
   */
  children: ReactNode;

  /**
   * Custom fallback component to display while loading
   * If not provided, defaults to FetchLoader
   */
  fallback?: ReactNode;
}
