import React, { ReactElement } from 'react';


export interface BasicLabeledInputProps {
  label: string;
  id: string;
  icon?: IconProps;
  children: ReactElement | ReactElement[];
}

interface IconProps {
  object?: React.ComponentType;
}

export interface LabeledInputProps extends BasicLabeledInputProps {
  [key: string]: any;
}
