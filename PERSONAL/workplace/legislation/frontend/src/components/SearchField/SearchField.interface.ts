export interface SearchFieldProps {
  // Define your props here
  name: string;
  label: string;
  id: string;
  icon?: React.ComponentType;
  onSearch: (e: any) => void;
  scrollOnFocus?: boolean;
}
