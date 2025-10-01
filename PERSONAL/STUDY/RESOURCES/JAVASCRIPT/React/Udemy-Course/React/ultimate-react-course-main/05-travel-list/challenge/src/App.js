import React, { useState } from 'react';
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
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Date Couter. </h1>
      </header>
      <section className="container">
        <Steps step={step} increase={stepIncreaseHandler} decrease={stepDecreaseHandler}/>
        <Counter count={count} increase={countIncreaseHandler} decrease={countDecreaseHandler}/>
        <DateCounter date={date} count={count}/>
      </section>
    </div>
  );
}

const Steps = ({ step, increase, decrease }) => {
  return (
    <div className="block">
      <button className="btn" onClick={decrease}>-</button>
      <span>Step: {step}</span>
      <button className="btn" onClick={increase}>+</button>
    </div>
  )
};

const Counter = ({ count, increase, decrease }) => {
  return (
    <div className="block">
      <button className="btn" onClick={decrease}>-</button>
      <span>Count: {count}</span>
      <button className="btn" onClick={increase}>+</button>
    </div>
  )
};

const DateCounter = ({ date, count }) => {
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
