import { Filter, LegislationTab } from 'hooks/interfaces/legislation.interface';
import { Legislation } from 'hooks/interfaces';
import { UserInterface } from 'hooks/interfaces';
import { AdminData } from 'hooks/interfaces';

export type ComponentProps = {
  user: UserInterface;
  tabs: LegislationTab[];
  query: string;
  filters: Filter[];
  isLoading: boolean;
  onSort: (e: any) => void;
  onRemove: (id: string) => void;
  onClearFilters: (e: any) => void;
  onSearchChange: (e: any) => void;
  onFilterOption: (option: string) => void
  onSideFilterChange: (checked: boolean, filter: Filter, name: string) => void;
} & (AdminProps | ClientProps)

export type ClientProps = {
  type: 'CLIENT'
}

export type AdminProps = {
  type: 'ADMIN'
  legislation: Legislation;
  isEditing: boolean;
  refetchLegislations: () => void;
  onEdit: (e: any, id: string) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export type AdminUnionProps = ComponentProps & AdminProps;

export interface OutletContextProps {
  user: UserInterface
}
