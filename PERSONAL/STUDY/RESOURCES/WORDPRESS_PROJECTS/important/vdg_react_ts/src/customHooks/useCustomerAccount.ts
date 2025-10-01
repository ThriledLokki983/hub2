import { useState, useEffect } from 'react';
import { useAppDispatch } from '../redux/app/hooks';
import { getCustomerByAccountID } from '../redux/features/customers/customerSlice';
import { getAccountByID } from '../redux/features/accounts/accountSlice';

const useCustomerAndAccount = (theID: string) => {
	console.log('useCustomerAndAccount', theID);

	const [customer, setCustomer] = useState<any>();
	const [account, setAccount] = useState<any>();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (theID) {
			const customer = dispatch(getCustomerByAccountID(theID));
			const account = dispatch(getAccountByID(theID));

			setCustomer(customer);
			setAccount(account);
		}
	}, [dispatch, theID]);

	return { customer, account };
};

export default useCustomerAndAccount;
