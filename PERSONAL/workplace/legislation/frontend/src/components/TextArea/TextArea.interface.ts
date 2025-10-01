export interface TextAreaProps {
  // Define your props here
  name: string;
  defaultValue: string;
  value?: string;
  rows: number;
  required: boolean;
  maxLength: number;
  // onChange: (e: any) => void;
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}
