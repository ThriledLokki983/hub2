import React, { useRef, forwardRef, useState } from 'react';
import ClassNames from "classnames";
import { KEY_VALUES, useControlled } from '../utils';
import { Tooltip } from '../tooltip';

interface ISteppersProps {
    className?: string;
    style?: React.CSSProperties;
    orientation?: string;
    space?: number;
    readonly?: boolean;
    distance?: number;
    activeIndex?: number;
    hasTooltip?: boolean;
    defaultActiveIndex?: number;
    onActiveIndexChange?: (i: number) => void;
}

export interface SteppersProps extends React.HTMLAttributes<HTMLDivElement>,
    ISteppersProps { }

const Steppers = forwardRef<HTMLDivElement, SteppersProps>((props, ref) => {
    const {
        orientation = 'horizontal',
        space = 84,
        readonly = false,
        distance = 4,
        activeIndex,
        defaultActiveIndex = 0,
        children,
        style = {},
        className,
        hasTooltip = true,
        onActiveIndexChange,
        ...restProps
    } = props;
    const stepperRef = useRef<HTMLDivElement>(null);
    const [focusIndex, setFocusIndex] = useControlled(activeIndex, defaultActiveIndex);

    const selectStepper = (index: number) => {
        if (readonly) return;
        let skipSpace = 0;
        const steps = stepperRef.current?.querySelectorAll('.ap-progress-stepper-bar-inner');
        if (!readonly && steps && focusIndex < steps.length) {
            if (focusIndex > index) {
                skipSpace = focusIndex - index;
                if (skipSpace >= 2) {
                    for (let k = focusIndex; k > index; k--) {
                        (steps[k] as HTMLElement).style.transitionDelay = `${(focusIndex - k) * 0.15}s`;
                    }
                }
            } else if (focusIndex < index) {
                skipSpace = index - focusIndex;
                if (skipSpace >= 2) {
                    for (let j = focusIndex + 1; j <= index; j++) {
                        (steps[j] as HTMLElement).style.transitionDelay = `${(j - focusIndex) * 0.15}s`;
                    }
                }
            }
            onActiveIndexChange?.(index);
            setFocusIndex(index);
            if (skipSpace >= 2) {
                setTimeout(() => {
                    for (let i = 0; i < steps.length; i++) {
                        (steps[i] as HTMLElement).style.transitionDelay = 'unset';
                    }
                }, skipSpace * 150);
            }
        }
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (readonly) return;
        let keyName = event.key;
        const stepNodes = stepperRef.current?.querySelectorAll('.ap-progress-stepper');
        if (!stepNodes || (stepNodes.length < 2)) return;
        let cuttentIndex = focusIndex || 0;
        switch (keyName) {
            case KEY_VALUES.LEFT:
            case KEY_VALUES.UP:
                event.preventDefault();
                cuttentIndex--;
                if (cuttentIndex < 0) {
                    cuttentIndex = stepNodes.length - 1;
                }
                (stepNodes[cuttentIndex] as HTMLElement).focus();
                setFocusIndex(cuttentIndex);
                break;
            case KEY_VALUES.RIGHT:
            case KEY_VALUES.DOWN:
                event.preventDefault();
                cuttentIndex++;
                if (cuttentIndex > stepNodes.length - 1) {
                    cuttentIndex = 0;
                }
                (stepNodes[cuttentIndex] as HTMLElement).focus();
                setFocusIndex(cuttentIndex);
                break;
            case KEY_VALUES.ENTER:
            case KEY_VALUES.SPACE:
                event.preventDefault();
                selectStepper?.(cuttentIndex);
                break;
        }
    };

    const onBtnFocus = (index: number) => {
        if (index === activeIndex)
            setFocusIndex(index);
    };

    const renderHeader: any = () => {
        let results: any[] = [];
        React.Children.forEach(children, (child: any, index: any) => {
            if (!child) {
                return;
            }

            const elementRef = React.useRef(null);
            const { label, status = 'normal', trigger = 'hover', hideTooltipOnBlur = true } = child.props;

            const stepperStyle: React.CSSProperties = orientation === 'horizontal' ? { width: `${space}px` } : { height: `${space}px` };

            const classBarInnerNames = ClassNames("ap-progress-stepper-bar-inner", {
                "bar-active": index <= focusIndex,
                "bar-warning": (index <= focusIndex) && (status === "warning")
            });

            const classStepperBtnNames = ClassNames(`ap-progress-stepper-btn `, {
                "normal-step-selected": !readonly && (status === "normal"),
                "warning-step-selected": (index <= focusIndex) && !readonly && (status === "warning"),
                "warning-step-readonly": (index <= focusIndex) && readonly && (status === "warning"),
                "upcoming-step-selected": index > focusIndex && !readonly
            });

            const getIcon = (status: string, index: number) => {
                if (index < focusIndex) {
                    return status === 'normal' ? 'circle-checkmark' : 'circle-warning';
                } else if (index === focusIndex) {
                    return status === 'normal' ? 'circle-radio' : 'circle-warning';
                } else {
                    return 'circle-empty';
                }
            };

            const classIconNames = ClassNames(`Appkit4-icon icon-${getIcon(status, index)}-outline`, {
                "normal-status": (index <= focusIndex) && (status === 'normal'),
                "warning-status": (index <= focusIndex) && (status === 'warning'),
                "upcoming-status": index > focusIndex
            });

            const classBtnTextNames = ClassNames("ap-progress-stepper-btn-text", {
                "upcoming-status": index > focusIndex,
                "warning-status": (index <= focusIndex) && (status === 'warning')
            });

            let ariaStatus;
            let ariaLabel = label;
            if ((index <= focusIndex) && (status === 'warning')) {
                ariaStatus = 'warning';
            } else if (index > focusIndex) {
                ariaStatus = 'upcoming';
            } else if (index === focusIndex) {
                ariaStatus = 'current';
            } else if (index < focusIndex) {
                ariaStatus = 'completed';
            }
            if (!ariaLabel) {
                ariaLabel = `step ${index + 1}`;
            }

            results.push(
                <div
                    key={index}
                    id={`stepper-${label ? label : ''}`}
                    className={"ap-progress-stepper ap-progress-stepper-btn-tooltip-" + index}
                    style={stepperStyle}
                    role="tab"
                    aria-describedby={'tooltipDesc' + index}
                    tabIndex={index === activeIndex ? 0 : -1}
                    aria-selected={index === activeIndex}
                    aria-controls={`panel-${label}`}
                    aria-label={`${ariaLabel} ${ariaStatus}`}
                    onKeyDown={onKeyDown}
                    onClick={() => { selectStepper?.(index) }}
                    onFocus={() => { onBtnFocus?.(index) }}
                >
                    <div className="ap-progress-stepper-bar">
                        <span className={classBarInnerNames}></span>
                    </div>
                    <div className={classStepperBtnNames}>
                        <span className={classIconNames} aria-hidden></span>
                        <span className={classBtnTextNames}>
                            {label}
                        </span>
                    </div >

                    {hasTooltip &&
                        <Tooltip
                            id={'tooltipDesc' + index}
                            target={label ? `.ap-progress-stepper-btn-tooltip-${index}` : ''}
                            distance={distance}
                            position={orientation === 'horizontal' ? 'bottom' : 'right'}
                            content={label ? label : ''}
                            trigger={trigger}
                            hideTooltipOnBlur={hideTooltipOnBlur}
                        >

                        </Tooltip>
                    }
                </div >
            );
        });

        return results;
    };

    const renderContent: any = () => {
        let results: any[] = [];

        React.Children.forEach(children, (child: any, index) => {
            if (!child) {
                return;
            }
            const { label, status } = child.props;
            const active: boolean = focusIndex === index;
            results.push(
                React.cloneElement(child, {
                    active,
                    status,
                    label,
                    key: index,
                    ...child.props
                })
            );
        });
        return results;
    };

    const classWrapperNames = ClassNames("ap-progress-stepper-wrapper", className, {
        "is-vertical-stepper": orientation === 'vertical'
    });

    return (
        <div ref={ref} className="ap-progress-stepper-container" {...restProps}>
            <div
                ref={stepperRef}
                className={classWrapperNames}
                style={style}
                role="tablist"
                aria-label="progress stepper"
            >
                {renderHeader()}
            </div>
            <div className="ap-progress-stepper-content">
                {renderContent()}
            </div>
        </div>
    );
})


export default Steppers