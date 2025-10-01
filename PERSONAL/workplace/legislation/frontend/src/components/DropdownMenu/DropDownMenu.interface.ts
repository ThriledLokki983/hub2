export interface DropDownMenuProps {
  // Define your props here
  type: string;
  openDelay: number;
  onToggle: (e: any) => void;
  children: React.ReactNode;
  buttonRef: any | null;
}
