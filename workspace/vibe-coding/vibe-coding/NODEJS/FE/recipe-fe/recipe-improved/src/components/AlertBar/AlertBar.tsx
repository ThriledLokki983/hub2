import { useLayoutEffect, useState } from 'react';

import { Icon } from 'components';
import { AlertBarProps, IconMapProps } from './AlertBar.interface';

import styles from './AlertBar.module.scss';


const ICON_MAP: IconMapProps = {
  notice: 'exclamation-circle',
  success: 'checkmark-circle',
  warning: 'exclamation-triangle',
  error: 'exclamation-triangle',
};

const AlertBar = ({
  hidden = false,
  variation = 'notice',
  children,
  ...props
}: AlertBarProps) => {

  const [isHiding, setIsHiding] = useState(hidden);
  const [isHidden, setIsHidden] = useState(hidden);

  /**
   * Reset state if there's a unique `id` provided and it changes.
   */
  useLayoutEffect(() => {
    setIsHiding(hidden);
    setIsHidden(hidden);
  }, [hidden, props.id]);

  /**
   * Handle close/remove clicks.
   */
  const removeHandler = () => {
    setIsHiding(true);
    window.setTimeout(() => setIsHidden(true), 500);
  };

  return isHidden
    ? null
    : (
      <div
        role="alert"
        className={styles.root}
        data-hiding={isHiding}
        data-variation={variation}
        alert-bar=""
        {...props}>
          <Icon name={`${ICON_MAP[variation]}`} color="currentColor" />
          <div className={styles.root__content}>
            {children}
          </div>
          <button
            className={styles.root__remove}
            type="button"
            onClick={removeHandler}
            aria-label={`Close warning`}
          >
            <Icon
              name="cross-fill"
              color="currentColor"
            />
          </button>
      </div>
    );

};

export default AlertBar;
