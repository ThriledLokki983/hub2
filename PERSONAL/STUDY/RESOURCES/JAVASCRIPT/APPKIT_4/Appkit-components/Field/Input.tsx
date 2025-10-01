import React, { useCallback, MutableRefObject } from 'react';
import ClassNames from "classnames";
import { useControlled } from '../../../hooks';
import { KEY_VALUES } from '../../../configs/config';
import { mergeRefs } from '../../../util/helpers';
import { DropdownButton } from '../Dropdown';
import { ItemDataType } from '../Dropdown/DropdownButton';

export type ValueType = string | number;

export interface InputProps<V = ValueType> {
    ariaLabel?: string;
    type: 'text' | 'password';
    tabIndex?: number;
    inputId?: string;
    title?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string | undefined;
    allowClear?: boolean;
    revealer?: boolean;
    required?: boolean;
    readonly?: boolean;
    textReadonly?: boolean;
    disabled?: boolean;
    error?: boolean;
    name?: string;
    hideTitleOnInput?: boolean;
    onChange?: (
        value: string,
        event?: React.ChangeEvent<HTMLInputElement>
    ) => void;
    onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onClick?: (event: React.MouseEvent) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    errorNode?: React.ReactNode;
    children?: React.ReactNode;
    phoneTag?: boolean;
    dropdown?: ItemDataType[];
    selectedItem?: ItemDataType;
    onClear?: (event: React.KeyboardEvent) => void;
    dropdownChange?: (value: string, item: ItemDataType) => void;
    prefixTemplate?: (item: ItemDataType) => React.ReactNode;
    suffixTemplate?: (item: ItemDataType) => React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const {
        ariaLabel,
        title,
        type: typeProp,
        inputId = String.fromCharCode(65 + Math.floor(Math.random() * 26))
            + Date.now(),
        defaultValue = '',
        value: valueProp,
        placeholder = '',
        allowClear = false,
        revealer = false,
        onChange,
        onKeyDown,
        onKeyUp,
        onClick,
        onBlur,
        onFocus,
        readonly,
        textReadonly,
        disabled,
        error,
        required,
        errorNode,
        prefix,
        suffix,
        children,
        name,
        hideTitleOnInput = false,
        tabIndex: tabIndexProp = 0,
        phoneTag = false,
        dropdown,
        selectedItem: selectedItemProp,
        onClear,
        dropdownChange,
        prefixTemplate,
        suffixTemplate,
        ...otherProps
    } = props;

    const [keyboardFocus, setKeyboardFocus] = React.useState(false);
    const [clickFocus, setClickFocus] = React.useState(false);
    const [value, setValue] = useControlled(valueProp, defaultValue);
    const [type, setType] = React.useState(typeProp);
    const [showPlaceholder, setShowPlaceholder] = React.useState(false);

    const [visible, setVisible] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(selectedItemProp);

    const tagRef = React.useRef(null);
    const inputRef: MutableRefObject<any> = React.useRef(null);
    const containerRef = React.useRef(null);
    React.useEffect(() => {
        const eventClickHandler = (event: MouseEvent) => {
            if (
                containerRef.current
                && (containerRef.current as HTMLElement).contains(
                    event.target as HTMLElement,
                ) && clickFocus
            ) {
                return false;
            }

            setClickFocus(true);
            return true;
        };

        window.addEventListener('click', eventClickHandler);
        return () => window.removeEventListener('click', eventClickHandler);
    });
    const handleClick = (event: React.MouseEvent) => {
        inputRef.current.focus();
        setKeyboardFocus(false);
        if (value === '' || value === undefined) {
            setShowPlaceholder(true);
        }
        onClick?.(event);
    };

