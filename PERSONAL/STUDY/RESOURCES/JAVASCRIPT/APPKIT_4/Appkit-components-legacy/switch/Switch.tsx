
import * as React from 'react';
import classNames from 'classnames';
import { useControlled, setupGetInstanceId, KEY_VALUES } from '../utils';
import { getText } from "../utils"

const getInstanceId = setupGetInstanceId();

export type SwitchChangeEventHandler = (
  checked: boolean,
  event: React.SyntheticEvent
) => void;

export interface SwitchProps {
  prefixCls?: string;
  id?: string;
  inputId?: string;
  className?: string;
  style?: React.CSSProperties;
  large?: boolean;
  disabled?: boolean;
  onChange?: SwitchChangeEventHandler;
  tabIndex?: number;
  checked?: boolean;
  defaultChecked?: boolean;
  children?: React.ReactNode;
  "aria-labelledby"?: string;
}



const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({
    prefixCls = 'ap-switch',
    inputId: inputIdProp,
    className,
    checked: checkedProp,
    defaultChecked,
    disabled,
    onChange,
    tabIndex = 0,
    children,
    large = false,
    'aria-labelledby': ariaLabelledBy,
    ...restProps
  }, ref) => {

    const inputId = inputIdProp || `checkbox-${getInstanceId()}`;

    const [checked, setChecked] = useControlled(
      checkedProp,
      defaultChecked || false
    );

    function triggerChange(
      newChecked: boolean,
      event: React.SyntheticEvent
    ) {
      if (disabled) {
        return;
      }

      setChecked(newChecked);
      onChange?.(newChecked, event);
    }

    function onInternalClick(e: React.SyntheticEvent) {
      triggerChange(!checked, e);
    }

    const onKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === KEY_VALUES.ENTER || event.key === KEY_VALUES.SPACE) {
        triggerChange(!checked, event);
        event.preventDefault();
      }
    }

    const switchClassName = classNames(`${prefixCls}-btn`, {
      [`${prefixCls}-checked`]: checked,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-lg`]: large,
    });

    return (
      <div
        ref={ref}
        className={classNames(prefixCls, className)}
        onClick={onInternalClick}
        onKeyDown={onKeyDown}
        {...restProps}
      >
        <button
          id={inputId}
          role="switch"
          className={switchClassName}
          aria-pressed={checked}
          aria-checked={checked}
          aria-disabled={disabled}
          aria-describedby={ariaLabelledBy}
          aria-label={getText(children)}
          disabled={disabled}
          tabIndex={tabIndex}
        >
          <span className={`${prefixCls}-default`}></span>
        </button>
        {children !== undefined &&
          <label htmlFor={inputId} className={`${prefixCls}-label`} onClick={(e) => e.preventDefault()} aria-hidden>
            {children}
          </label>
        }
      </div>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
