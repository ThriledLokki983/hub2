import React, { useCallback } from 'react';
import { Content, LinkButton, Button } from '../Common/styles';
import { MultiButton } from '../Search/search.style';

interface OverviewProps {
	handlePreviousPage: (progressValue: number) => void;
	handleNextPage: (progressValue: number) => void;
}

const Overview = ({ handlePreviousPage, handleNextPage }: OverviewProps) => {
	const goToNextPage = useCallback(() => {
		handleNextPage(100);
	}, [handleNextPage]);

	const goToPreviousPage = useCallback(() => {
		handlePreviousPage(50);
	}, [handlePreviousPage]);
	return (
		<Content>
			<div>Overview</div>

			{/* ------------------------------------------------------------------------------------- */}
			<MultiButton>
				<LinkButton to='/order' onClick={goToPreviousPage}>
					Terug
				</LinkButton>
				<Button>afdrukken</Button>
				<LinkButton to='/overview' onClick={goToNextPage}>
					afronden
				</LinkButton>
			</MultiButton>
			{/* ------------------------------------------------------------------------------------- */}
		</Content>
	);
};

export default Overview;
