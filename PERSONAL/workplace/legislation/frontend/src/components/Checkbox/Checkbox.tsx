import { forwardRef, useCallback, useContext, createContext, useState } from 'react';
import { setupGetInstanceId } from 'helpers/utils';
import { useControlled, KEY_VALUES, getText } from '../helpers/utils';
import { IconComponent } from 'components/Icon/Icon';

import { CheckboxProps, CheckboxContextProps } from './Checkbox.interface';
import styles from './Checkbox.module.scss';

const getInstanceId = setupGetInstanceId();
export const CheckboxContext = createContext<CheckboxContextProps>({});

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>((props, ref) => {

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
    isFilter = false,
    tabIndex = 0,
    "aria-label": ariaLabelProp,
    defaultChecked,
    checked: controlledChecked,
    disabled = disabledContext,
    onChange,
    children,
    className,
    indeterminate = false,
    isPill = false,
    inputProps,
    inputRef,
    ...rest
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

  const handleChange = useCallback((event: React.SyntheticEvent) => {
    if (disabled) return;

    const nextChecked = !checked;
    setChecked(nextChecked);
    onChange?.(nextChecked, event);
    onGroupChange?.(value, nextChecked, event);
  }, [disabled, onChange, onGroupChange, setChecked, value, checked]);

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
      className={styles.root}
      onClick={handleChange}
      onKeyDown={handleKeyDown}
      data-is-pill={isPill}
      ref={ref}
      {...rest}
    >
      <div
        className={styles.root__checkbox}
        data-disabled={disabled}
        data-checked={checked}
        data-focus={focused}
        data-indeterminate={indeterminate}
      >
        <div data-hidden-accessibility>
          <input
            type="checkbox"
            role='checkbox'
            aria-live='assertive'
            aria-label={ariaLabel}
            aria-disabled={disabled}
            aria-checked={indeterminate ? 'mixed' : checked}
            id={inputId}
            ref={inputRef}
            name={name}
            value={value}
            data-custom-checkbox
            tabIndex={tabIndex}
            defaultChecked={controlled ? undefined : checked}
            checked={controlled ? checked : undefined}
            disabled={disabled}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={() => setChecked((prev) => !prev)}
            {...inputProps}
          />
        </div>
        <span
          className={styles.root__deselected}
          aria-hidden
          data-checkbox-deselected-fill
          data-is-filter={isFilter}
        >
         {isFilter ?
         (
          <IconComponent name="CheckboxDeselectCheckbox" />
         ) :
         (
          <IconComponent name="CheckboxSelectedCheckbox" />
         )}
        </span>
        <span className={styles.root__outline} aria-hidden data-checkbox-backdrop-outline>
          {checked &&
            <span className={styles.root__selected} data-checkbox-selected-fill>
              <IconComponent name="CheckboxSelectedCheckbox" />
            </span>}
          {indeterminate &&
            <span className={styles.root__indeterminate} data-checkbox-indeterminate-fill>
               <IconComponent name="CheckboxIndeterminateCheckbox" />
            </span>}
        </span>
      </div>
      {
        children && (
          <label
            className={styles.root__checkboxlabel}
            data-checked={checked}
            htmlFor={inputId}
            onClick={(event) => event.preventDefault()}
            aria-hidden
            data-is-filter={isFilter}
            title={value as string}
            {...rest}
          >
            {children}
          </label>
        )
      }
    </div>
  );

});

export default Checkbox;
