import React, { memo } from 'react';
import { FormFieldInput, SearchButton } from '../../Common/styles';
import {
	InputContainer,
	InputContent,
	LabelContainer,
	InputFieldContainer,
	Input as InputComponent,
	Label,
} from '../Input/InputStyles';
import { InputProps } from '../../../utils/components-interfaces';

const Input = React.forwardRef(
	({ label, input, onSubmitClick, searchInput, valid }: InputProps, ref) => {
		const clickHandler = (event: any) => {
			event.preventDefault();
			onSubmitClick();
		};

		return (
			<InputContainer>
				<InputContent>
					<LabelContainer>
						<Label htmlFor={label}>{label}</Label>
					</LabelContainer>
					<InputFieldContainer>
						<FormFieldInput className='pos-rel'>
							<InputComponent
								ref={ref}
								{...input}
								className={valid ? '' : 'invalid'}
							/>
							{searchInput && (
								<SearchButton onClick={clickHandler}>
									Zoek
								</SearchButton>
							)}
						</FormFieldInput>
					</InputFieldContainer>
				</InputContent>
			</InputContainer>
		);
	}
);

export default memo(Input);
