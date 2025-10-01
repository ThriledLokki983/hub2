export interface CustomSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
  options: CustomSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  name?: string;
}
