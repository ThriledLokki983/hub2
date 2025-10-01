import { useState } from 'react';
import { Button, MovieList, Summary } from '../';

export default function ListBox({ moviesData, showSummary = false }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="box">
			<Button handleClick={() => setIsOpen((open) => !open)}>
				{isOpen ? "–" : "+"}
			</Button>
			{showSummary ? <Summary /> : null }
			{isOpen ? <MovieList data={moviesData} showSummary={showSummary} /> : null}
		</div>
	);
};
