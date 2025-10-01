import React from 'react';

type ValueType = string | number;

export interface CheckboxContextProps {
    name?: string;
    value?: ValueType[];
    disabled?: boolean;
    controlled?: boolean;
    onChange?: (value: any, checked: boolean, event: React.SyntheticEvent) => void;
}

export const CheckboxContext = React.createContext<CheckboxContextProps>({});


