export interface SingleCheckboxProps {
  // Define your props here
  name?: string;
  value?: string;
  label?: string;
  labelVisible?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (e:  React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}
