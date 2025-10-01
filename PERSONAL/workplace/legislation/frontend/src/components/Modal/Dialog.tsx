import { useRef } from 'react';
import { Dialog, Modal } from 'react-aria-components';

import { DialogProps } from './Dialog.interface';
import styles from './Dialog.module.scss';


/**
 * Renders the Dialog component.
 *
 * @param {DialogProps} props - The component props.
 * @returns {React.ReactNode} The rendered component.
 */

const MyDialog = ({
  id = 'dialog',
  isOpen = false,
  onClose,
  onOpen,
  isDismissable = true,
  children,
  ...props
}: DialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);


  return (
    <div className={styles.root} id={id} ref={dialogRef}>
      <Modal isDismissable={isDismissable} isOpen={isOpen} onOpenChange={onClose} {...props}>
        <Dialog aria-label={id || `${id}`}>
          {children}
        </Dialog>
      </Modal>
    </div>
  );

};

export default MyDialog;
