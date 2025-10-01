export interface DragDropFileProps {
  // Define your props here
  onCancel: () => void;
  reset: () => void;
  uploadFile: (payload: any) => void;
  isSuccess: boolean;
  isError: boolean;
  isPending?: boolean;
  data?: any;
  showToast: any;
  error?: { message: string };
  [key: string]: any;
}

export interface DragDropFileHandle {
  getLegislationData: () => any;
}
