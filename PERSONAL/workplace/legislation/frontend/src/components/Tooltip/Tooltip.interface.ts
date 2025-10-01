export interface TooltipProps {
  // Define your props here
  content: string;
  tipPosition?: string;
  maxSized?: boolean;
  children?: React.ReactNode;
  [key:string]: any;
}
