import React, { useCallback, useRef } from 'react';
import { Content } from '../Common/styles';
import { MultiButton } from '../Search/search.style';
import { Button, LinkButton } from '../Common/styles';
import useForm from '../../customHooks/useForm';
import { customerDetails } from '../../utils/customerDetails';

// Components Needed
import Form from '../Common/form';

interface NewCustomersProps {
	handlePreviousPage: (progressValue: number) => void;
	handleNextPage: (progressValue: number) => void;
}

const NewCustomer = ({
	handlePreviousPage,
	handleNextPage,
}: NewCustomersProps) => {
	const { renderFormInputs, isFormValid, formData } = useForm(
		customerDetails as any
	);

	const submitHandler = (e: any) => {
		// e.preventDefault();
		console.log('hello');

		// (inputRef.current as any).value = '';
	};

	console.log(formData);

	const goToNextPage = useCallback(() => {
		handleNextPage(50);
	}, [handleNextPage]);

	const goToPreviousPage = useCallback(() => {
		handlePreviousPage(0);
	}, [handlePreviousPage]);

	return (
		<Content>
			<Form onSubmit={submitHandler}>
				{/* ------------------------------------------------------------------------------------- */}
				{renderFormInputs()}
				{/* ------------------------------------------------------------------------------------- */}
				<MultiButton>
					<LinkButton to='/' onClick={goToPreviousPage}>
						Terug
					</LinkButton>
					{/* <LinkButton disabled={!isFormValid()}>Volgende</LinkButton> */}
					<LinkButton to='/order' onClick={goToNextPage}>
						verder
					</LinkButton>
				</MultiButton>
				{/* ------------------------------------------------------------------------------------- */}
			</Form>
		</Content>
	);
};

export default NewCustomer;
