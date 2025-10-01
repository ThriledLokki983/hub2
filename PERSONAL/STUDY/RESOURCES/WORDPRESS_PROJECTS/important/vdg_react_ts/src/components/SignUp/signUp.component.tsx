import React from 'react';
import useForm from '../../customHooks/useForm';
import { signupForm } from '../../utils/formConfig';
import { customerDetails } from '../../utils/customerDetails';
import Form from '../Common/form';

import './signupForm.css';

const SignUpForm = () => {
	const { renderFormInputs, isFormValid, formData } = useForm(
		signupForm as any
	);

	const submitHandler = (event: any) => {
		event.preventDefault();

		console.log(formData);
	};

	return (
		<Form onSubmit={submitHandler}>
			<h1>Sign Up</h1>

			{renderFormInputs()}

			<div className='buttonContainer'>
				<button disabled={!isFormValid()}>Submit</button>
			</div>
		</Form>
	);
};

export default SignUpForm;
