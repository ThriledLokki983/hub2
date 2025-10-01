export interface RadioGroupProps {
  // Define your props here
  label: string;
  roles: any[];
  onRadioChange: (name: string, selectedValue: string) => void;
  [key: string]: any
}
