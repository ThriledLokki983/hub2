import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Customer, Product, Account } from '../../../utils/types';

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: '/',
		// baseUrl: 'http://localhost:4000',
	}),
	// keepUnusedDataFor: 30,
	refetchOnMountOrArgChange: 30,
	refetchOnReconnect: true,
	tagTypes: ['Accounts', 'Customer', 'Products'],
	endpoints: (builder) => ({
		//* CUSTOMERS
		getAllCustomers: builder.query<Customer[], ''>({
			query: () => `/contacts`,
		}),

		getCustomerByName: builder.query<Customer, string | string[]>({
			query: (customerName: string | string[]) => {
				return customerName
					? `/contacts/${
							customerName[0]?.length > 2
								? `fullName/${(customerName as string[])?.join(
										' '
								  )}`
								: `customer/${customerName as string}`
					  }`
					: 'hello';
			},
		}),

		getCustomerByAccount: builder.query<Customer, string>({
			query: (customerID: string) => `/contacts/account/${customerID}`,
		}),

		//* ACCOUNTS
		getAccountByID: builder.query<Account, string>({
			query: (accountID: string) => {
				return `/accounts/id/${accountID}`;
			},
		}),

		getAllRelatedAccounts: builder.query<Account[], string>({
			query: (iDLists: string) => {
				return `/accounts/relatedAccounts/${iDLists}`;
			},
		}),

		getAllAccounts: builder.query<Account[], ''>({
			query: () => `/accounts/bulk/all`,
		}),

		//* PRODUCTS / ITEMS
		getAllProducts: builder.query<Product[], string>({
			query: (products) => `${products}`,
		}),
	}),
});

export const {
	useGetAllCustomersQuery,
	useGetCustomerByNameQuery,
	useGetCustomerByAccountQuery,
	useGetAllRelatedAccountsQuery,
	useGetAccountByIDQuery,
	useGetAllAccountsQuery,
	useGetAllProductsQuery,
} = apiSlice;
