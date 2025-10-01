import React, { useRef, forwardRef, useState, useCallback, useMemo, useEffect, useLayoutEffect } from 'react';
import ClassNames from "classnames";
import { KEY_VALUES, useControlled } from '../utils';

export type SliderValue = number[] | number;

export interface SliderProps {
    className?: string,
    style?: React.CSSProperties,
    disabled?: boolean,
    min?: number,
    max?: number,
    orientation?: string,
    step?: number,
    range?: boolean,
    tabIndex?: number,
    hasInterval?: boolean,
    showIntervalTick?: boolean,
    showIntervalLabel?: boolean,
    precision?: number,
    sliderId?: string,
    valueDesc?: string[],
    value?: SliderValue | null,
    defaultValue?: SliderValue | null,
    onValueChange?: (i: any) => void
}

// export type SliderProps = ISliderProps & React.HTMLAttributes<HTMLDivElement>

export interface SliderHandler {
    offset: number | null;
    value: number | null;
    active: boolean;
}

export interface SliderTrackStyle {
    bottom?: string | null;
    height?: string | null;
    left?: string | null;
    right?: string | null;
    width?: string | null;
    visibility?: string;
}

const Slider = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {

    const {
        sliderId,
        tabIndex: tabindexProp = 0,
        className,
        style,
        min = 0,
        max = 100,
        step = 1,
        range,
        precision,
        value: valueProp,
        defaultValue,
        hasInterval,
        showIntervalTick,
        disabled = false,
        valueDesc = [],
        showIntervalLabel = true,
        orientation = 'horizontal',
        onValueChange
    } = props;

    let scale: number[] = [];
    let handleValue: number | any;
    let currentHandleIndex: number = 0;
    let track: { offset: null | number; length: null | number } = { offset: null, length: null };
    let trackStyle: React.CSSProperties = {};
    let stepDigits: number = 0;
    let lastValue: any;
    let lastWriteValue: any;
    let dragging: boolean = false;
    let touching: boolean = false;
    let sliderHandleClick: boolean = false;
    let dragListener: any;
    let touchMoveListener: any;
    let touchEndListener: any;
    let mouseupListener: any;
    let initX: number | any;
    let barWidth: number | any;
    let startHandleValue: any;
    let handleValues: number[] = [];
    let startx: number | any;
    let lastOptionLength: any;
    const sliderRef = useRef<HTMLDivElement>(null);
    const [value, setValue] = useControlled(valueProp, defaultValue);
    const [tabIndex, setTabIndex] = useState(disabled ? -1 : tabindexProp);

    useEffect(() => {
        /**
         * Adjust the position of slider handle
         */
        const silderBallWidth = sliderRef.current?.querySelector('.ap-slider-handle')?.getBoundingClientRect().width || 16;
        const sliderMarkTexts = sliderRef.current?.querySelectorAll('.ap-slider-mark-text');
        sliderMarkTexts?.forEach((o: any, index: any) => {
            if (index === 0 || index === sliderMarkTexts.length - 1)
                return;
            const sliderTextWidth = o.getBoundingClientRect().width;
            const leftStyle = o.style.left;
            if (sliderTextWidth > silderBallWidth) {
                o.style.left = `calc(${leftStyle} - ${(sliderTextWidth - silderBallWidth) / 2}px)`;
            } else {
                o.style.left = `calc(${leftStyle} + ${(silderBallWidth - sliderTextWidth) / 2}px)`;
            }
        });

        stepDigits = countDecimals(step);

        if (hasInterval && showIntervalLabel) {
            const optionEles = sliderRef?.current?.querySelectorAll('.ap-slider-mark-text');
            const lastOptionEle = optionEles![optionEles!.length - 1] as HTMLElement;
            const railEleRight = sliderRef?.current?.querySelector('.ap-slider-rail')?.getBoundingClientRect().right;
            const markEleWidth = sliderRef?.current?.querySelector('.ap-slider-mark')?.getBoundingClientRect().width;
            // lastOptionLength = `calc(100% - ${Math.ceil(lastOptionEle.getBoundingClientRect().right + markEleWidth! - railEleRight!)}px)`;
            lastOptionLength = `calc(100% - ${Math.ceil(lastOptionEle.getBoundingClientRect().width) - 16}px)`;
            lastOptionEle.style.left = lastOptionLength;
        }

        if (hasInterval && showIntervalTick) {
            const sliderTickEles = sliderRef?.current?.querySelectorAll('.ap-slider-mark-tick');
            sliderTickEles!.forEach((o: any, p: any) => {
                const tickWidth = o.getBoundingClientRect().width;
                if (p === 0) {
                    o.style.left = '0';
                } else if (p === sliderTickEles!.length - 1) {
                    o.style.left = '100%';
                } else {
                    o.style.left = `calc(${p / (sliderTickEles!.length - 1) * 100}%`;
                }
                o.style.top = `-${(tickWidth - 2) / 2}px`;
            });
        }

        return () => {
            document.removeEventListener('mousemove', mousemoveEvent);
            document.removeEventListener('mouseup', mousEvent);
            document.removeEventListener('touchmove', touchmoveEvent);
            document.removeEventListener('touchend', touchendEvent);
        }
    }, []);

    const countDecimals = (num: any) => {
        if (Math.floor(num) === num) return 0;
        return num.toString().split(".")[1].length || 0;
    }

    const handles: SliderHandler[] = useMemo(() => {
        const amount = range ? 2 : 1;
        return Array(amount)
            .fill(0)
            .map(() => ({ offset: null, value: null, active: false }));
    }, [range])


    const resetInterval = () => {
        if (hasInterval) {
            if ((!min && min !== 0) || !max || !step) return;
            scale = [];
            for (let i = min!; i <= max; i += step) {
                scale.push(i);
            }
            handleValue = (scale.findIndex(el => el === value) / (scale.length - 1)) * 100;
            if (handleValue === -100) {
                handleValue = 0;
                setValue(scale[0]);
                onValueChange?.(scale[0]);
            }
        }
    };

    const isValueRange = (value: SliderValue | any): value is number[] => {
        if (value instanceof Array) {
            return value.length === 2;
        } else {
            return false;
        }
    }

    const getDecimalsCount = (value: number): number => {
        if (value && Math.floor(value) !== value) {
            return value.toString().split(".")[1].length || 0;
        }
        if (value && precision && precision > 0) {
            return precision;
        }
        return 0;
    }

    const getNormalizedValue = (val: any): number => {
        let decimalsCount = getDecimalsCount(step as number);
        if (decimalsCount > 0) {
            return +val.toFixed(decimalsCount);
        } else {
            return Math.floor(val);
        }
    }

    const ensureNumberInRange = (num: number, min: number, max: number): number => {
        if (isNaN(num) || num < min) {
            return min;
        } else if (num > max) {
            return max;
        } else {
            return num;
        }
    }

    const formatValue = (value: SliderValue | any): SliderValue => {
        if (!value && value !== 0) {
            return range ? [min, max] : min;
        } else {
            return isValueRange(value)
                ? value.map(val => ensureNumberInRange(val, min!, max!))
                : ensureNumberInRange(value, min!, max!);
        }
    }

    const valueToOffset = (value: number): number => {
        return ((value - min) / (max - min)) * 100;
    }

    const getValueToOffset = (value?: SliderValue | any): SliderValue => {
        let normalizedValue = value;
        return isValueRange(normalizedValue) ? normalizedValue.map(val => valueToOffset(val)) : valueToOffset(normalizedValue);
    }

    const getValue = (cloneAndSort: boolean = false): any => {
        if (cloneAndSort && value && isValueRange(value)) {
            return [...value].sort((a, b) => a - b);
        }
        return value!;
    }

    const getTrackStyle = useCallback(() => {
        const valueSorted = getValue(true);
        const offsetSorted = getValueToOffset(valueSorted);
        const trackParts = isValueRange(offsetSorted) ? [offsetSorted[0], offsetSorted[1] - offsetSorted[0]] : [0, offsetSorted];
        [track.offset, track.length] = trackParts;
        trackStyle = {
            left: `${getValidVal(track.offset)}%`,
            width: `${getValidVal(track.length)}%`
        };
        return trackStyle;
    }, disabled ? [disabled] : [value]);

    const updateTrackAndHandles = useCallback((isWriteValue: boolean = false): void => {
        const offset = getValueToOffset(value);
        const valueSorted = getValue(true);
        const offsetSorted = getValueToOffset(valueSorted);
        const trackParts = isValueRange(offsetSorted) ? [offsetSorted[0], offsetSorted[1] - offsetSorted[0]] : [0, offsetSorted];
        [track.offset, track.length] = trackParts;

        handles.forEach((handle, index) => {
            handle.offset = isValueRange(offset) ? offset[index] : offset;
            handle.value = isValueRange(value) ? value[index] : value || 0;
        });

        // trackStyle = {
        //     left: `${track.offset}%`,
        //     width: `${track.length}%`
        // };

        if (!isWriteValue) {
            let newValueSorted: any;
            if (valueSorted.length > 0) {
                let value1 = valueSorted[0];
                let value2 = valueSorted[1];
                value1 = Number(value1).toFixed(stepDigits);
                value2 = Number(value2).toFixed(stepDigits);
                if (stepDigits) {
                    newValueSorted = [parseFloat(value1), parseFloat(value2)];
                } else {
                    newValueSorted = [parseInt(value1), parseInt(value2)];
                }
            } else {
                newValueSorted = valueSorted.toFixed(stepDigits);
                if (stepDigits) {
                    newValueSorted = parseFloat(newValueSorted);
                } else {
                    newValueSorted = parseInt(newValueSorted);
                }
            }
            if (!lastValue) {
                lastValue = newValueSorted;
                return;
            }
            if (lastValue === newValueSorted || lastValue?.length > 0 && lastValue[0] === newValueSorted[0] && lastValue[1] === newValueSorted[1]) {
                return;
            }
            lastValue = newValueSorted;
            lastWriteValue = newValueSorted;
        } else {
            let newValueSorted;
            if (!Array.isArray(valueSorted)) {
                newValueSorted = Number(valueSorted);
            } else {
                newValueSorted = [Number(valueSorted[0]), Number(valueSorted[1])];
            }
            lastValue = newValueSorted;
        }
    }, disabled ? [disabled] : [value])

    resetInterval();
    updateTrackAndHandles(true);


    const updateValue = (val: number, event?: Event): void => {
        let nextvalue = formatValue(val);

        if (isValueRange(value!)) {
            const newValue = [...(value as number[])];
            newValue[currentHandleIndex] = nextvalue as number;

            if (currentHandleIndex === 1 && newValue[1] < newValue[0]) {
                newValue[1] = newValue[0];
            }
            if (currentHandleIndex === 0 && newValue[0] > newValue[1]) {
                newValue[0] = newValue[1];
            }
            setValue(newValue);
            onValueChange?.(newValue);
        } else {
            setValue(nextvalue);
            onValueChange?.(nextvalue);
        }
        updateTrackAndHandles();
    }

    const spin = (event: any, dir: number, handleIndex?: number) => {
        let step = (props.step || 1) * dir;
        currentHandleIndex = handleIndex!;
        const val: number = isValueRange(value!) ? value[currentHandleIndex] : getNormalizedValue(value);
        updateValue(val + step, event);
        event.preventDefault();
    }

    const onHandleKeydown = (event: React.KeyboardEvent, handleIndex: number) => {
        if (disabled) {
            return;
        }
        if (event.key === KEY_VALUES.UP || event.key === KEY_VALUES.RIGHT) {
            spin(event, 1, handleIndex);
        } else if (event.key === KEY_VALUES.DOWN || event.key === KEY_VALUES.LEFT) {
            spin(event, -1, handleIndex);
        } else if (event.key === KEY_VALUES.END) {
            const val: number = isValueRange(value!) ? (value as number[])[currentHandleIndex] : getNormalizedValue(value);
            spin(event, max! - val, handleIndex);
        } else if (event.key === KEY_VALUES.HOME) {
            const val: number = isValueRange(value!) ? (value as number[])[currentHandleIndex] : getNormalizedValue(value);
            spin(event, min! - val, handleIndex);
        }
    };

    const getWindowScrollLeft = (): number => {
        let doc = document.documentElement;
        return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    }

    const updateDomData = (): void => {
        let rect = sliderRef.current?.getBoundingClientRect();
        rect && (initX = rect.left + getWindowScrollLeft());
        barWidth = sliderRef.current?.offsetWidth;
    }

    const calculateHandleValue = (event: any): any => {
        if (orientation === "horizontal") {
            const positionX = touching ? event.changedTouches[0].clientX : event.pageX;
            return ((positionX - initX) * 100) / (barWidth);
        }
    }

    const getValueFromHandle = (handleValue: number): number => {
        return (max - min) * (handleValue / 100) + min;
    }

    const setValueFromHandle = (event: Event, handleValue: any) => {
        let value: number[] | number = getValueFromHandle(handleValue);
        value = step === 0 ? value : Math.round((value - min!) / step) * step + min;
        updateValue(value, event);
    }

    const handleChange = (event: Event) => {
        let handleValue = calculateHandleValue(event);
        setValueFromHandle(event, handleValue);
    }

    const mousemoveEvent = (event: MouseEvent) => {
        if (dragging) {
            handleChange(event);
        }
        event.preventDefault();
    }

    const mousEvent = (event: MouseEvent) => {
        if (dragging) {
            dragging = false;
        }
        event.preventDefault();
    }

    const bindDragListeners = () => {
        if (!dragListener) {
            dragListener = document.addEventListener('mousemove', mousemoveEvent);
        }

        if (!mouseupListener) {
            mouseupListener = document.addEventListener('mouseup', mousEvent);
        }
    }

    const touchmoveEvent = (event: TouchEvent) => {
        if (dragging) {
            handleChange(event);
        }
        event.cancelable && event.preventDefault();
    }

    const touchendEvent = (event: TouchEvent) => {
        if (dragging) {
            dragging = false;
        }
        if (touching) {
            touching = false;
        }
        event.cancelable && event.preventDefault();
    }

    const bindTouchListeners = () => {
        if (!touchMoveListener) {
            touchMoveListener = document.addEventListener('touchmove', touchmoveEvent);
        }

        if (!touchEndListener) {
            touchEndListener = document.addEventListener('touchend', touchendEvent);
        }
    }

    const onMouseDown = (event: any, index?: number) => {
        if (disabled) {
            return;
        }
        dragging = true;
        updateDomData();
        sliderHandleClick = true;
        currentHandleIndex = index!;
        if (range) {
            sliderRef.current?.querySelectorAll('.ap-slider-handle')?.forEach((o: any, p: any) => {
                if (p === index) {
                    o.style.zIndex = 1;
                } else {
                    o.style.zIndex = 0;
                }
            });
        }

        bindDragListeners();
        event.target.focus();
        event.preventDefault();
    }

    const onTouchStart = (event: any, index?: any) => {
        if (disabled) {
            return;
        }

        dragging = true;
        touching = true;
        updateDomData();
        sliderHandleClick = true;
        currentHandleIndex = index;
        if (range) {
            sliderRef.current?.querySelectorAll('.ap-slider-handle')?.forEach((o: any, p: any) => {
                if (p === index) {
                    o.style.zIndex = 1;
                } else {
                    o.style.zIndex = 0;
                }
            });
        }

        bindTouchListeners();
        event.target.focus();
        event.cancelable && event.preventDefault();

        // var touchobj = event.changedTouches[0];
        // startHandleValue = range
        //     ? handleValues[index]
        //     : handleValue;
        // dragging = true;
        // currentHandleIndex = index;
        // if (orientation === "horizontal") {
        //     startx = parseInt(touchobj.clientX, 10);
        //     barWidth = sliderRef.current?.offsetWidth;
        // }

        // event.cancelable && event.preventDefault();
    }

    const onTouchMove = (event: any, index?: number) => {
        if (disabled) {
            return;
        }

        var touchobj = event.changedTouches[0],
            handleValue = 0;
        if (orientation === "horizontal") {
            handleValue =
                Math.floor(
                    ((parseInt(touchobj.clientX, 10) - startx) * 100) / barWidth
                ) + startHandleValue;
        }

        setValueFromHandle(event, handleValue);
        event.preventDefault();
    }

    const onTouchEnd = (event: any, index?: number) => {
        if (disabled) {
            return;
        }
        dragging = false;
        event.preventDefault();
    }

    const getValidVal = (val: number) => {
        if (!val) return 0;
        return val > 100 ? 100 : val < 0 ? 0 : val;
    }

    const setSliderHandleStyle = (handle: any): string => {
        let leftStyle: string = '0';
        if (hasInterval && showIntervalTick) {
            const sliderTickWidth = sliderRef.current?.querySelector('.ap-slider-mark-tick')?.getBoundingClientRect().width || 0;
            const handleWidth = sliderRef.current?.querySelectorAll('.ap-slider-handle')[0].getBoundingClientRect().width || 0;
            leftStyle = `calc(${getValidVal(handle.offset)}% - ${(handleWidth! - sliderTickWidth!) / 2}px)`;
        } else {
            leftStyle = `${getValidVal(handle.offset)}%`;
        }
        return leftStyle;
    }

    const onBarClick = (event: any) => {
        if (disabled) {
            return;
        }

        if (!sliderHandleClick) {
            updateDomData();
            handleChange(event);
        }

        sliderHandleClick = false;
    }

    const classSliderNames = ClassNames("ap-slider ap-slider-horizontal", className, {
        "has-interval": hasInterval && showIntervalLabel,
        "disabled": disabled
    });

    const isActive = (option: any) => {
        return (hasInterval && value != undefined && value != null) ? value >= option : false;
    };

    const renderSliderMarkTick: any = () => {
        let results: any[] = [];
        scale.forEach((item: number, index: number) => {
            const classSliderMarkTickNames = ClassNames("ap-slider-mark-tick", {
                "active": isActive(item)
            });
            const sliderMarkTickStyle: React.CSSProperties = { left: '0' };
            results.push(
                <span key={index}
                    className={classSliderMarkTickNames}
                    style={sliderMarkTickStyle}
                ></span>
            );
        });
        return results;
    };

    const renderSliderHandles: any = () => {
        let results: any[] = [];

        handles.forEach((handle: any, index: number) => {
            let ariaLabel;
            if (valueDesc && valueDesc.length > 0) {
                ariaLabel = '';
            } else {
                ariaLabel = range ? (index === 0 ? 'minimum of ' + sliderId : 'maximum of ' + sliderId) : sliderId;
            }
            results.push(
                <span
                    key={index}
                    role="slider"
                    tabIndex={tabIndex}
                    aria-label={ariaLabel}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={handle.value}
                    aria-valuetext={valueDesc[handle.value - 1] || handle.value}
                    aria-disabled={disabled}
                    onKeyDown={(e) => { onHandleKeydown(e, index) }}
                    onMouseDown={(e) => { onMouseDown(e, index) }}
                    onTouchStart={(e) => { onTouchStart(e, index) }}
                    className={`ap-slider-handle ap-slider-handle-${index === 0 ? 'first' : 'last'}`}
                    style={{ left: setSliderHandleStyle(handle) }}>
                </span>
            );
        });
        return results;
    };

    const renderSliderMarkText: any = () => {
        let results: any[] = [];

        scale.forEach((item: any, index: number) => {
            const classSliderMarkTextNames = ClassNames("ap-slider-mark-text", {
                "active": isActive(item)
            });
            results.push(
                <span key={index}
                    className={classSliderMarkTextNames}
                    style={{
                        left: index === 0
                            ? '0'
                            : index === scale.length - 1 && item.toString().length > 0
                                ? lastOptionLength
                                : index / (scale.length - 1) * 100 + '%'
                    }}>
                    {item}
                </span>
            );
        });
        return results;
    }

    const classHandleContainer = ClassNames("ap-slider-handle-container", {
        "has-interval-tick": hasInterval && showIntervalTick
    });

    return (
        <div className={classSliderNames} style={style} onMouseDown={(e) => { onBarClick(e) }} ref={sliderRef}>
            <div className="ap-slider-rail"></div>
            <div className="ap-slider-track" style={getTrackStyle()}></div>
            <div className="ap-slider-tick-container">
                {hasInterval && showIntervalTick && renderSliderMarkTick()}
            </div>
            <div className={classHandleContainer}>
                {renderSliderHandles()}
            </div >
            <div className="ap-slider-mark">
                {hasInterval && showIntervalLabel && renderSliderMarkText()}
            </div >
        </div>
    )
});


export default Slider