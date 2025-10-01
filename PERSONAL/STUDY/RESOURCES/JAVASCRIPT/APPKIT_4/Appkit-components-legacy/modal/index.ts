import ModalHeader, { ModalHeaderProps } from './ModalHeader';
import ModalBody, { ModalBodyProps } from './ModalBody';
import ModalFooter, { ModalFooterProps } from './ModalFooter';

import { confirm, ModalConfirmProps } from './confirm';


import { Modal as internalModal, ModalProps,StaticModal } from './Modal';



interface Modal
  extends React.ForwardRefExoticComponent<
    ModalProps & React.RefAttributes<HTMLDivElement>
  > {
      confirm: typeof confirm;
}

const Modal = internalModal as Modal;

Modal.confirm = confirm;


export { Modal, ModalHeader, ModalBody, ModalFooter,StaticModal };

export type {
    ModalProps, ModalHeaderProps, ModalBodyProps, ModalFooterProps, ModalConfirmProps
}
