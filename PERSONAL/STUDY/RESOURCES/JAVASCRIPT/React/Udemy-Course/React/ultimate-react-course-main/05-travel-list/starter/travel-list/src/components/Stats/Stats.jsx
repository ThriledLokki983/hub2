const Stats = ({ items }) => {

	if (!items.length) {
		return (
			<em className="stats">
				Start adding some items to your packing list 🚀
			</em>
			)
	}

	const total = items.length;
	const packedItems = items.filter((item) => item.packed)?.length;
	const percentage = Math.round((packedItems / total) * 100);

	return (
		<footer className="stats">
			<em>
				{ percentage === 100 ? 'You are ready to go ✈️' :
				`🧳 You have ${total === 0 ? 'no' : total } items on your list, and you already packed ${packedItems} (${percentage}%)`
				}
			</em>
		</footer>
		);
};

export default Stats;