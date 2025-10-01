import { UserInterface } from "hooks/interfaces";

export interface AsideProps {
  // Define your props here
  children?: React.ReactNode;
  showGuide?: boolean;
  user: UserInterface;
  onNext?: () => void;
  onPrevious?: () => void;
  [key: string]: any;
}
