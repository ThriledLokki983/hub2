export interface DialogProps {
  // Define your props here
  id?: string;
  title?: string;
  cancelText?: string;
  submitText?: string;
  submitButtonType?: "button" | "submit" | "reset";
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  children: React.ReactNode;
  [key: string]: any;
}
