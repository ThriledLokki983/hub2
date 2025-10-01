import { UserInterface } from "hooks/interfaces"

export interface OnboardingProps {
  // Define your props here
  isOnboarded: boolean
  user: UserInterface
  [key: string]:any
}

export interface RoleInterface {
  id: string;
  label: string;
  checked: boolean;
}
