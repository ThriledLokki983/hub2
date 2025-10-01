import { useState } from 'react';
import { Item } from '../';

const PackingList = ({list, onDeleteItem, onToggleItem, onClearItems }) => {
	const [sortBy, setSortBy] = useState('input');
	let sortedItems;
	if (sortBy === 'input') sortedItems = list;
	if (sortBy === 'description') sortedItems = list.slice().sort((a, b) => a.description.localeCompare(b.description));
	if (sortBy === 'packed') sortedItems = list.slice().sort((a, b) => Number(a.packed) - Number(b.packed));

	return (
		<div className="list">
			{sortedItems && !sortedItems.length ? null : (
				<>
				<ul>
					{sortedItems.map((item) => (
						<Item
							key={`item-${item.id}`}
							item={item}
							onDeleteItem={onDeleteItem}
							onToggleItem={onToggleItem}
						/>
						))}
				</ul>

				<div className="actions">
					<select value={sortBy} onChange={(e) => {setSortBy(e.target.value)}}>
						<option value="input">Sort by input order</option>
						<option value="description">Sort by description</option>
						<option value="packed">Sort by status</option>
					</select>
					<button onClick={onClearItems}>Clear list</button>
				</div>
				</>
				)
			}
		</div>
		);
};

export default PackingList;