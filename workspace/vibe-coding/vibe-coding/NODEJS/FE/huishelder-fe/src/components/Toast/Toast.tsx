import { useEffect } from 'react';
import { useAppStateContext } from 'contexts';
import { Icon } from 'components';
import { ToastType } from './Toast.interface';
import styles from './Toast.module.scss';

const TOAST_TIMEOUT = 5000; // 5 seconds for non-persistent toasts

interface IconConfig {
  name: string;
  phosphor: 'Info' | 'CheckCircle' | 'Warning' | 'XCircle' | 'X';
}

const getToastIcon = (type: ToastType = 'info'): IconConfig => {
  switch (type) {
    case 'info':
      return { name: 'info', phosphor: 'Info' };
    case 'success':
      return { name: 'check-circle', phosphor: 'CheckCircle' };
    case 'warning':
      return { name: 'warning', phosphor: 'Warning' };
    case 'error':
      return { name: 'x-circle', phosphor: 'XCircle' };
    default:
      return { name: 'info', phosphor: 'Info' };
  }
};

const Toast = () => {
  const { toast, hideToast } = useAppStateContext();

  useEffect(() => {
    if (toast.active && !toast.persistent) {
      const timeout = window.setTimeout(hideToast, TOAST_TIMEOUT);
      return () => window.clearTimeout(timeout);
    }
  }, [toast, hideToast]);

  if (!toast.active) return null;

  const icon = getToastIcon(toast.type as ToastType);

  return (
    <div className={`${styles.toast} ${styles[toast.type || 'info']}`} role="alert">
      <div className={styles.iconWrapper}>
        <Icon name={icon.name} phosphor={icon.phosphor} weight="light" width={20} />
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{toast.title}</h4>
        <p className={styles.message}>{toast.message}</p>
      </div>
      <button className={styles.closeButton} onClick={hideToast} aria-label="Close notification">
        <Icon name="x" phosphor="X" weight="light" width={16} />
      </button>
    </div>
  );
};

export default Toast;
