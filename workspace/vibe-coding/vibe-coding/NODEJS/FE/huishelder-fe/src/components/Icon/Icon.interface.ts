import * as PhosphorIcons from 'phosphor-react';

export interface IconProps {
  name?: string;
  color?: string;
  width?: number | string;
  height?: number | string;
  phosphor?: keyof typeof PhosphorIcons;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  className?: string;
}
