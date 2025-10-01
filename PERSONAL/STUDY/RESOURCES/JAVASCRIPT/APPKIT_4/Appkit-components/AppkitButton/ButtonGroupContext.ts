import React from 'react';

export interface ButtonGroupContextProps {
  disabled?: boolean;
  compact?: boolean;

}

const ButtonGroupContext = React.createContext<ButtonGroupContextProps | null>(null);

export default ButtonGroupContext;
