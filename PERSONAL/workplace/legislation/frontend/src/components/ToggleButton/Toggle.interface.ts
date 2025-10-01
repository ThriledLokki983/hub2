export interface ToggleProps {
  // Define your props here
  name: string;
  isProjectToggle?: boolean;
  list: { identifier: string; name: string, is_approved: boolean; checked: boolean }[];
  onToggle: (groupname:string, name: string, isChecked: boolean) => void;
  children?: React.ReactNode;
}

export interface ToggleButtonProps {
  // Define your props here
  name: string;
  isProjectToggle?: boolean;
  data: { identifier: string; name: string, is_approved: boolean; checked: boolean };
  onToggle: (groupname:string, name: string, isChecked: boolean) => void;
  children?: React.ReactNode;
}
