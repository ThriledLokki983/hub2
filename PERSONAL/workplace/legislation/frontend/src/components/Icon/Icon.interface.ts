import { ComponentPropsWithRef } from 'react';
export interface IconProps extends ComponentPropsWithRef<'svg'> {
  name: string;
  color?: string;
  width?: number | string;
  height?: number | string;
  [k: string]: any;
}
