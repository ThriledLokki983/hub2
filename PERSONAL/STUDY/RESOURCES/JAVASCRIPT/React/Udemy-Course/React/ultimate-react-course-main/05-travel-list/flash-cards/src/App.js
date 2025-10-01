import React from 'react';
import FlashCards from "./components/FlashCards/FlashCards";

import './App.css';

function App() {
	return (
		<div className="app">
			<header className="app-header">
				<h2>FlashCards</h2>
			</header>
			<FlashCards/>
		</div>
	);
}

export default App;
