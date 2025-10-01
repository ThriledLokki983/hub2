import { useState } from 'react';
import { MyInputProps } from './Input.interface';
import { Checkbox, CheckboxProps, Text, Input, TextArea, Label, TextField, FieldError } from 'react-aria-components';
import styles from './Input.module.scss';
const DISABLE_KEYS = ['nan', 'N/A', 'n/a', 'na', 'NA', 'not_applicable', 'not applicable',];


const InputField = ({
  name = '',
  label = '',
  subLabel = '',
  inputValue = '',
  required = false,
  showCheckbox = false,
  isTextArea = false,
  requirementIndex,
  requirementIdentifier,
  placeholder = '',
  extra = '',
  rows = 5,
  onInputChange,
  type = 'text',
  readOnly = false,
  isRequirement = false,
  ...props
}: MyInputProps & {
  isRequirement?: boolean;
  requirementIndex?: number;
  requirementIdentifier?: string | undefined;
  placeholder?: string;
  extra?: string;
  type?: string;
  readOnly?: boolean;
}) => {

  const [value, setValue] = useState<string>(String(inputValue));
  const [selected, setSelection] = useState(DISABLE_KEYS.includes(inputValue) || false);

  return (
    <TextField
      id={name}
      className={styles.root__forminput}
      isRequired={required}
      data-required={required}
      isDisabled={selected}
      isReadOnly={readOnly}
      value={selected ? 'N/A' : value}
      onChange={(newValue) => {
        setValue(newValue);
        onInputChange?.(name, newValue);
      }}
      type={type}
      {...props}
    >
      <Label>{label}</Label>
      {subLabel ? <Text slot="description" data-sublabel data-subtitle dangerouslySetInnerHTML={{ __html: subLabel }}></Text> : null}
      {showCheckbox ? (
        <CustomCheckbox data-not-applicable isSelected={selected} onChange={() => {
            setSelection(!selected);
            onInputChange?.(name, `${!selected ? 'N/A' : value}`);
          }}
        >
          <span data-not-applicable>Not applicable</span>
        </CustomCheckbox> ) : (
          null
        )}
      {!isTextArea ? (
        <Input name={name} placeholder={placeholder} />
      ) : (
        <TextArea name={name} rows={rows} placeholder={placeholder} />
      )}
      {extra ? <span data-extra>{extra}</span> : null }
      <FieldError />
    </TextField>
  );

};

export default InputField;


/**
 * CustomCheckbox component
 * @param param0
 * @returns
 */
export const CustomCheckbox = ({ children, ...props}: CheckboxProps) => {
  return (
    <Checkbox
      className={styles.root__checkbox}
      data-checkbox
      {...props}
    >
      {({isIndeterminate}) => (
        <>
          <div className={styles.root__check}>
            <span>
              <svg viewBox="0 0 18 18" aria-hidden="true">
                {isIndeterminate
                  ? <rect x={1} y={7.5} width={15} height={3} />
                  : <polyline points="1 9 7 14 15 4" />
                }
              </svg>
            </span>
          </div>
          {children}
        </>
      )}
    </Checkbox>
  );

}


/**
 * CustomTextArea component
 */
export const CustomTextArea = () => {};
