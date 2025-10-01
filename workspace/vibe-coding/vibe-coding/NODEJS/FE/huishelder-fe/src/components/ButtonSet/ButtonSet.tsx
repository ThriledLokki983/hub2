import { ButtonSetProps } from './ButtonSet.interface';

import styles from './ButtonSet.module.scss';

const ButtonSet = ({ children, ...props }: ButtonSetProps) => {
  return (
    <div className={styles.root} {...props}>
      {children}
    </div>
  );
};

export default ButtonSet;
