import React from 'react';
import { FieldGroupSelect, Label, SelectGroupDiv } from '../Common/styles';
import {
	Input,
	InputContainer,
	InputContent,
	InputFieldContainer,
	LabelContainer,
} from '../UI/Input/InputStyles';

const ProductExtraSearch = () => {
	return (
		<FieldGroupSelect>
			<SelectGroupDiv>
				<div>
					<div>
						<label htmlFor='extra'>Extra</label>
						<select
							className='extrapicker input search-input select'
							id='extra'
							aria-label='form-select'>
							{' '}
							<option value=''>kies uw extra</option>
						</select>
						<button className='btn__add search-extra add-extra'>
							+
						</button>
					</div>

					<div>
						<label htmlFor='opties' className='label'>
							Sluiting
						</label>
						<select
							className='optiespicker input search-input select'
							id='opties'
							aria-label='form-select'>
							{' '}
							<option value=''>kies uw opties</option>
						</select>
						<button className='btn__add search-extra add-option'>
							+
						</button>
					</div>
				</div>
				<InputContainer>
					<InputContent>
						<LabelContainer>
							<Label htmlFor='bijzonderheden'>
								Bijzonderheden
							</Label>
						</LabelContainer>
						<InputFieldContainer>
							<Input
								type='text'
								name='bijzonderheden'
								// value=''
								id='bijzonderheden'
								// onChange={handleChange}
								// ref={inputRef}
							/>
						</InputFieldContainer>
					</InputContent>
				</InputContainer>
			</SelectGroupDiv>
		</FieldGroupSelect>
	);
};

export default ProductExtraSearch;
