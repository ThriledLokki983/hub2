import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useControlled } from '../utils';
import { RadioContext } from './context';

import { RadioProps } from "./Radio";

export type RadioValueType = string | number;

interface IRadioGroupProps {
  /**
   * The id of the radio group.
   */
  id?: string;
  /**
   * The name of the radio group. This prop is passed to each checbox
   */
  name?: string;
  /**
   * The content of the radio group. Must be the `Radio` component
   */

  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  /**
   * The initial value of the radio group
   */
  defaultValue?: RadioProps["value"] | null;
  /**
   * The value of the radio group
   */
  value?: RadioProps["value"] | null;
  onChange?: (
    value: RadioValueType,
    event: React.SyntheticEvent
  ) => void;

  disabled?: boolean;
}


type RadioGroupElement = {
  focus: () => void;
} | undefined;
export type RadioGroupProps = IRadioGroupProps;

const RadioGroup = React.forwardRef<RadioGroupElement, RadioGroupProps>(
  (props, ref) => {
    const {
      onChange,
      name,
      defaultValue,
      value: valueProp,
      disabled = false,
      children,
      className,
      ...restProps
    } = props;


    const [value, setValue, isControlled] = useControlled(valueProp, defaultValue);

    const handleChange = useCallback(
      (nextValue: any, event: React.SyntheticEvent) => {
        setValue(nextValue);
        if (value !== nextValue) {
          onChange?.(nextValue, event);
        }
      },
      [onChange, setValue]
    );

    const contextValue = useMemo(
      () => ({
        name,
        value: typeof value === 'undefined' ? null : value,
        disabled,
        onChange: handleChange
      }),
      [disabled, handleChange, name, value]
    );

    return (
      <RadioContext.Provider value={contextValue}>
        <div role="radiogroup" className={classNames("ap-radio-group", className)} {...restProps}>
          {children}
        </div>
      </RadioContext.Provider>
    );
  });

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;