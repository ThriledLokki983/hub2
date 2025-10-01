import React from 'react';
import { JobRole } from './legislation.interface';

type UserProfile = {
  id: string | number;
  identifier: string;
  email: string;
  groups: string[];
  client: {
    identifier: string;
    name: string;
  }
  first_name: string;
  initials: string;
  is_active: boolean;
  is_onboarded: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_tester: boolean;
  has_access: boolean;
  job_role_list: JobRole[];
  last_name: string;
  marked_for_deletion: boolean;
  marked_for_deletion_count: number;
  user_permissions: string[];
  username: string;
  name: string;
}

interface UserInterface {
  id?: string | number;
  authenticated: boolean;
  is_admin: boolean,
  can_approve: boolean;
  is_approver: boolean;
  is_superuser: boolean;
  is_file_uploader: boolean;
  is_preparer: boolean;
  show_landing_tour: boolean;
  show_guided_tour: boolean;
  show_aside_tour: boolean;
  show_roles_tour: boolean;
  show_filters_tour: boolean;
  show_content_tour: boolean;
  profile: UserProfile;
}

interface UserDataInterface {
  user: UserInterface;
  login: () => void;
  logout: () => void;
  updateUserProfileData: (userData: Partial<UserInterface>) => void;
  clearCsrfToken: () => void;
}

type ContextProps = {
  children: React.ReactNode;
};

export type {
  ContextProps,
  UserInterface,
  UserDataInterface,
  UserProfile,
}
