import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Product } from '../../../utils/types';

interface ProductState {
	products: Product[] | undefined;
}

const initialState: ProductState = {
	products: [],
};

const productSlice = createSlice({
	name: 'Products',
	initialState,
	reducers: {
		setStateProducts(state, action: PayloadAction<any>) {
			state.products = action.payload.data.data;
		},

		getAllProducts(state) {
			return state.products as any;
		},
	},
});

export const { getAllProducts, setStateProducts } = productSlice.actions;
export default productSlice.reducer;
