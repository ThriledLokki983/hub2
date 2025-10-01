const Item = ({item, onDeleteItem, onToggleItem }) => {
	const {description, quantity, packed} = item;

	return (
		<li>
			<input type="checkbox" value={item.packed} onChange={() => onToggleItem(item.id)}/>
			<span style={packed ? {textDecoration: "line-through"} : {}}>
				{quantity} {description}
			</span>
			<button onClick={() => onDeleteItem(item.id)}>❌</button>
		</li>
		);
};

export default Item;