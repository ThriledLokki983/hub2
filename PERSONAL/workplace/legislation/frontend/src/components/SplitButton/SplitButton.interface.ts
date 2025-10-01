export interface SplitButtonProps {
  // Define your props here
  primaryType: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'transparent';
  primaryText: string;
  primaryAction: (e: any) => void;
  children: React.ReactNode;
  [key: string]: any;
}
