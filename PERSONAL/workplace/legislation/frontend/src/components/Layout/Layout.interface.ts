import { UserInterface } from 'hooks/interfaces';
import { ReactElement, ReactNode } from 'react';


export interface LayoutProps {
    children?: ReactNode | ReactElement | ReactElement[];
}

export interface OutletContextProps {
    user: UserInterface
}
