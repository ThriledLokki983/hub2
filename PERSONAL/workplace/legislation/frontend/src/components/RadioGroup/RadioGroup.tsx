import { Children, useState } from 'react';
import { RadioGroupProps } from './RadioGroup.interface';
import { Radio, RadioGroup } from 'react-aria-components';

import styles from './RadioGroup.module.scss';


export const CustomRadioGroup = ({
  label,
  roles,
  onRadioChange,
  ...props }: RadioGroupProps
) => {
  const [selected, setSelected] = useState(roles.find((r) => r.checked)?.name || null);

  return (
    <RadioGroup
      aria-labelledby={label || ''}
      className={styles.root__radiogroup}
      value={selected}
      onChange={(selectedValue: string) => {
        setSelected(selectedValue);
        onRadioChange(label, selectedValue);
      }}
      {...props}
    >
      {Children.toArray(roles.map((_r) => (
        <Radio value={_r.name} className={styles.root__radio}>{_r.label}</Radio>
      )))}
    </RadioGroup>
  );

};

export default CustomRadioGroup;
