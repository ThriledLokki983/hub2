import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '../../../utils/types';

interface AccountState {
	accounts: Account[] | [];
	searchedAccounts: Account[] | [];
}

const initialState: AccountState = {
	accounts: [],
	searchedAccounts: [],
};

const accountSlice = createSlice({
	name: 'Accounts',
	initialState,
	reducers: {
		setStateAccounts(state, action: PayloadAction<any>) {
			state.accounts = action.payload.data && action.payload.data.data;
		},

		setStateSearchedAccounts(state, action: PayloadAction<any>) {
			return {
				...state,
				searchedAccounts: action.payload,
			};
		},

		getAccountByID(state, action: PayloadAction<string>): any {
			return state.searchedAccounts?.filter(
				(account: Account) => account?.ID === action.payload
			);
		},
		getAllAccounts(state) {
			return state.accounts as any;
		},
	},
});

export const {
	setStateAccounts,
	setStateSearchedAccounts,
	getAllAccounts,
	getAccountByID,
} = accountSlice.actions;
export default accountSlice.reducer;
