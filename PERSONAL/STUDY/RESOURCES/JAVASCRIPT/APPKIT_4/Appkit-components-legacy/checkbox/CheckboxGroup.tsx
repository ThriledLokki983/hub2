import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useControlled } from '../utils';
import { CheckboxContext } from './context';

export type CheckboxValueType = string | number;

export interface CheckboxGroupProps {
  id?: string;
  name?: string;
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  defaultValue?: Array<CheckboxValueType>;
  value?: Array<CheckboxValueType>;
  onChange?: (
    value: Array<CheckboxValueType>,
    event: React.SyntheticEvent
  ) => void;
  disabled?: boolean;
}

type CheckboxGroupElement = {
  focus: () => void;
} | undefined;


const CheckboxGroup = React.forwardRef<CheckboxGroupElement, CheckboxGroupProps>(
  (props, ref) => {
    const {
      prefixCls: customizePrefixCls,
      className,
      onChange,
      name,
      defaultValue,
      value: valueProp,
      disabled,
      children,
      ...restProps
    } = props;


    const [value, setValue, isControlled] = useControlled(valueProp, defaultValue);

    const handleChange = useCallback(
      (nextValue: any, checked: boolean, event: any) => {
        let newValues;
        if (checked) {
          newValues = [...(value || []), nextValue];
        } else {
          newValues = (value || []).filter(val => val !== nextValue);
        }

        setValue(newValues);
        onChange?.(newValues, event);

      },
      [onChange, setValue, value]
    );

    const contextValue = useMemo(
      () => ({
        name,
        value,
        disabled,
        controlled: isControlled,
        onChange: handleChange
      }),
      [disabled, handleChange, name, value, isControlled]
    );

    const prefixCls = customizePrefixCls ? `${customizePrefixCls}-checkbox` : 'ap-checkbox';

    return (
      <CheckboxContext.Provider value={contextValue}>
        <div role="group" className={classNames(`${prefixCls}-group`, className)} {...restProps}>
          {children}
        </div>
      </CheckboxContext.Provider>
    );
  });

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;