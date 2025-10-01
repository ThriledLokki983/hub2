interface Tab {
  label: string;
  isError: boolean;
}

export interface TabsProps {
  // Define your props here
  options: Tab[];
  tabSelected?: number;
  align?: 'left' | 'auto' | 'right';
  type?: 'pages' | 'tabs';
  showLastTabIcon?: boolean;
  onTabClick?: (index: string) => void;
  children?: React.ReactNode;
}
