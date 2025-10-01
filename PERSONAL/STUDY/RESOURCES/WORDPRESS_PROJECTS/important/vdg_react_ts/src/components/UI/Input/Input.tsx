import React from 'react';
import {
	InputContainer,
	InputContent,
	LabelContainer,
	Label,
	InputFieldContainer,
	Input,
	ErrormessageContainer,
} from './InputStyles';

function InputField(props: any) {
	const {
		label,
		type = 'text',
		name,
		value,
		handleChange,
		errorMessage,
		isValid,
	} = props;

	return (
		<InputContainer>
			<InputContent>
				<LabelContainer>
					<Label>{label}</Label>
				</LabelContainer>
				<InputFieldContainer>
					<Input
						type={type}
						name={name}
						onChange={handleChange}
						value={value}
						// ref={inputRef}
					/>
				</InputFieldContainer>
			</InputContent>
			<ErrormessageContainer>
				<span></span>
				{errorMessage && !isValid && (
					<span className='error'>{errorMessage}</span>
				)}
			</ErrormessageContainer>
		</InputContainer>
	);
}

export default React.memo(InputField);
