import * as React from "react";
import { MutableRefObject, useCallback, useMemo } from 'react';
import ClassNames from "classnames";
import { useControlled, KEY_VALUES, mergeRefs, setupGetInstanceId } from '../utils';

const getInstanceId = setupGetInstanceId();


export interface TextAreaProps {
    tabIndex?: number;
    inputId?: string;
    title?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string | undefined;
    required?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    maxLength?: number | undefined;
    hideTitleOnInput?: boolean;
    name?: string;
    onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    children?: React.ReactNode;
}

const TextArea = React.forwardRef<HTMLDivElement, TextAreaProps>((props, ref) => {
    const {
        title,
        inputId = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now(),
        defaultValue = "",
        value: valueProp,
        onChange,
        onKeyDown,
        onBlur,
        onFocus,
        readonly,
        disabled,
        required,
        children,
        maxLength,
        name,
        hideTitleOnInput = false,
        tabIndex: tabIndexProp = 0,
        ...otherProps
    } = props;

    const [keyboardFocus, setKeyboardFocus] = React.useState(false);
    const [focus, setFocus] = React.useState(false);
    const [value, setValue] = useControlled(valueProp, defaultValue);
    const textAreaRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const inputRef: MutableRefObject<any> = React.useRef(null);
    const handleClick = (event: any) => {
        if (containerRef.current && (containerRef.current as HTMLElement).contains(event.target) && focus) {
            return;
        }

        if (textAreaRef.current) {
            (textAreaRef.current as HTMLElement).focus();
        }

        setFocus(true);
        setKeyboardFocus(false);
    }

    const onkeydown = (event: any) => {
        if (event.key === KEY_VALUES.TAB) {
            setFocus(true);
            setKeyboardFocus(true);
            // @ts-ignore
            if (event.target !== inputRef.current) {
                setFocus(false);
                return;
            }
        }
        onKeyDown?.(event);
    }

    const handleChange = (event: any) => {
        const value = event.target.value;
        setValue(value);
        onChange?.(value, event);
    }

    const handleInputBlur = useCallback(
        (event: React.FocusEvent<HTMLTextAreaElement>) => {
            onBlur?.(event);
            if (containerRef.current && (containerRef.current as HTMLElement).contains(event.target)) {
                return;
            }
            setKeyboardFocus(false);
            setFocus(false);
        },
        [onBlur]
    );

    const handleInputFocus = useCallback(
        (event: React.FocusEvent<HTMLTextAreaElement>) => {
            onFocus?.(event);
        },
        [onFocus]
    );

    const fieldTitleWrapperClass = ClassNames("ap-field-title-container", {
        "required": required,
    });

    const fieldWrapperClass = ClassNames("ap-field textarea", {
        "has-length": value !== "",
        "readonly": readonly,
        "disabled": disabled
    });

    const fieldContainerClass = ClassNames("ap-field-container", {
        "hide-title": hideTitleOnInput,
    });

    const tabIndex = disabled || readonly ? -1 : tabIndexProp;

    const uniqueId = useMemo(() => inputId || `textarea-${getInstanceId()}`, []);

    return (
        <div className={fieldWrapperClass} ref={ref} onKeyUp={onkeydown} {...otherProps}>
            <div className={fieldContainerClass}>
                <div className={fieldTitleWrapperClass}>
                    <label
                        className="ap-field-title"
                        htmlFor={`field-input-${uniqueId}`}
                        id={`field-input-label-${uniqueId}`}
                        aria-owns={`field-input-${uniqueId}`}
                        aria-disabled={disabled}
                    >
                        {title}
                    </label>
                </div>
                <div className={
                    ClassNames("ap-field-wrapper", {
                        "keyboard-focus": keyboardFocus,
                        "focus": focus
                    })}
                    onClick={handleClick}
                >
                    <textarea
                        id={`field-input-${uniqueId}`}
                        className="ap-field-input"
                        ref={mergeRefs(textAreaRef, inputRef)}
                        maxLength={maxLength}
                        aria-invalid={false}
                        readOnly={readonly}
                        aria-readonly={readonly}
                        disabled={disabled}
                        aria-disabled={disabled}
                        required={required}
                        aria-required={required}
                        value={value}
                        name={name}
                        onKeyDown={onKeyDown}
                        onChange={handleChange}
                        onBlur={handleInputBlur}
                        onFocus={handleInputFocus}
                        tabIndex={tabIndex}
                    >
                    </textarea>
                    {maxLength && (
                        <div className="ap-field-counter">
                            <span>{value.length}/{maxLength}</span>
                        </div>
                    )}
                </div>
                <div className="ap-field-content">
                    {children}
                </div>
            </div>
        </div>
    );
});

export default TextArea;


