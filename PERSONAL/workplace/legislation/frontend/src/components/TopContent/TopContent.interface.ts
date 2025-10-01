import { UserInterface } from "hooks/interfaces";

export interface TopContentProps {
  // Define your props here
  children?: React.ReactNode;
  user?: UserInterface;
  showAlert?: boolean;
  isDetails?: boolean;
  content?: string;
  alertType?: string;
  [key: string]: any;
}
