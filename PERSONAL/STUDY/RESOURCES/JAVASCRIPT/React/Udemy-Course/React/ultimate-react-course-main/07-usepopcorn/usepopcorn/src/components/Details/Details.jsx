
const Details = ({ movie, showSummary }) => {
	return (
		<>
			{showSummary ? (
				<div>
					<p>
						<span>⭐️</span>
						<span>{movie.imdbRating}</span>
					</p>
					<p>
						<span>🌟</span>
						<span>{movie.userRating}</span>
					</p>
					<p>
						<span>⏳</span>
						<span>{movie.runtime} min</span>
					</p>
				</div>
			) : (
				<div>
					<p>
						<span>🗓</span>
						<span>{movie.Year}</span>
					</p>
				</div>
			)}
		</>
	)
};

export default Details;