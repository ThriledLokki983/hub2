import React, { forwardRef } from 'react';


interface ITabProps {
    className?: string,
    active?: boolean,
    style?: React.CSSProperties,
    children?: React.ReactNode,
    label?: string,
    icon?: string,
    disabled?: boolean,
    tabId?: string
}

export interface TabProps extends React.HTMLAttributes<HTMLDivElement>,
    ITabProps { }

const Tab = forwardRef<HTMLDivElement, TabProps>((props, ref) => {
    const {
        style = {},
        className,
        children,
        active,
        label,
        disabled = false,
        tabId = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now()
    } = props;
    return (
        <div
            ref={ref}
            role="tabpanel"
            aria-labelledby={`tab${label ? '-' + label : ''}-${tabId}`}
            className={className}
            hidden={!active}
            style={style}
            id={`panel${label ? '-' + label : ''}-${tabId}`}
        >
            {children}
        </div>
    );
})

export default Tab