import { Filter, RoleSpecificData } from "hooks/interfaces/legislation.interface";

export interface FiltersProps {
  // Define your props here
  children?: React.ReactNode;
  filters: Filter[];
  userRoles?: Omit<RoleSpecificData, 'label'>[];
  onSideFilterChange?: (checked: boolean, filter: Filter, name: string) => void;
}
