import React, { useCallback } from 'react';
import { Content, LinkButton, ProductSearchForm } from '../Common/styles';
import { MultiButton } from '../Search/search.style';

import ProductSearch from './ProductSearch';
import ProductExtraSearch from './ProductExtraSearch';
import SearchResults from './SearchResults';
import Basket from './Basket';

interface OrderProps {
	handlePreviousPage: (progressValue: number) => void;
	handleNextPage: (progressValue: number) => void;
}

const Order = ({ handlePreviousPage, handleNextPage }: OrderProps) => {
	const handleSubmission = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const goToNextPage = useCallback(() => {
		handleNextPage(75);
	}, [handleNextPage]);

	const goToPreviousPage = useCallback(() => {
		handlePreviousPage(25);
	}, [handlePreviousPage]);

	return (
		<Content>
			<ProductSearchForm onSubmit={handleSubmission}>
				{/* ------------------------------------------------------------------------------------- */}

				<ProductSearch />
				{/* ------------------------------------------------------------------------------------- */}

				<SearchResults />
				{/* ------------------------------------------------------------------------------------- */}

				<ProductExtraSearch />

				{/* ------------------------------------------------------------------------------------- */}

				<Basket />

				{/* ------------------------------------------------------------------------------------- */}
				<MultiButton>
					<LinkButton
						to='/customer-details/aksajdkla'
						onClick={goToPreviousPage}>
						Terug
					</LinkButton>
					<LinkButton to='/overview' onClick={goToNextPage}>
						verder
					</LinkButton>
				</MultiButton>
				{/* ------------------------------------------------------------------------------------- */}
			</ProductSearchForm>
		</Content>
	);
};

export default Order;
