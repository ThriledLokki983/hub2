import { UserInterface } from "hooks/interfaces"

export interface HeaderProps {
  // Define your props here
  isOnboarding: boolean;
  user: UserInterface;
  [key: string]: any;
}
