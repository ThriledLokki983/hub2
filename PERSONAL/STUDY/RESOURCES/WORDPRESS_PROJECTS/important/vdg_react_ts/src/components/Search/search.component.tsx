import { useRef, useCallback } from 'react';
import { Content } from '../Common/styles';
import { ButtonBox } from './search.style';
import { LinkButton } from '../Common/styles';

import { cleanupSearchValue } from '../../utils/helper';

import Form from '../Common/form';
import Input from '../UI/Others/Input';
import Modal from '../UI/Modal';
import CustomerDetails from '../Details/customerDetails';

import { useAppSelector } from '../../redux/app/hooks';
import useGetAllRelatedAccounts from '../../customHooks/useGetAllRelatedAccounts';

interface SearchProps {
	onSetSearchedCustomer: (searchedCustomer: any) => void;
	handleNextPage: (progressValue: number) => void;
	setModalValue: (modalOpen: boolean) => void;
	showModal: boolean;
	toggleModal: () => void;
}

const Search = ({
	onSetSearchedCustomer,
	handleNextPage,
	setModalValue,
	showModal,
	toggleModal,
}: SearchProps) => {
	const searchedCustomers = useAppSelector(
		(state) => state.customers.searchedCustomers
	);
	const inputRef = useRef('');

	const submitHandler = useCallback(() => {
		const searchValue = cleanupSearchValue(
			(inputRef.current as any)?.value
		);
		onSetSearchedCustomer(searchValue);
		setModalValue(true);

		(inputRef.current as any).value = '';
	}, [onSetSearchedCustomer, setModalValue]);

	const id = 'search';

	const { accounts: relatedAccounts } = useGetAllRelatedAccounts(
		searchedCustomers,
		onSetSearchedCustomer as any
	);

	const goToNextPage = useCallback(() => {
		handleNextPage(25);
	}, [handleNextPage]);

	return (
		<Content>
			{showModal && !searchedCustomers && (
				<Modal onShowModal={toggleModal}>
					<h1>Searching for customers ....</h1>
				</Modal>
			)}
			<Form>
				<Input
					key={id}
					ref={inputRef}
					label='Klant'
					input={{
						id: 'klant_' + id,
						type: 'text',
						placeholder: 'Zoek naar een klant',
					}}
					searchInput={true}
					onSubmitClick={submitHandler}
					valid={true}
				/>
			</Form>
			{(searchedCustomers as any)?.length > 0 &&
			(relatedAccounts as any)?.length > 0 ? (
				(searchedCustomers as any)?.map((customer: any) =>
					(relatedAccounts as any)?.map((account: any) => {
						if (account?.ID === customer.Account) {
							return (
								<CustomerDetails
									key={customer?.ID}
									customer={customer}
									account={account}
									handleNextPage={goToNextPage}
								/>
							);
						} else {
							return <></>;
						}
					})
				)
			) : (
				<></>
			)}
			<ButtonBox>
				<LinkButton to='/details/new-customer' onClick={goToNextPage}>
					Nieuwe klant
				</LinkButton>
			</ButtonBox>
		</Content>
	);
};

export default Search;
