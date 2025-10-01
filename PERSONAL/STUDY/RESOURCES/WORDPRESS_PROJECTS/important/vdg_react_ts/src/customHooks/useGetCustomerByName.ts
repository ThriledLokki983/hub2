import { useState, useEffect } from 'react';

// API
import { useGetCustomerByNameQuery } from '../redux/features/api/apiSlice';
import { useAppDispatch } from '../redux/app/hooks';
import { setStateSearchedCustomers } from '../redux/features/customers/customerSlice';

const useGetCustomerByName = (customerName: string | string[]) => {
	const dispatch = useAppDispatch();
	const [customer, setCustomer] = useState<String | String[]>('');
	const { data: customerData } = useGetCustomerByNameQuery(customer as any, {
		refetchOnMountOrArgChange: false,
	});

	useEffect(() => {
		setCustomer(customerName);
		dispatch(setStateSearchedCustomers((customerData as any)?.data?.data));
	}, [customerName, customerData, dispatch]);

	return { customerData };
};

export default useGetCustomerByName;
