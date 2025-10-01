export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  type: ToastType;
  title: string;
  message: string;
  active?: boolean;
  persistent?: boolean;
}

export type URLLocation = string & Location;
