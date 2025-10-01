import React from 'react';
import './input.css';

interface InputFieldProps {
	label: string;
	type: string;
	name: string;
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	errorMessage: string;
	isValid: boolean;
	value: string;
	placeholder: string;
	// key: number | string;
}

const InputField = ({
	label,
	type,
	name,
	handleChange,
	errorMessage,
	isValid,
	value,
	placeholder,
}: InputFieldProps) => {
	// console.log({
	// 	label,
	// 	type,
	// 	name,
	// 	handleChange,
	// 	errorMessage,
	// 	isValid,
	// 	value,
	// });

	return (
		<div className='inputContainer'>
			<label>{label}</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				// key={key}
			/>
			{errorMessage && !isValid && (
				<span className='error'>{errorMessage}</span>
			)}
		</div>
	);
};

export default InputField;
