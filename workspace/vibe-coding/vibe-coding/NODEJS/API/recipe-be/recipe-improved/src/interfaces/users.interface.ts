export interface User {
  id?: string; // Changed from number to string for UUID
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  full_name?: string;
  email: string;
  password: string;
  image?: string;
  title?: string;
  region?: string;
  created_at?: Date;
  updated_at?: Date;
}