    const onkeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === KEY_VALUES.TAB) {
            setClickFocus(true);
            setKeyboardFocus(true);
            if (event.target !== inputRef.current) {
                setClickFocus(false);
                return;
            }
            if (value === '' || value === undefined) {
                setShowPlaceholder(true);
            }
        }
        onKeyDown?.(event);
    };

    const handleChange = (event: any) => {
        const value = event.target.value;
        setValue(value);
        onChange?.(value, event);
    };

    const handleInputBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            onBlur?.(event);
            setKeyboardFocus(false);
            // setClickFocus(false);
        },
        [onBlur],
    );

    const handleInputFocus = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            onFocus?.(event);
        },
        [onFocus],
    );

    const fieldTitleWrapperClass = ClassNames("ap-field-title-container", {
        "required": required,
    });
    const fieldWrapperClass = ClassNames("ap-field", {
        "has-length": value !== "",
        "readonly": readonly,
        "text-readonly": textReadonly,
        "error": error,
        "disabled": disabled,
        "ap-field-dropdown-phone": phoneTag
    });
    const fieldContainerClass = ClassNames("ap-field-container", {
        "hide-title": hideTitleOnInput,
        'show': visible
    });

    const clearWrapperClass = ClassNames("ap-field-cleaner ap-field-icon-btn Appkit4-icon icon-circle-delete-outline", {
        "disabled": value === "",
        "readonly": readonly
    });

    const [reveal, setReveal] = React.useState(true);
    const changeReveal = () => {
        if (value === '') return;
        setReveal(!reveal);
        setType(reveal ? 'text' : 'password');
        setTimeout(() => {
            inputRef.current.setSelectionRange(-1, -1);
        }, 0);
    };
    const changeRevealKeyDown = (event: React.KeyboardEvent) => {
        if (value === '') return;
        if (event.key === KEY_VALUES.ENTER) {
            setReveal(!reveal);
            setType(reveal ? 'text' : 'password');
            setTimeout(() => {
                inputRef.current.setSelectionRange(-1, -1);
            }, 0);
        }
    };
    const revealWrapperClass = ClassNames("Appkit4-icon ap-field-icon-btn ap-field-password-reveal-icon", {
        'icon-view-outline': reveal,
        'icon-view-off-outline': !reveal,
        "disabled": value === ""
    });

    const handleClear = (event: any) => {
        setValue('');
        onChange?.('', event);
        onClear?.(event);
        inputRef.current.focus();
    };

    const handleClearKeyDown = (event: any) => {
        if (event.key === KEY_VALUES.ENTER) {
            setValue('');
            onChange?.('', event);
            onClear?.(event);
            inputRef.current.focus();
            setClickFocus(true);
        }
    };

    React.useEffect(() => {
        let tagWidth;
        if (tagRef.current) {
            tagWidth = (tagRef.current as HTMLElement).getBoundingClientRect()
                .width;
            inputRef.current.style['padding-left'] = `${tagWidth + 2}px`;
        }
    }, [selectedItem]);

    const dropdownSelectHandle = (itemValue: string, item: ItemDataType) => {
        if (item.value !== selectedItem?.value) {
            setSelectedItem(item);
            dropdownChange?.(value, item);
        }
        setClickFocus(true);
        inputRef.current.focus();
        setVisible(false);
        onVisibleChange?.(false);
    };

    const onVisibleChange = (visible: boolean) => {
        setVisible(visible);
    };

    const tabIndex = disabled || readonly || textReadonly ? -1 : tabIndexProp;
    return (
        <div
            className={fieldWrapperClass}
            ref={ref}
            onKeyUp={onkeydown}
            {...otherProps}
        >
            <div className={fieldContainerClass} ref={containerRef}>
                <div className={fieldTitleWrapperClass}>
                    <label
                        className="ap-field-title"
                        htmlFor={`field-input-${inputId}`}
                        id={`field-input-label-${inputId}`}
                        aria-owns={`field-input-${inputId}`}
                        aria-disabled="false"
                    >
                        {title}
                    </label>
                </div>
                <div
                    className={
                        ClassNames("ap-field-wrapper", {
                            "keyboard-focus": keyboardFocus,
                            "focus": clickFocus
                        })}
                    onClick={handleClick}
                >
                    {prefix && (
                        <div className="ap-field-prefix-wrapper">{prefix}</div>
                    )}
                    {phoneTag && (
                        <div
                            className="ap-field-dropdown-phone-tag"
                            ref={tagRef}
                        >
                            {selectedItem && selectedItem.descValue}
                        </div>
                    )}
                    <input
                        type={type}
                        className="ap-field-input"
                        ref={mergeRefs(inputRef, ref)}
                        id={`field-input-${inputId}`}
                        aria-invalid={error}
                        aria-required={required}
                        value={value}
                        name={name}
                        onChange={handleChange}
                        onBlur={handleInputBlur}
                        onKeyDown={onKeyDown}
                        onKeyUp={onKeyUp}
                        onFocus={handleInputFocus}
                        readOnly={readonly || textReadonly}
                        disabled={disabled}
                        tabIndex={tabIndex}
                        aria-label={ariaLabel || ''}
                    />
                    {placeholder && showPlaceholder && (
                        <div
                            aria-hidden="true"
                            className="ap-field-placeholder-container"
                        >
                            <span className="ap-field-placeholder">
                                {placeholder}
                            </span>
                        </div>
                    )}
                    {dropdown && dropdown.length > 0 && (
                        <DropdownButton
                            dropdownClassName={'ap-Field-Dropdown'}
                            splitButton={false}
                            apperance="field"
                            data={dropdown}
                            dropdownItemArialabel={true}
                            onSelect={dropdownSelectHandle as any}
                            onVisibleChange={onVisibleChange}
                            prefixTemplate={prefixTemplate}
                            suffixTemplate={suffixTemplate}
                            value={selectedItem?.value}
                            disabled={readonly}
                        >
                            <div
                                role="button"
                                tabIndex={0}
                                className={ClassNames("ap-field-dropdown-button-group", { 'with-unit': selectedItem?.unit })}
                            >
                                {selectedItem?.url && (
                                    <img
                                        className="ap-field-img"
                                        src={selectedItem.url}
                                        aria-hidden
                                    />
                                )}
                                {selectedItem?.unit && (
                                    <span className="ap-field-unit" aria-hidden>
                                        {selectedItem.unit}
                                    </span>
                                )}
                                <span
                                    className={ClassNames("Appkit4-icon ap-field-icon-btn icon-down-chevron-outline",
                                    {
                                        'with-unit': selectedItem?.unit,
                                        'up': visible
                                    }
                                )}
                                    aria-hidden
                                ></span>
                            </div>
                        </DropdownButton>
                    )}

                    {allowClear && (
                        <div className="ap-field-suffix-wrapper">
                            <span
                                role="button"
                                className={clearWrapperClass}
                                tabIndex={
                                    value && value.length
                                    && !readonly && !disabled
                                        ? 0
                                        : undefined
                                }
                                aria-label="Clear text"
                                aria-disabled={
                                    value.length === 0 || readonly || disabled
                                }
                                onClick={handleClear}
                                onKeyDown={handleClearKeyDown}
                            ></span>
                        </div>
                    )}
                    {revealer && (
                        <div className="ap-field-suffix-wrapper">
                            <span
                                role="button"
                                className={revealWrapperClass}
                                tabIndex={value && value.length ? 0 : undefined}
                                aria-label={
                                    reveal
                                        ? 'Reveal password'
                                        : 'Unreveal password'
                                }
                                aria-disabled="false"
                                onClick={changeReveal}
                                onKeyDown={changeRevealKeyDown}
                            ></span>
                        </div>
                    )}
                    {suffix && (
                        <div className="ap-field-suffix-wrapper">{suffix}</div>
                    )}
                </div>
                <div className="ap-field-content">
                    {children}
                    {error && errorNode}
                </div>
            </div>
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
