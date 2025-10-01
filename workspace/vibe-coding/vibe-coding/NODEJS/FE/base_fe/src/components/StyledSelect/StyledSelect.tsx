import { Icon } from 'components';
import { StyledSelectProps } from './StyledSelect.interface';

import styles from './StyledSelect.module.scss';


const StyledSelect = ({ children, ...props }: StyledSelectProps) => {

  return (
    <div className={styles.root} styled-select="" {...props}>
      {children}
      <Icon name="chevron-down" />
    </div>
  );

};

export default StyledSelect;
