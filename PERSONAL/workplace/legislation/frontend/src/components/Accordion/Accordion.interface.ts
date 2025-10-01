export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  // Define your props here
  accordionId?: string,
  onClick?: (activeKeys: string[], event: React.MouseEvent<HTMLElement>) => void;
  multiple?: boolean;
  activeKeys?: string[];
  defaultActivekeys?: string[];
  children: React.ReactNode,
}
