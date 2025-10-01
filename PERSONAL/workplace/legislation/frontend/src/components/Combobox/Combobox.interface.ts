export interface ComboboxProps {
  // Define your props here
  name: string;
  label: string;
  defaultValue: string;
  options: string[]
  showLabel?: boolean;
  icon?: React.ComponentType;
  onValueChange: (e: any) => void;
  [key: string]: any;
}
