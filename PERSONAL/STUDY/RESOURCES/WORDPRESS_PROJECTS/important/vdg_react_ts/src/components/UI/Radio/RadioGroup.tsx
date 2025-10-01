import React from 'react';
import {
	ErrormessageContainer,
	InputContainer,
	InputContent,
	Label,
	LabelContainer,
	RadioGroup as RadioField,
	RadioInput,
	RadioInputContainer,
	RadioLabel,
} from '../Input/InputStyles';

interface RadioProps {
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	label: string;
	type: string;
	name: string;
	value?: string;
	titles: string[];
	errorMessage: string;
	isValid: boolean;
}

const RadioGroup = ({
	handleChange,
	label,
	name,
	titles,
	type,
	errorMessage,
	isValid,
}: RadioProps) => {
	return (
		<InputContainer>
			<InputContent>
				<LabelContainer>
					<Label htmlFor='aanhef'>{label}</Label>
				</LabelContainer>
				<RadioField>
					{titles.map((title: string) => (
						<RadioInputContainer key={title}>
							<RadioInput
								type={type}
								value={title}
								id={title}
								name={name}
								onChange={handleChange}
							/>
							<RadioLabel htmlFor={title}>{title}</RadioLabel>
						</RadioInputContainer>
					))}
				</RadioField>
			</InputContent>
			<ErrormessageContainer>
				<span></span>
				{errorMessage && !isValid && (
					<span className='error'>{errorMessage}</span>
				)}
			</ErrormessageContainer>
		</InputContainer>
	);
};

export default RadioGroup;
