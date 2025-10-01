import { useState } from 'react';
import { setupGetInstanceId } from 'helpers/utils';

import styles from './GroupHeader.module.scss';

interface GroupHeaderProps {
  title?: string;
  content?: string;
  showCheckbox?: boolean;
  required?: boolean;
  children?: React.ReactNode;
  [key: string]: any;
}
const getInstanceId = setupGetInstanceId();

const GroupHeader = ({
  title,
  content,
  required = false,
  showCheckbox = false,
  children,
  ...rest
}: GroupHeaderProps) => {
  const [disabledInput, setDisabledInput] = useState<boolean>(false);

  return (
    <div className={styles.root} data-group-header data-required={required} {...rest} data-group-disabled={disabledInput}>
      {title ? (
        <h6 data-group-title>
          <span dangerouslySetInnerHTML={{ __html: title }} data-required={required}></span>
        </h6>) : null}
      {content ? <p data-group-subtitle dangerouslySetInnerHTML={{ __html: content }}></p> : null}
      {children}
    </div>
  );

};

export default GroupHeader;
