import React, { ReactNode, useCallback } from 'react';
import ClassNames from "classnames";
import { useControlled, KEY_VALUES } from '../utils';
import { Slider } from '../slider';
import { Tooltip, TooltipProps } from '../tooltip';
import classNames from 'classnames';

export type ValueType = number | any;
export interface sentimentOption {
    className: string, label?: string
}
export interface RateProps<V = ValueType> {
    type: 'baseline' | 'sentiment' | 'readonly';
    count?: number;
    value?: V;
    defaultValue?: V;
    sentimentOptions?: sentimentOption[];
    slider?: boolean;
    allowClear?: boolean;
    onChange?: (value: V | undefined) => void;
    icon?: string;
    tooltips?: Array<string>;
    tooltipOptions?: TooltipProps;
    className?: string;
    children?: ReactNode;
    style?: React.CSSProperties;
}

const Rate = React.forwardRef<HTMLInputElement, RateProps>((props, ref) => {
    const {
        type = 'baseline',
        count = 5,
        defaultValue = 0,
        icon,
        children,
        value: valueProp,
        sentimentOptions = [
            { className: "icon-emoji-awful sentiment-icon", label: "Awful" },
            { className: "icon-emoji-bad sentiment-icon", label: "Bad" },
            { className: "icon-emoji-okay sentiment-icon", label: "Okay" },
            { className: "icon-emoji-good sentiment-icon", label: "Good" },
            { className: "icon-emoji-great sentiment-icon", label: "Great" }
        ],
        slider,
        tooltips,
        tooltipOptions,
        allowClear = true,
        onChange,
        ...otherProps
    } = props;

    const [value, setValue] = useControlled(valueProp, defaultValue);

    const handleChange = (val: ValueType) => {
        if (type === 'readonly') {
            return;
        }
        let newValue = val;
        if (allowClear) {
            newValue = newValue === value ? 0 : newValue;
        }
        setValue(newValue);
        onChange?.(newValue);
    };

    const handleSliderChange = useCallback(
        (value: ValueType) => {
            setValue(value);
            onChange?.(value);
        },
        [value]
    );

    const handleKeyup = (event: React.KeyboardEvent<HTMLDivElement>, value: ValueType) => {
        if (props.type === 'readonly' || event.key !== KEY_VALUES.ENTER) {
            return;
        }
        handleChange(value);
    };

    const rateWrapperClass = ClassNames("ap-ratings", { "readonly": type === 'readonly' });
    const classNameIcon: string = ClassNames('Appkit4-icon', icon);

    const characterRender = () => {
        if (type !== 'sentiment') {
            const starts = Array.from({ length: count }, (_, i) => i + 1);
            const ratings = starts.map((item, index) => {
                const node = (
                    <div
                        key={index}
                        tabIndex={type === 'readonly' ? undefined : 0}
                        aria-label={`rating scale ${index + 1} out of ${count} stars`}
                        role="button"
                        className={ClassNames("ap-ratings-item", { "selected": value >= item })}
                        onClick={() => { handleChange(item) }}
                        onKeyUp={event => { handleKeyup(event, item) }}
                    >
                        {icon && (
                            <span className={classNameIcon}></span>
                        )}
                        {!icon && children}
                    </div>
                );

                if (!tooltips) return node;
                return <Tooltip key={index} content={tooltips[index]} position='bottom' {...tooltipOptions}>{node}</Tooltip>;
            })
            return (
                <>
                    {ratings}
                    <div className='ap-ratings-sr-only' aria-live="polite">{`${value} out of ${count} stars selected.`}</div>
                </>
            )
        }
    }

    const sentimentRender = () => {
        if (type === 'sentiment' && !slider) {
            const ratings = sentimentOptions.map((item: any, index) => {
                const node = (
                    <div
                        key={index}
                        tabIndex={0}
                        aria-label={item.label}
                        role="button"
                        className={ClassNames("ap-ratings-item", { "selected": value === index + 1 }, `ap-ratings-item-${item.label}`)}
                        onClick={() => handleChange(index + 1)}
                        onKeyUp={e => handleKeyup(e, index + 1)}
                    >
                        <span className={ClassNames(item.className, { "is-macOS": navigator.userAgent.indexOf('Mac OS X') > 0 })}></span>
                    </div>
                );
                if (!item.label && !tooltips) return node;
                return <Tooltip key={index} content={item.label || tooltips && tooltips[index]} position='bottom' {...tooltipOptions}>{node}</Tooltip>;
            })

            return (
                <>
                    {ratings}
                    <div className='ap-ratings-sr-only' aria-live="polite">{`${sentimentOptions[value - 1].label} selected.`}</div>
                </>
            )
        }
    }

    return (
        <div ref={ref} className={rateWrapperClass} {...otherProps}>
            {
                characterRender()
            }
            {sentimentRender()}
            {type === 'sentiment' && slider && (
                <div className="ap-ratings-slider-wrapper">
                    <div className="ap-ratings-slider-top">
                        <div className="ap-ratings-slider-heading">Rate your experience</div>
                        <div className="ap-ratings-slider-label">
                            {value === 1 && (sentimentOptions[0].label)}
                            {value === 2 && (sentimentOptions[1].label)}
                            {value === 3 && (sentimentOptions[2].label)}
                            {value === 4 && (sentimentOptions[3].label)}
                            {value === 5 && (sentimentOptions[4].label)}
                        </div>
                    </div>
                    <div className="ap-ratings-slider">
                        <div className="ap-ratings-slider-sentiment">
                            <span className={classNames("sentiment-icon", {
                                "icon-emoji-awful": value === 1,
                                "icon-emoji-bad": value === 2,
                                "icon-emoji-okay": value === 3,
                                "icon-emoji-good": value === 4,
                                "icon-emoji-great": value === 5,
                                "is-macOS": navigator.userAgent.indexOf('Mac OS X') > 0
                            })}></span>
                        </div>
                        <Slider
                            sliderId="tickSlider"
                            value={value}
                            min={1}
                            max={5}
                            step={1}
                            hasInterval
                            showIntervalLabel={false}
                            showIntervalTick
                            onValueChange={handleSliderChange}
                            valueDesc={['Awful', 'Bad', 'Okay', 'Good', 'Great']}
                        />
                    </div>
                </div>
            )}
        </div>
    );
});

export default Rate;

