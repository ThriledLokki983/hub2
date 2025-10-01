type ValueType = string | number;
export type CheckboxGroupElement = { focus: () => void; } | undefined;
export type CheckboxValueType = string | number;

export interface CheckboxProps {
  // Define your props here
  id?: string;
  isFilter?: boolean;
  inputId: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  value?: string | number;
  disabled?: boolean;
  isPill?: boolean;
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

export interface CheckboxContextProps {
  name?: string;
  value?: ValueType[];
  disabled?: boolean;
  controlled?: boolean;
  onChange?: (value: any, checked: boolean, event: React.SyntheticEvent) => void;
}

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
