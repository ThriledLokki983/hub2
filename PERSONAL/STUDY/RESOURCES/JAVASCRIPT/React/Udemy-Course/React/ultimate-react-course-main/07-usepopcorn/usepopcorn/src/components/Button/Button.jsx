export default function Button({ handleClick, children }) {
	return (
		<button className="btn-toggle" onClick={handleClick}>
			{children}
		</button>
	);
}