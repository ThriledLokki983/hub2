
export default function Results({ watchedMovies }) {
	return (
		<p className="num-results">
			Found <strong>{watchedMovies.length}</strong> results
		</p>
	);
};