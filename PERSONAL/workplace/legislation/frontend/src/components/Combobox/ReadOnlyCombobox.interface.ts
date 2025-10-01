export interface ReadOnlyComboboxProps {
  // Define your props here
  options: Option[];
  name: string;
  id: string;
  onSelect: (selectedValue: string) => void;
}

type Option = string;
