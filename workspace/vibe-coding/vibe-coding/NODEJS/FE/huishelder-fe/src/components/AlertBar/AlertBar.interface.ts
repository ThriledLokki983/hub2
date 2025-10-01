import React from 'react';

export interface BasicAlertBarProps {
  hidden?: boolean;
  variation: keyof IconMapProps;
  children: React.ReactNode;
}

export interface AlertBarProps extends BasicAlertBarProps {
  [key: string]:
    | React.HTMLAttributes<HTMLDivElement>[keyof React.HTMLAttributes<HTMLDivElement>]
    | boolean
    | string
    | React.ReactNode;
}

export interface IconMapProps {
  notice: string;
  warning: string;
  error: string;
  success: string;
}
