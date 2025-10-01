import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Reducers
import productReducer from '../features/products/productSlice';
import customerReducer from '../features/customers/customerSlice';
import accountReducer from '../features/accounts/accountSlice';
import { apiSlice } from '../features/api/apiSlice';

const rootReducer = combineReducers({
	customers: customerReducer,
	products: productReducer,
	accounts: accountReducer,
	[apiSlice.reducerPath]: apiSlice.reducer,
});

const actionSanitizer = (action: any) =>
	action.type === 'FILE_DOWNLOAD_SUCCESS' && action.data
		? { ...action, data: '<<LONG_BLOB>>' }
		: action;

const persistConfig = {
	key: 'root',
	storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	//* https://github.com/zalmoxisus/redux-devtools-extension/issues/455#issuecomment-404538385 * //
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({ serializableCheck: false }).concat(
			apiSlice.middleware
		);
	},
});

// enable listener behavior for the store
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
