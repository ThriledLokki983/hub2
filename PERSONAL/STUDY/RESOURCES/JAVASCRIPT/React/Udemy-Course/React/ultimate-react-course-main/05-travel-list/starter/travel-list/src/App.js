import { useState } from 'react';
import { PackingList, Stats, Form, Logo } from './components';

function App() {
	const [items, setItems] = useState([]);

	const handleAddItems = (item) => {
		setItems((prevItems) => [...prevItems, item]);
	}

	const handleDeleteItem = (id) => {
		setItems(items => items.filter(item => item.id !== id))
	};

	const handleToggleItem = (id) => {
		setItems(items => items
		.map((item) => item.id === id ? { ...item, packed: !item.packed} : { ...item }
		));
	};

	const handleClearItems = () => {
		const confirmed = window.confirm('Are you sure you want to dele3te all items?');

		if (confirmed) setItems([]);
	};

	return (
		<div className="app">
			<Logo/>
			<Form onAddItem={handleAddItems}/>
			<PackingList
				list={items}
				onDeleteItem={handleDeleteItem}
				onToggleItem={handleToggleItem}
				onClearItems={handleClearItems}
			/>
			<Stats items={items}/>
		</div>
	);
}

export default App;
