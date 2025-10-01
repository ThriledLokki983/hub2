export interface AccordionItemProps {
  // Define your props here
  itemKey: string,
  expanded?: boolean,
  children?: React.ReactNode,
  templateHeader?: () => React.ReactNode,
  onRemove?: (e: any) => void,
  onClickEvent?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLLIElement>, key?: string) => void,
  title?: string,
  icon?: any,
  className?: string,
  accordionHeaderId?: string,
  excludeElementToToggle?: string,
  toggleFromBody?: boolean
  toggleFromHeaderIconOnly?: boolean,
  inclElementToToggle?: string
  isLarge?: boolean;
  description?: string;
  contentTitle?: string;
  query?: string;
  isEmpty?: boolean;
  isNew?: boolean;
}
