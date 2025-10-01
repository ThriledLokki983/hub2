import { SingleCheckboxProps } from './SingleCheckbox.interface';

import styles from './SingleCheckbox.module.scss';


const SingleCheckbox = ({
  name = '',
  value = '',
  label = '',
  labelVisible = true,
  defaultChecked = false,
  disabled = false,
  onChange = (e:  React.ChangeEvent<HTMLInputElement>) => null,
  ...props
}: SingleCheckboxProps) => {

  return (
    <div className={styles.root} data-is-disabled={Boolean(disabled)} single-checkbox="" {...props}>
      <label htmlFor={name}>
        <input
          id={name}
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          aria-label={label}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        {labelVisible
          ? <span>{label}</span>
          : ''
        }
      </label>
    </div>
  );

};

export default SingleCheckbox;
