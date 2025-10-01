import * as React from "react";
import { useCallback, useState } from 'react';
import { useControlled, KEY_VALUES } from '../utils';
import classNames from "classnames";

export type ValueType = string | number;

export interface SearchProps<V = ValueType> {
    style?: React.CSSProperties;
    className?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string | undefined;
    onSearch?: (
        value: string | undefined,
        event: React.ChangeEvent<HTMLInputElement>
    ) => void;
    disabled?: boolean,
    ariaLabel?: string;
    onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onClear?: (event: React.KeyboardEvent<HTMLSpanElement> | React.MouseEvent<HTMLSpanElement>) => void;
}


const Search = React.forwardRef<HTMLInputElement, SearchProps>((props, ref) => {
    const {

        defaultValue = '',
        value: valueProp,
        placeholder: placeholderProp = 'Search',
        onSearch,
        disabled,
        onChange,
        onKeyDown,
        onClear,
        onBlur,
        onFocus,
        ...otherProps
    } = props;

    const [value, setValue] = useControlled(valueProp, defaultValue);
    const [keyboardFocus, setKeyboardFocus] = React.useState(false);
    const [clickFocus, setClickFocus] = React.useState(false);

    const containerRef = React.useRef(null);

    const inputRef = React.useRef<HTMLInputElement>(null);

    const placeholder = React.useMemo(() => {
        if (clickFocus || keyboardFocus || value.length > 0) {
            return;
        } else {
            return placeholderProp;
        }
    }, [clickFocus, keyboardFocus, value])

    const handleClear = (event: React.MouseEvent<HTMLSpanElement>) => {
        setValue("");
        // @ts-ignore
        onChange?.("", event);
        onClear?.(event);
        inputRef.current?.focus();
    }


    const handleClearKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        if (event.key === KEY_VALUES.ENTER) {
            event.preventDefault();
            event.stopPropagation();
            setValue("");
            // @ts-ignore
            onChange?.("", event);
            onClear?.(event);
            inputRef.current?.focus();
            setClickFocus(true);
        }
    }


    const showIcon = keyboardFocus || clickFocus || value.length > 0;

    const searchTypeNode = () => {
        const classes = classNames('ap-search-after-icon', {
            'delete-icon': true,
            'showDeleteIcon': showIcon,
            'active': value.length > 0
        });

        const searchProps = {
            role: 'button',
            type: 'button',
            'aria-disabled': disabled || value.length === 0,
            tabIndex: (disabled || value.length === 0) ? -1 : 0,
            'aria-label': 'clear',
            className: classes,
            onClick: handleClear,
            onKeyDown: handleClearKeyDown,
        }

        return (
            <span {...searchProps}>
                <i className={'Appkit4-icon icon-circle-delete-outline'} aria-hidden></i>
            </span>
        );
    };

    const handleClick = (event: React.MouseEvent) => {
        inputRef.current?.focus();
        setClickFocus(true);
        setKeyboardFocus(false);
        // // if (value === "" || value === undefined) {
        // //     setShowPlaceholder(true);
        // // }
        // onClick?.(event);
    }

    const onkeydown = (event: React.KeyboardEvent) => {

        if (event.key === KEY_VALUES.TAB) {
            setClickFocus(true);
            setKeyboardFocus(true);
            // inputRef.current?.focus();
            if (event.target !== inputRef.current) {
                setClickFocus(false);
                return;
            }
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
        onChange?.(value, event);
    }

    const handleInputBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            onBlur?.(event);
            setKeyboardFocus(false);
            setClickFocus(false);
        },
        [onBlur]
    );

    const handleInputFocus = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            onFocus?.(event);
        },
        [onFocus]
    );

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);
    }

    return (
        <div
            className={'ap-search-container'}
            ref={containerRef}
            onKeyUp={onkeydown}
            tabIndex={-1}
            {...otherProps}
        >
            <div
                className={classNames("ap-search-input", {
                    "keyboard-focus": keyboardFocus,
                    "focus": clickFocus
                })}
                onClick={handleClick}
            >
                <div aria-live="assertive" className="search-result"></div>
                <input
                    ref={inputRef}
                    type="text"
                    className="ap-field-input"
                    tabIndex={0}
                    value={value}
                    placeholder={placeholder}
                    onChange={handleChange}
                    role="searchbox"
                    autoComplete="off"
                    aria-disabled={disabled}
                    aria-label=""
                    aria-activedescendant=""
                    disabled={disabled}
                    onKeyDown={handleInputKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                <i className={classNames('Appkit4-icon icon-search-outline', { 'activeSearch': value.length > 0 })} aria-hidden></i>
                {searchTypeNode()}
            </div>
        </div >
    );

});

export default Search;