export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  ADVISOR = 'advisor',
}

export interface PhotoVariant {
  url: string;
  width: number;
  height: number;
  format: string;
  size: number; // File size in bytes
}

export interface PhotoMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  aspectRatio?: number;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  role: UserRole;
  language_preference: string;
  photo_url?: string;
  photo_filename?: string;
  photo_mimetype?: string;
  photo_variants?: Record<string, PhotoVariant>;
  photo_metadata?: PhotoMetadata;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  is_active: boolean;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  role: UserRole;
  language_preference: string;
  photo_url?: string;
  photo_filename?: string;
  photo_mimetype?: string;
  photo_variants?: Record<string, PhotoVariant>;
  photo_metadata?: PhotoMetadata;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}
