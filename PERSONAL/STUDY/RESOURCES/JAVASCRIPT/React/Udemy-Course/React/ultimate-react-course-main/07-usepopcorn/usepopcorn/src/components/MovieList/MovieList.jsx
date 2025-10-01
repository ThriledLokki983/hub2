import { Details, MovieItem } from '..';

export default function MovieList({ data, showSummary = false }) {

	return (
		<ul className="list">
			{data?.map((movie) => (
				<MovieItem
					key={`movie-${movie.imdbID}--${movie.Title}`}
					movie={movie}
					showSummary={showSummary}
				/>
			))}
		</ul>
	);

}