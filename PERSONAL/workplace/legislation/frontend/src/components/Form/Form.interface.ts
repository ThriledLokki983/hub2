import { FormProps } from "react-aria-components";

export interface MyFormProps extends FormProps {
  // Define your props here
  id?: string;
  children: React.ReactNode;
  disabledFields?: string[];
  hiddenGroups?: string[];
  onSubmit: (e: any) => void;
  onChange: (e: any) => void;
  [key: string]: any;
}
