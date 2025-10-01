import {
	ErrormessageContainer,
	InputContainer,
	InputContent,
	InputFieldContainer,
	Label,
	LabelContainer,
	TextArea as TextAreaField,
} from '../Input/InputStyles';

interface TextAreaProps {
	name: string;
	label: string;
	rowNumber: number | 5;
	value?: string;
	errorMessage: string;
	isValid: boolean;
	handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = ({
	label,
	name,
	rowNumber,
	handleChange,
	value,
	errorMessage,
	isValid,
}: TextAreaProps) => {
	return (
		<InputContainer>
			<InputContent>
				<LabelContainer>
					<Label htmlFor='opmerk'>{label}</Label>
				</LabelContainer>
				<InputFieldContainer>
					<TextAreaField
						rows={rowNumber}
						name={name}
						value={value}
						onChange={handleChange}></TextAreaField>
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
};

export default TextArea;
