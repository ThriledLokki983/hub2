export interface SearchFilterProps {
  // Define your props here
  id: string;
  onSearch: (e: React.SyntheticEvent) => void;
  onDataSort: (e: React.SyntheticEvent) => void;
  onFilterOptionSelect: (option: string) => void;
  [key: string]: any;
}
