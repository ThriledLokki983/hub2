import { useState } from 'react';

import { AccordionItem } from '../';

export default function Accordion({ data = [] }) {
	const [isOpen, setCurOpen] = useState(null);

	return (
		<div className="accordion">
			{data.map((item, index) =>
				<AccordionItem
					key={`${item.title}-${index+100}`}
					number={index}
					curOpen={isOpen}
					onOpen={setCurOpen}
					title={item.title}
					text={item.text}
				/>
			)}
		</div>
	);
}

