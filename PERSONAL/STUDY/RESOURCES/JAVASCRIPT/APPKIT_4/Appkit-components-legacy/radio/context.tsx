import * as React from 'react';

import { RadioValueType } from './RadioGroup';

export interface RadioContextProps {
    name?: string;
    value?: RadioValueType | null;
    disabled?: boolean;
    readOnly?: boolean;
    onChange?: (value: RadioValueType | undefined, event: React.SyntheticEvent) => void;
}

export const RadioContext = React.createContext<RadioContextProps>({});
