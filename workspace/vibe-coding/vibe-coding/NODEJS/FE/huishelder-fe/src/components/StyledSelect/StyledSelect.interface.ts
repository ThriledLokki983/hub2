import { ReactElement, ReactNode } from 'react';

export interface BasicStyledSelectProps {
  children: ReactNode | ReactElement | ReactElement[];
}

export interface StyledSelectProps extends BasicStyledSelectProps {
  [key: string]: ReactNode | ReactElement | ReactElement[] | string | boolean | undefined;
}
