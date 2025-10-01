import React, {useState} from 'react';
import {questions} from '../../data/data'

const FlashCards = () => {
	const [activeQuestion, setActiveQuestion] = useState(null);

	const toggleActiveQuestion = (id) => {
		setActiveQuestion(id !== activeQuestion ? id : null);
	}

	return (
		<List>
			{questions.map((question) => (
				<Card
					key={`question-${question.id}`}
					cardData={question}
					active={question.id === activeQuestion}
					setActive={() => toggleActiveQuestion(question.id)}
				/>
			))}
		</List>
	)
};

export default FlashCards;

const List = ({children}) => {
	return (
		<ul className="app-list">{children}</ul>
	)
};

const Card = ({cardData = {id: 123, question: '', answer: ""}, setActive, active = false}) => {
	const {question, answer} = cardData;

	return (
		<li
			className={active ? ['app-card', 'selected'].join(' ') : 'app-card'}
			onClick={setActive}
		><span>{!active ? question : answer}</span>
		</li>
	)
}