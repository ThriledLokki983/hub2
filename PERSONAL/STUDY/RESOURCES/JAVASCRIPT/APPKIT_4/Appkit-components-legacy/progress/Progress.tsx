import React, { useRef, forwardRef, useState } from 'react';
import ClassNames from "classnames";
import { KEY_VALUES, useControlled } from '../utils';
import classNames from 'classnames';

interface IProgressProps {
    className?: string,
    style?: React.CSSProperties,
    defaultActiveIndex?: number;
    activeIndex?: number,
    space?: number,
    steps: Array<string>,
    orientation?: string,
    readonly?: boolean,
    onActiveIndexChange?: (i: number) => void;
}

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement>,
    IProgressProps { }

const Progress = forwardRef<HTMLDivElement, ProgressProps>((props, ref) => {
    let {
        activeIndex: activeIndexProp,
        defaultActiveIndex = 0,
        space = 84,
        steps = [],
        orientation = 'horizontal',
        readonly = false,
        children,
        style = {},
        className,
        onActiveIndexChange
    } = props;

    const [activeIndex, setActiveIndex] = useControlled(activeIndexProp, defaultActiveIndex);
    const progressRef = useRef<HTMLDivElement>(null);

    const renderHeader: any = () => {
        let results: any[] = [];
        steps.forEach((step: any, index: any) => {
            if (!step) {
                return;
            }
            let currentIndex = activeIndex < steps.length ? activeIndex : (steps.length - 1);

            const textStyle: React.CSSProperties = index === 0
                ? orientation == 'horizontal'
                    ? { 'marginLeft': '-8px' }
                    : { 'marginTop': '-8px', 'whiteSpace': 'pre' }
                : (index > 0 && index < (steps.length - 1))
                    ? orientation == 'horizontal'
                        ? { 'transform': 'translateX(-50%)' }
                        : { 'transform': 'translateY(-50%)', 'whiteSpace': 'pre' }
                    : orientation == 'horizontal'
                        ? { 'transform': 'translateX(-100%)', 'marginLeft': '6px' }
                        : { 'transform': 'translateY(-100%)', 'marginTop': '8px', 'whiteSpace': 'pre' };


            const itemClick = (event: React.MouseEvent) => {
                if (readonly) {
                    event.preventDefault();
                    return;
                }
                setActiveIndex(index);
                onActiveIndexChange?.(index);
            };

            const isActive = () => {
                return index <= currentIndex;
            };

            const classTextNames = classNames('', {
                'active': isActive(),
                'ap-font-medium': isActive()
            });

            results.push(
                <li key={index}>
                    <div role="tab"
                        id={'progress-' + step}
                        className="ap-progress-mark-text"
                        style={textStyle}
                        aria-selected={index === currentIndex}
                        aria-controls={'panel-' + step}
                        aria-hidden={readonly && (index !== currentIndex) ? true : false}
                        tabIndex={index === currentIndex ? 0 : -1}
                        onClick={itemClick}
                    >
                        <span className={classTextNames}>{step}</span>
                    </div>
                </li>

            );
        });

        return results;
    };

    const renderContent: any = () => {
        let results: any[] = [];

        steps.forEach((step: any, index: number) => {
            if (!step) {
                return;
            }
            results.push(
                <div key={index}
                    hidden={index !== activeIndex}
                    id={'panel-' + step}
                    aria-labelledby={'progress-' + step}>
                </div >
            );
        });
        return results;
    };

    const classProgressNames = ClassNames('ap-progress', className, {
        'is-horizontal': orientation === 'horizontal',
        'is-vertical': orientation === 'vertical',
        'ap-progress-readonly': readonly
    });

    const progressStyle: React.CSSProperties = space && steps.length
        ? orientation == 'horizontal'
            ? Object.assign({ 'width': `${space * (steps.length - 1)}px` }, style)
            : Object.assign({ 'height': `${space * (steps.length - 1)}px` }, style)
        : style;

    const progressBarStyle: React.CSSProperties = orientation == 'horizontal'
        ? { 'width': `${activeIndex / (steps.length - 1) * 100}%` }
        : { 'height': `${activeIndex / (steps.length - 1) * 100}%` };

    const markStyle = () => {
        let length = steps.length;
        let wrapperStyle = {};
        if (length && length > 1) {
            let offset = 1 / (length - 1) * 100;
            let gridColumn = '';
            for (let i = 0; i < length; i++) {
                gridColumn += ' 1fr';
            }

            if (orientation === 'horizontal')
                wrapperStyle = { 'width': `calc(100% + ${offset}%)`, 'gridTemplateColumns': gridColumn };
            else
                wrapperStyle = { 'height': `calc(100% + ${offset}%)`, 'gridTemplateRows': gridColumn };
        }

        return wrapperStyle;
    }

    const onKeyDown = (event: React.KeyboardEvent) => {

        const stepNum = steps.length;
        const stepsEle = progressRef.current?.querySelectorAll('.ap-progress-mark-text');
        if (stepNum === 0 || readonly || !stepsEle || stepsEle.length === 0) return;
        const key = event.key;
        let nextFocusIndex = activeIndex;
        const target = (event.target as any);
        if (key === KEY_VALUES.RIGHT) {
            event.preventDefault();
            if (activeIndex < stepNum - 1) {
                nextFocusIndex = activeIndex + 1;
                target.parentElement.nextElementSibling?.firstElementChild?.focus();
            } else if (activeIndex === stepNum - 1) {
                nextFocusIndex = 0;
                target.parentElement.parentElement.firstElementChild?.firstElementChild?.focus();
            }
        } else if (key === KEY_VALUES.LEFT) {
            event.preventDefault();
            if (activeIndex > 0 && activeIndex <= stepNum - 1) {
                target.parentElement.previousElementSibling?.firstElementChild?.focus();
                nextFocusIndex = activeIndex - 1;
            } else if (activeIndex === 0) {
                target.parentElement.parentElement.lastElementChild?.firstElementChild?.focus();
                nextFocusIndex = stepNum - 1;
            }
        }
        if (key === KEY_VALUES.LEFT || key === KEY_VALUES.RIGHT) {
            setActiveIndex(nextFocusIndex);
            onActiveIndexChange?.(nextFocusIndex);
            // (stepsEle[nextFocusIndex] as HTMLElement)?.focus();
        }
    }

    return (
        <div className={classProgressNames} style={progressStyle}>
            <div className="ap-progress-bar" style={progressBarStyle}></div>
            <ul
                //@ts-ignore
                ref={progressRef}
                role="tablist"
                className="ap-progress-mark"
                style={markStyle()}
                onKeyDown={onKeyDown}
            >
                {renderHeader()}
            </ul>
            {renderContent()}
        </div>
    );
})

Progress.displayName = 'Progress';

export default Progress;