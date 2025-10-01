import { useState, useEffect } from 'react';
import { Customer } from '../utils/types';
import { useGetAllRelatedAccountsQuery } from '../redux/features/api/apiSlice';
import { useAppDispatch } from '../redux/app/hooks';
import { setStateSearchedAccounts } from '../redux/features/accounts/accountSlice';

const useGetAllRelatedAccounts = (
	customerList: Customer[] | [],
	onSetSearchedCustomer: () => void
) => {
	const dispatch = useAppDispatch();
	const [idLists, setIdLists] = useState<string>('');
	const { data: accountsArray } = useGetAllRelatedAccountsQuery(idLists, {
		pollingInterval: 10000,
		refetchOnMountOrArgChange: true,
		skip: false,
	});

	useEffect(() => {
		let allIDs = '';
		customerList &&
			(customerList as Customer[])?.forEach((customer: any) => {
				allIDs += `${customer?.Account}  `;
			});

		setIdLists(allIDs);
	}, [customerList]);

	useEffect(() => {
		if (accountsArray) {
			dispatch(setStateSearchedAccounts((accountsArray as any)?.data));
		} else {
		}
	}, [accountsArray, dispatch, onSetSearchedCustomer]);

	// const relatedAccounts = useAppSelector(
	// 	(state) => state.accounts.searchedAccounts
	// );

	const accounts = accountsArray && (accountsArray as any)?.data;

	return { accountsArray, accounts };
};

export default useGetAllRelatedAccounts;
