import React, { useRef } from 'react';
import {
	FormField,
	FormFieldLabel,
	FormFieldInput,
	Label,
	Input,
	SearchButton,
} from './styles';

interface FormGroupProps {
	labelTitle: string;
	inputType: string;
	placeholder: string;
}

const FormGroup = ({ labelTitle, inputType, placeholder }: FormGroupProps) => {
	const searchInputValue = useRef<any>('');

	return (
		<FormField>
			<FormFieldLabel>
				<Label>{labelTitle}</Label>
			</FormFieldLabel>
			<FormFieldInput className='pos-rel'>
				<Input
					type={inputType}
					placeholder={placeholder}
					ref={searchInputValue}
				/>
				<SearchButton
					onClick={() => {
						console.log('hello');
					}}>
					Zoek
				</SearchButton>
			</FormFieldInput>
		</FormField>
	);
};

export default FormGroup;
