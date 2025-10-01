import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";

const Backdrop = ({ onCloseModal }) => {
	return <div className={classes["backdrop"]} onClick={onCloseModal} />;
};

const ModalOverlay = ({ children }) => {
	return (
		<div className={classes["modal"]}>
			<div className={classes["content"]}>{children}</div>
		</div>
	);
};

const Modal = ({ onShowModal, children }) => {
	const portalElement = document.getElementById("overlays");
	return (
		<Fragment>
			{ReactDOM.createPortal(
				<Backdrop onCloseModal={onShowModal} />,
				portalElement
			)}
			{ReactDOM.createPortal(
				<ModalOverlay>{children}</ModalOverlay>,
				portalElement
			)}
		</Fragment>
	);
};

export default Modal;
