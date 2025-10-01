import React, { useCallback, useContext, useState } from 'react';
import classNames from 'classnames';
import { useControlled, setupGetInstanceId, KEY_VALUES, getText } from '../utils';
import { CheckboxContext } from './context';

const getInstanceId = setupGetInstanceId();

export interface CheckboxProps {
    id?: string;
    inputId?: string;
    name?: string;
    className?: string;
    style?: React.CSSProperties;
    value?: string | number;
    disabled?: boolean;
    readOnly?: boolean;
    defaultChecked?: boolean;
    checked?: boolean;
    onChange?: (
        checked: boolean,
        event: React.SyntheticEvent
    ) => void;

    "aria-label"?: string;
    /**
     * A11y: The id of the element that describes the input
     */
    "aria-describedby"?: string;
    /**
     * A11y: Refers to the id of the element that labels the checkbox element.
     */
    "aria-labelledby"?: string;
    /**
     * The children is the label to be displayed to the right of the checkbox.
     */
    children?: React.ReactNode;
    prefixCls?: string;
    indeterminate?: boolean;
    tabIndex?: number;
    inputProps?: React.HTMLAttributes<HTMLInputElement>;
    /** Pass a ref to the input element. */
    inputRef?: React.Ref<any>;
}


const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>((props, ref) => {

    const {
        value: groupValue,
        name: nameContext,
        disabled: disabledContext,
        controlled,
        onChange: onGroupChange
    } = useContext(CheckboxContext);

    const {
        prefixCls: customizePrefixCls,
        inputId: inputIdProp,
        name = nameContext,
        value,
        tabIndex = 0,
        "aria-label": ariaLabelProp,
        defaultChecked,
        checked: controlledChecked,
        disabled = disabledContext,
        onChange,
        children,
        className,
        indeterminate = false,
        inputProps,
        inputRef,
        ...restProps
    } = props;

    const inputId = inputIdProp || `checkbox-${getInstanceId()}`;

    const isChecked = useCallback(() => {
        if (typeof groupValue !== 'undefined' && typeof value !== 'undefined') {
            return groupValue.some(i => i === value);
        }
        return controlledChecked;
    }, [controlledChecked, groupValue, value]);

    const [checked, setChecked] = useControlled(isChecked(), defaultChecked);
    const [focused, setFocused] = useState(false);

    const prefixCls = customizePrefixCls ? `${customizePrefixCls}-checkbox` : 'ap-checkbox';

    const handleChange = useCallback((event: React.SyntheticEvent) => {
        if (disabled) {
            return;
        }

        const nextChecked = !checked;
        setChecked(nextChecked);
        onChange?.(nextChecked, event);
        onGroupChange?.(value, nextChecked, event);
    },
        [disabled, onChange, onGroupChange, setChecked, value, checked]
    );

    const onFocus: React.FocusEventHandler<HTMLInputElement> = (...args) => {
        if (inputProps && inputProps.onBlur) {
            inputProps.onBlur(...args);
        }

        setFocused(true);
    };

    const onBlur: React.FocusEventHandler<HTMLInputElement> = (...args) => {
        if (inputProps && inputProps.onBlur) {
            inputProps.onBlur(...args);
        }

        setFocused(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === KEY_VALUES.ENTER || event.key === KEY_VALUES.SPACE) {
            handleChange(event);
            event.preventDefault();
        }

    }

    const ariaLabel = ariaLabelProp || getText(children);

    return (
        <div
            className={classNames(`${prefixCls}-container`, className)}
            ref={ref}
            onClick={handleChange}
            onKeyDown={handleKeyDown}

            {...restProps}
        >
            <div className={classNames(prefixCls,
                disabled && `${prefixCls}-disabled`,
                checked && `${prefixCls}-checked`,
                focused && `${prefixCls}-focus`,
                indeterminate && `${prefixCls}-indeterminate`
            )}>
                <div className="a-hidden-accessibility">
                    <input
                        type="checkbox"
                        role="checkbox"
                        aria-live="assertive"
                        aria-label={ariaLabel}
                        aria-disabled={disabled}
                        aria-checked={indeterminate ? 'mixed' : checked}
                        id={inputId}
                        ref={inputRef}
                        name={name}
                        value={value}
                        tabIndex={tabIndex}
                        defaultChecked={controlled ? undefined : checked}
                        checked={controlled ? checked : undefined}
                        disabled={disabled}
                        className={`${prefixCls}-input`}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={() => { }}
                        {...inputProps}
                    />
                </div>
                <span className="Appkit4-icon icon-checkbox-deselected-fill" aria-hidden></span>
                <span className="icon-checkbox-backdrop-outline" aria-hidden>
                    {checked && <span className="Appkit4-icon icon-checkbox-selected-fill"></span>}
                    {indeterminate && <span className="Appkit4-icon icon-checkbox-indeterminate-fill"></span>}
                </span>
            </div >

            {
                children && (
                    <label className={`${prefixCls}-label`} htmlFor={inputId} onClick={event => event.preventDefault()} aria-hidden>
                        {children}
                    </label>
                )
            }
        </div >
    );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
