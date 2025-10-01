import type {ListBoxItemProps, SelectProps, ValidationResult} from 'react-aria-components';

  export interface MySelectProps<T extends object>
  // Define your props here
  extends Omit<SelectProps<T>, 'children'> {
  label?: string;
  title?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items: Iterable<T>;
  children?: React.ReactNode | ((item: T) => React.ReactNode);
}
