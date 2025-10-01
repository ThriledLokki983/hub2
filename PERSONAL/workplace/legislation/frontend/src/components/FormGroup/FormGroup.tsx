import { FormGroupProps } from './FormGroup.interface';

import styles from './FormGroup.module.scss';


const FormGroup = ({ children, ...props }: FormGroupProps) => {
  return (
    <div {...props} className={styles.root}>{children}</div>
  );

};

export default FormGroup;
