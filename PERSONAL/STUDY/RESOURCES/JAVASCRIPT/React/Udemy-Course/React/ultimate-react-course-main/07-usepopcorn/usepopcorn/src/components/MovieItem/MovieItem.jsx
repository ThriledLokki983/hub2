import { Details } from '..';

const MovieItem = ({ movie, showSummary }) => {
	return (
		<li>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<Details showSummary={showSummary} movie={movie} />
		</li>
	);
};

export default MovieItem;