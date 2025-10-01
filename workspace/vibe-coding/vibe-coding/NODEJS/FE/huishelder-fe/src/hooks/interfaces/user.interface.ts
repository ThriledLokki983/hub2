import React from 'react';

/**
 * User profile interface
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  role: string;
  language_preference: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_active: boolean;
  avatar_url?: string; // Keep this for UI even if not in DB schema
}

/**
 * User settings interface
 */
export interface UserSettings {
  notifications?: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    marketingEmails: boolean;
  };
  privacy?: {
    showProfile: boolean;
    showContactInfo: boolean;
  };
}

/**
 * User interface
 */
export interface UserInterface {
  /**
   * Authentication status
   */
  authenticated: boolean;

  /**
   * Authentication token
   */
  token?: string;

  /**
   * User profile information
   */
  profile: UserProfile;
}

/**
 * User data interface
 */
export interface UserDataInterface {
  user: UserInterface | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Context properties interface
 */
export interface ContextProps {
  children: React.ReactNode;
}
