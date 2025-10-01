import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import classes from './Modal.module.css';
import {
	BackdropProps,
	ModalOverlayProps,
	ModalProps,
} from '../../utils/components-interfaces';

const Backdrop = ({ onCloseModal }: BackdropProps) => {
	return <div className={classes['backdrop']} onClick={onCloseModal} />;
};

const ModalOverlay = ({ children }: ModalOverlayProps) => {
	return (
		<div className={classes['modal']}>
			<div className={classes['content']}>{children}</div>
		</div>
	);
};

const Modal = ({ onShowModal, children }: ModalProps) => {
	const portalElement = document.getElementById('overlays');

	return (
		<Fragment>
			{ReactDOM.createPortal(
				<Backdrop onCloseModal={onShowModal} />,
				portalElement as HTMLElement
			)}
			{ReactDOM.createPortal(
				<ModalOverlay>{children}</ModalOverlay>,
				portalElement as HTMLElement
			)}
		</Fragment>
	);
};

export default Modal;
