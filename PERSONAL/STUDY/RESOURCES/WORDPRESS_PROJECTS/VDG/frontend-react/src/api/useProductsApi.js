import { useEffect, useState } from 'react';
import { useApi } from "../hooks";

export const useProductsApi = () => {
	const [value, setValue ] = useState([]);

	const apiProps = {
		endpoint: "/products",
		method: "GET",
		cache: true,
	}
	  const { get: getProducts } = useApi(apiProps);

	  useEffect(() => {
		getProducts().then(data => {
		  setValue(data);
		});
	  }, []);

	  if (!value) {
		return [];
	  }

	  const { status, data } = value;

	  if (status === 'success') {
		return { data };
	  } else {
		return [];
	  }
};