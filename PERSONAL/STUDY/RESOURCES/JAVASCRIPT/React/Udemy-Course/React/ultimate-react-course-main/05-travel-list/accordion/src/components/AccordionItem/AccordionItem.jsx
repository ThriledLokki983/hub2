import { useState } from 'react';

const AccordionItem = ({ number = 0, curOpen, onOpen, title = '', text = '' }) => {
	const isOpen = curOpen === number;

	const handleToggle = () => {
		onOpen(isOpen ? null : number);
	}

	return (
		<div className={`item ${isOpen ? 'open' : ''}`} onClick={handleToggle}>
			<p className="number">{number < 9 ? `0${number + 1}` : `${number + 1}`}</p>
			<p className="text">{title}</p>
			<p className="icon">{isOpen ? '-' : '+'}</p>
			{isOpen ? <div className="content-box">{text}</div> : null }
		</div>
	)
};

export default AccordionItem;