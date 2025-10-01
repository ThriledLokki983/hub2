import { useCallback } from 'react';
import useForm from '../../customHooks/useForm';
import useFillForm from '../../customHooks/useFillForm';
import { customerDetails } from '../../utils/customerDetails';
import { Content } from '../Common/styles';
import { MultiButton } from '../Search/search.style';
import { Button, LinkButton } from '../Common/styles';
import { remapClientData } from '../../utils/helper';

import Form from '../Common/form';

import '../../components/SignUp/signupForm.css';

import { useAppSelector } from '../../redux/app/hooks';
// import { getClient } from '../../redux/features/customers/customerSlice';
// import useCustomerAndAccount from '../../customHooks/useCustomerAccount';

interface CustomerDetailsProps {
	handlePreviousPage: (progressValue: number) => void;
	handleNextPage: (progressValue: number) => void;
	setModalValue: (modalOpen: boolean) => void;
}

const Customer = ({
	handlePreviousPage,
	handleNextPage,
	setModalValue,
}: CustomerDetailsProps) => {
	const client = useAppSelector((state) => state.customers.client);
	const { renderFormInputs, isFormValid, onFormSubmit, fillCustomerForm } =
		useForm(customerDetails as any);

	const goToNextPage = useCallback(() => {
		handleNextPage(50);
	}, [handleNextPage]);

	const goToPreviousPage = useCallback(() => {
		handlePreviousPage(0);
		setModalValue(false);
	}, [handlePreviousPage, setModalValue]);

	const remappedData = remapClientData(client);

	fillCustomerForm(remappedData);

	return (
		<Content>
			<Form onSubmit={onFormSubmit}>
				{renderFormInputs()}
				{/* ------------------------------------------------------------------------------------- */}
				<MultiButton>
					<LinkButton to='/' onClick={goToPreviousPage}>
						Terug
					</LinkButton>
					<Button disabled={!isFormValid()}>
						klantgegevens opslaan
					</Button>
					<LinkButton to='/order' onClick={goToNextPage}>
						verder
					</LinkButton>
				</MultiButton>
				{/* ------------------------------------------------------------------------------------- */}
			</Form>
		</Content>
	);
};

export default Customer;
