import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '../../../utils/types';

interface CustomerState {
	searchedCustomers: Customer[] | [];
	customers: Customer[] | [];
	client: any | null;
}

const initialState: CustomerState = {
	searchedCustomers: [],
	customers: [],
	client: null,
};

const customerSlice = createSlice({
	name: 'Customers',
	initialState,
	reducers: {
		setStateCustomers(state, action: PayloadAction<any>) {
			state.customers = action.payload.data && action.payload.data.data;
		},

		setStateSearchedCustomers(state, action: PayloadAction<any>) {
			state.searchedCustomers = action.payload && action.payload;
		},

		setClient(state, action: PayloadAction<any>) {
			const client = action.payload && action.payload;
			state.client = client;
		},

		getCustomerByAccountID(state, action: PayloadAction<string>): any {
			const results = state.searchedCustomers?.filter(
				(customer: Customer) => customer?.Account === action.payload
			) as any;

			return results;
		},

		getAllCustomers(state) {
			return state.customers as any;
		},
	},
});

export const {
	setStateCustomers,
	setStateSearchedCustomers,
	getAllCustomers,
	getCustomerByAccountID,
	setClient,
} = customerSlice.actions;
export default customerSlice.reducer;
