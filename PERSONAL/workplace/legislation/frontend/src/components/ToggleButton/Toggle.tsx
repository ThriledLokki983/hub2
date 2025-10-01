import { useState } from 'react';
import { ToggleButton } from 'react-aria-components';
import { ToggleProps, ToggleButtonProps } from './Toggle.interface';

import styles from './Toggle.module.scss';

const CustomToggleList = ({
  list,
  name,
  onToggle,
  children,
  isProjectToggle = false,
  ...props
}: ToggleProps) => {

  return (
    <ul className={styles.root} {...props}>
      {list.map((data, index) => (
          <li data-identifier={data.identifier} key={index}>
            <CustomToggle data={data} onToggle={onToggle} name={name} isProjectToggle={isProjectToggle} />
            {children}
          </li>
      ))}
    </ul>
  )
};

export default CustomToggleList;


const CustomToggle = ({ data, name, onToggle, isProjectToggle, ...props }: ToggleButtonProps) => {
  const [isSelected, setSelected] = useState(data?.checked || data.is_approved);

  return (
    <ToggleButton
      className={styles.root__toggle_button}
      isSelected={isProjectToggle ? data.checked : isSelected}
      onChange={() => {
        setSelected((prev) => !prev);
        onToggle(name, data.name, !isSelected);
      }}
      aria-label={data.name}
      id={data.identifier}
      {...props}
    >
      <span>{data.name}</span>
    </ToggleButton>
  )
};

