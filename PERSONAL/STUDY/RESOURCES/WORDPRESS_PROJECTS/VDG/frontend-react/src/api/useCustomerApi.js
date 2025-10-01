import { useEffect, useState } from 'react';
import { useApi } from "../hooks";

export const useCustomerApi = (customer, firstName = true) => {
	const [customerName, setCustomerName ] = useState(customer);
	const [customers, setCustomers] = useState([]);

	const apiProps = {
		endpoint: `/contacts/${firstName ? 'customer': 'fullName'}/${customerName}`,
		method: "GET",
		cache: true,
	}

	const { get: getCustomers } = useApi(apiProps);

	useEffect(() => {
	setCustomerName(customer);

	if (customerName === "") {
		return
	} else {
		getCustomers().then(data => {
			setCustomers(data);
		});
	}
	}, [customerName, customer]);

	  return { customers };
};