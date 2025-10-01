export interface FilterSortProps {
  // Define your props here
  name?: string;
  label: string;
  id?: string;
  icon?: React.ComponentType;
  scrollOnFocus?: boolean;
  onSearch: (e: any) => void;
  onSort: (e: React.SyntheticEvent, sortValue: string) => void;
  onOptionSelect: (value: string) => void;
}
