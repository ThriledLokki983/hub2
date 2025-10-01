import { InputProps } from "react-aria-components";

export interface MyInputProps {
  // Define your props here
  name: string;
  label: string;
  subLabel?: string;
  inputValue: string;
  showCheckbox?: boolean;
  required?: boolean;
  isTextArea?: boolean;
  rows?: number;
  onInputChange?: (name: string, newValue: string) => void;
}
