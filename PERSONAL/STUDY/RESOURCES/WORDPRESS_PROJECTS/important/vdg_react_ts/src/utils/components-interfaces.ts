export interface BackdropProps {
	onCloseModal: () => void;
}

export interface ModalOverlayProps {
	children: React.ReactNode;
}

export interface ModalProps {
	onShowModal: () => void;
	children: React.ReactNode;
}

export interface InputProps {
	label: string;
	input: any;
	onSubmitClick: () => void;
	searchInput: boolean | false;
	valid: boolean | true;
}
