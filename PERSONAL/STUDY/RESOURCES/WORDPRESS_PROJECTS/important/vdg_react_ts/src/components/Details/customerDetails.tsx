import React, { useCallback } from 'react';
import { Details, Span } from './details.styles';
import { useAppDispatch } from '../../redux/app/hooks';
import { setClient } from '../../redux/features/customers/customerSlice';

interface DetailsProps {
	customer: any;
	account: any;
	handleNextPage: (progressValue: number) => void;
}

const CustomerDetails = ({
	customer,
	account,
	handleNextPage,
}: DetailsProps) => {
	const dispatch = useAppDispatch();
	const firstLetter = customer?.FirstName?.charAt(0);
	const fullName = `${firstLetter ? `${firstLetter}.` : ''} ${
		customer?.LastName ? customer?.LastName : ''
	}`;

	const goToNextPage = useCallback(() => {
		handleNextPage(25);
		let customerDetails = { ...customer, ...account };
		dispatch(setClient(customerDetails));
	}, [account, customer, handleNextPage, dispatch]);

	return (
		<Details
			to={`/customer-details/${customer?.Account}}`}
			onClick={goToNextPage}
			key={customer.Account}>
			<Span>{fullName}</Span>
			<Span>
				{customer?.City
					? customer.City
					: account?.City
					? account?.City
					: '******'}
			</Span>
			<Span>
				{customer?.Email
					? customer.Email
					: account?.Email
					? account?.Email
					: '******'}
			</Span>
		</Details>
	);
};

export default CustomerDetails;
