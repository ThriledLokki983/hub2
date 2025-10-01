export interface BackLinkProps {
  // Define your props here
  to?: To;
  children?: React.ReactNode;
  onClick?: () => void;
  showIcon?: boolean;
  [key: string]: any;
}

type To = string | number | any;
