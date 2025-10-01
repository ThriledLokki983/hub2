import React, { forwardRef } from 'react';


interface IStepperProps {
    className?: string,
    style?: React.CSSProperties,
    active?: boolean,
    children?: React.ReactNode,
    label?: string,
    status?: string,
    trigger?: string,
    hideTooltipOnBlur?: boolean
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement>,
    IStepperProps { }

const Stepper = forwardRef<HTMLDivElement, IStepperProps>((props, ref) => {
    const {
        style = {},
        className,
        children,
        active,
        label,
        status,
        trigger,
        hideTooltipOnBlur
    } = props;

    return (
        <div ref={ref}
            className={className}
            style={style}
            hidden={!active}
            role="tabpanel"
            id={`panel-${label ? label : ''}`}
            aria-labelledby={`stepper-${label ? label : ''}`}>
            {children}
        </div>
    );
})

export default Stepper