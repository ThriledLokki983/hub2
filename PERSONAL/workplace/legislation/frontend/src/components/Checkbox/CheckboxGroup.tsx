import React, { useCallback, useMemo } from 'react';
import { useControlled } from '../helpers/utils';
import { CheckboxContext } from './context';
import { CheckboxGroupProps, CheckboxGroupElement } from './Checkbox.interface';
import styles from './CheckboxGroup.module.scss';

const CheckboxGroup = React.forwardRef<CheckboxGroupElement, CheckboxGroupProps>(({
  prefixCls: customizePrefixCls,
  className,
  onChange,
  name,
  defaultValue,
  value: valueProp,
  disabled,
  children,
  ...restProps
}, ref) => {

  const [value, setValue, isControlled] = useControlled(valueProp, defaultValue);

  const handleChange = useCallback((nextValue: any, checked: boolean, event: any) => {
    let newValues;
    if (checked) {
      newValues = [...(value || []), nextValue];
    } else {
      newValues = (value || []).filter(val => val !== nextValue);
    }

    setValue(newValues);
    onChange?.(newValues, event);
  }, [onChange, setValue, value]);

  const contextValue = useMemo(() => ({
    name,
    value,
    disabled,
    controlled: isControlled,
    onChange: handleChange
  }),[disabled, handleChange, name, value, isControlled]);

  const prefixCls = customizePrefixCls ? `${customizePrefixCls}-checkbox` : 'ap-checkbox';

  return (
    <CheckboxContext.Provider value={contextValue}>
      <div role="group" className={styles.root} {...restProps}>
        {children}
      </div>
    </CheckboxContext.Provider>
  );

});

export default CheckboxGroup;
