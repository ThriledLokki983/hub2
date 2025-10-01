import React from 'react';
import { FormContainer } from './styles';

interface FormProps {
	children: any;
	onSubmit?: (e: any) => void;
}

const Form = ({ children, onSubmit }: FormProps) => {
	const handleSubmit = (e: any) => {
		e.preventDefault();
		onSubmit?.(e);
	};
	return <FormContainer onSubmit={handleSubmit}>{children}</FormContainer>;
};

export default Form;
