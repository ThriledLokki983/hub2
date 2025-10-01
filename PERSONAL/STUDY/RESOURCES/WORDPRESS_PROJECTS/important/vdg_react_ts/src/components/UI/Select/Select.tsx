import React from 'react';
import {
	InputContainer,
	InputContent,
	InputFieldContainer,
	Label,
	LabelContainer,
	Select as SelectField,
} from '../Input/InputStyles';

interface SelectProps {
	label: string;
	data: any | [];
	name: string;
	value?: string;
	handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = ({ label, data, handleChange, name, value }: SelectProps) => {
	return (
		<InputContainer>
			<InputContent>
				<LabelContainer>
					<Label htmlFor='land'>{label}</Label>
				</LabelContainer>
				<InputFieldContainer>
					<SelectField onChange={handleChange} name={name}>
						{data?.map((obj: any) => (
							<option key={obj.name} value={obj.name}>
								{obj.name}
							</option>
						))}
					</SelectField>
				</InputFieldContainer>
			</InputContent>
		</InputContainer>
	);
};

export default Select;
