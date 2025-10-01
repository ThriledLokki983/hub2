
import React, { useCallback, useContext, useState } from 'react';
import classNames from 'classnames';
import { useControlled, setupGetInstanceId, KEY_VALUES, getText } from '../utils';
import { RadioContext } from './context';

const getInstanceId = setupGetInstanceId();

export type RadioValueType = number | string;

export interface RadioProps {
    /* Radio id */
    id?: string;
    /* Radio name */
    name?: string;
    /* Radio value */
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    value?: RadioValueType;
    /* Makes radio disabled */
    disabled?: boolean;
    readOnly?: boolean;
    /**
     * If `true`, the radio will be initially checked.
     */
    defaultChecked?: boolean;
    /**
     * If `true`, the radio will be checked.
     * You'll need to pass `onChange` to update it's value (since it's now controlled)
     */
    checked?: boolean;

    "aria-label"?: string;
    /**
     * A11y: The id of the element that describes the input
     */
    "aria-describedby"?: string;
    /**
     * A11y: Refers to the id of the element that labels the radio element.
     */
    "aria-labelledby"?: string;
    /**
     * The children is the label to be displayed to the right of the radio.
     */
    children?: React.ReactNode;



    /** Called when the checkbox or label is clicked. */
    onClick?: (event: React.SyntheticEvent) => void;

    tabIndex?: number;
    inputId?: string;
    inputProps?: React.HTMLAttributes<HTMLInputElement>;
    /** Pass a ref to the input element. */
    inputRef?: React.Ref<any>;
}


const Radio = React.forwardRef<HTMLDivElement, RadioProps>((props, ref) => {

    const {
        value: groupValue,
        name: nameContext,
        disabled: disabledContext,
        readOnly: readOnlyContext,
        onChange: onGroupChange
    } = useContext(RadioContext);

    const {
        className,
        prefixCls: customizePrefixCls,
        name = nameContext,
        value,
        tabIndex = 0,
        "aria-label": ariaLabelProp,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedby,
        defaultChecked,
        checked: checkedProp,
        disabled = disabledContext,
        onClick,
        children,
        inputProps,
        inputRef,
        inputId: inputIdProp,
        ...restProps
    } = props;

    const inputId = inputIdProp || `checkbox-${getInstanceId()}`;

    const [checked, setChecked] = useControlled(
        typeof groupValue !== 'undefined' ? groupValue === value : checkedProp,
        defaultChecked || false
    );

    const [focused, setFocused] = useState(false);

    const prefixCls = customizePrefixCls ? `${customizePrefixCls}-radio` : 'ap-radio';

    const handleChange = useCallback(event => {
        if (disabled) {
            return;
        }

        setChecked(true);
        onGroupChange?.(value, event);
        onClick?.(event);
    },
        [disabled, onClick, onGroupChange, setChecked, value]
    );

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === KEY_VALUES.ENTER || event.key === KEY_VALUES.SPACE) {
            handleChange(event);
            event.preventDefault();
        }
    }


    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
    };

    const ariaLabel = ariaLabelProp || getText(children);

    return (
        <div ref={ref} className={classNames(`${prefixCls}-container`, className)} onClick={handleChange} onKeyDown={onKeyDown} {...restProps}>
            <div className={classNames(prefixCls,
                disabled && `${prefixCls}-disabled`,
                checked && `${prefixCls}-checked`,
                focused && `${prefixCls}-focused`
            )}>
                <div className="a-hidden-accessibility">
                    <input
                        type="radio"
                        aria-label={ariaLabel}
                        // aria-labelledby={ariaLabelledBy}
                        // aria-describedby={ariaDescribedby}
                        aria-disabled={disabled}
                        id={inputId}
                        ref={inputRef}
                        name={name}
                        value={value}
                        tabIndex={tabIndex}
                        defaultChecked={checked}
                        disabled={disabled}
                        className={`${prefixCls}-input`}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        {...inputProps}
                    />
                </div>
                <span className="Appkit4-icon icon-radio-deselected-fill" aria-hidden></span>
                <span className="Appkit4-icon icon-radio-backdrop-outline" aria-hidden>
                    {checked && <span className="Appkit4-icon icon-radio-selected-fill"></span>}
                </span>
            </div>

            {children && (
                <label className={`${prefixCls}-label`} htmlFor={inputId} onClick={event => event.preventDefault()} aria-hidden>
                    {children}
                </label>
            )}
        </div>
    );
});

export default Radio;

Radio.displayName = "Radio";
