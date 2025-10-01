import { ReactNode } from 'react';

export interface ProfileDropdownProps {
  isLoggedIn: boolean;
  userName?: string;
  userEmail?: string;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  children?: ReactNode;
}

export interface DropdownItemProps {
  icon?: string;
  label: string;
  onClick?: () => void;
  to?: string;
}
