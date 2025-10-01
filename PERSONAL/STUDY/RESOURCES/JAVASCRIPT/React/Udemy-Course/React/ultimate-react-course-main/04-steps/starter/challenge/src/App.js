import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
	const [step, setStep] = useState(1);
	const [count, setCount] = useState(step);

	const stepIncreaseHandler = (e) => {
		setStep((prevStep) => Math.min(prevStep + 1, 100));
	};

	const stepDecreaseHandler = (e) => {
		setStep((prevStep) => Math.max(prevStep - 1, 1));
	}

	const countIncreaseHandler = (e) => {
		setCount((prevCount) => Math.min(prevCount + step, 100));
	};

	const countDecreaseHandler = (e) => {
		setCount((prevCount) => Math.max(prevCount - step, 0));
	}

	const date = new Date(new Date().getTime() + count * 24 * 60 * 60 * 1000).toDateString();

	const inputChangehandler = (e) => {
		setStep(Number(e.target.value));
	}

	const changeHandler = (e) => {
		setCount(Number(e.target.value));
	}

	const resetHandler = () => {
		setStep(1);
		setCount(step);
	}

	return (
		<div className="App">
			<header className="App-header">
				<h1>Date Couter. </h1>
			</header>
			<section className="container">
				<Steps step={step} increase={stepIncreaseHandler} decrease={stepDecreaseHandler}/>
				<InputSteps value={step} changeHandler={inputChangehandler}/>
				<Counter count={count} increase={countIncreaseHandler} decrease={countDecreaseHandler} change={changeHandler}/>
				<DateCounter date={date} count={count}/>
				<button className="btn" onClick={resetHandler} disabled={step <= 1 && count <= 0}>Reset</button>
			</section>
		</div>
	);
}

const Steps = ({step, increase, decrease}) => {
	return (
		<div className="block">
			<button className="btn" onClick={decrease}>-</button>
			<span>Step: {step}</span>
			<button className="btn" onClick={increase}>+</button>
		</div>
	)
};

const InputSteps = ({value, changeHandler}) => {
	return (
		<div className="block">
			<input
				className="range-slider"
				type="range"
				min="0"
				max="10"
				step="1"
				value={value}
				onChange={changeHandler}
			/>
		</div>
	)
};

const InputCounter = ({value, chnageHaler}) => {
	return (
		<input
			className="text-input"
			type="text"
			value={value}
			onChange={chnageHaler}
		/>
	)
}

const Counter = ({count, increase, decrease, change}) => {
	return (
		<div className="block">
			<button className="btn" onClick={decrease}>-</button>
			<InputCounter value={count} chnageHaler={change}/>
			{/*<span>Count: {count}</span>*/}
			<button className="btn" onClick={increase}>+</button>
		</div>
	)
};

const DateCounter = ({date, count}) => {
	if (count > 30) {
		const months = Math.floor(count / 30);
		console.log(months);
	}
	const sentence = count > 0
		? `In ${count} day${count > 1 ? 's' : ''} from today is ${date}`
		: `Today is ${date}`;
	return (
		<div className="block">
			<p>{sentence}</p>
		</div>
	)
};

export default App;
