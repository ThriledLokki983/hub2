import { UserInterface } from "hooks/interfaces";

export interface TourProps {
  // Define your props here
  user?: UserInterface;
  content?: string;
  firstButton?: string;
  secondButton?: string;
  onNext: (e: React.SyntheticEvent) => void;
  onPrevious: (e: React.SyntheticEvent) => void;
  [key: string]: any;
}
