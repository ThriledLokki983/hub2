import { DatePickerProps, DateValue, ValidationResult } from "react-aria-components";

export interface MyDatePickerProps<T extends DateValue> extends DatePickerProps<T> {
  // Define your props here
  name: string;
  label: string;
  subLabel?: string;
  description?: string;
  showCheckbox?: boolean;
  onInputChange?: (name: string, value: string) => void;
  errorMessage?: string | ((validation: ValidationResult) => string);
  variation?: "transparent" | "alternate";
  [key: string]: any;
}
