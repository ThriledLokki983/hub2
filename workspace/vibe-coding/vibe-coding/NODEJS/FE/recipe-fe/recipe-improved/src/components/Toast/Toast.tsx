// noinspection HtmlUnknownAttribute

import { useEffect } from 'react';

import { useAppStateContext } from 'contexts';
import { Button, Icon } from 'components';
import { URLLocation } from './Toast.interface';

import styles from './Toast.module.scss';


const ERROR_TIMEOUT = 7500;
const MESSAGE_TIMEOUT = 2000;

let TIMEOUT: number | null = null;

/**
 * Toast, used for showing errors and messages.
 */
const Toast = () => {

  const { toast, hideToast } = useAppStateContext();

  const hide = () => hideToast();

  useEffect(() => {
    if (toast.active && !toast.persistent) {
      const delay = toast.type === 'message'
        ? MESSAGE_TIMEOUT
        : ERROR_TIMEOUT;
      TIMEOUT = window.setTimeout(hideToast, delay);
    }
    return () => window.clearTimeout(TIMEOUT as number);
  }, [toast, hideToast]);

  /**
   * Handle close button click.
   */
  const clickHandler = () => {
    if (toast.button?.url) {
      window.location = toast.button.url as URLLocation;
    } else if (toast.reload) {
      window.location.reload();
    } else {
      hide();
    }
  };

  return (
    <div
      className={styles.root}
      role="alert"
      data-type={toast.type}
      aria-hidden={!toast.active}
    >
      <div className={styles.root__inner}>
        <div className={styles.root__content}>
          <h3>{toast.title || `Request failed`}</h3>
          <p>{toast.message || `Unknown error`}</p>
        </div>
        <Button
          type="button"
          url={toast.button?.url}
          onClick={clickHandler}
          data-has-label={toast.reload || !!toast.button?.label}
        >
          {toast.reload
            ? 'Reload'
            : toast.button?.label
              ? toast.button.label
              : <Icon name="cross-fill" color="currentColor"/>
          }
        </Button>
      </div>
    </div>
  );

};

export default Toast;
