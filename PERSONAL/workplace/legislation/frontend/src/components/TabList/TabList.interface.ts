import { AdminData, UserInterface } from 'hooks/interfaces';

export interface TabListProps {
  // Define your props here
  entries: any[];
  query: string;
  user: UserInterface;
  showSearch: boolean;
  isEditing?: boolean;
  isLoading?: boolean;
  onSearch: (e: any) => void;
  onDataSort: (e: React.SyntheticEvent) => void;
  onFilterOption: (option: string) => void
  onTabClick?: (e: any) => void;
  selectedTab?: number;
  setSelectedTab?: (num: number) => void;
  distribute?: boolean;
  children: React.ReactNode;
  variant: "admin-tabs" | "client-tabs" | "navigator" | "project-tabs"
  [key: string]: any;
}
