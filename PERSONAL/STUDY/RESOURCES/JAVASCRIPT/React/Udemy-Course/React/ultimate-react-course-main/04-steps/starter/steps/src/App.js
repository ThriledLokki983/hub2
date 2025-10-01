import React, { useState } from 'react';

const messages = [
  "Learn React ⚛️",
  "Apply for jobs 💼",
  "Invest your new income 🤑",
];

function App() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  const previousButtonClickHandler = () => {
    setStep((prevState) => Math.max(prevState - 1, 1));
  };

  const nextButtonClickHandler = () => {
    setStep((prevState) => Math.min(prevState + 1, 3));
  };

  return (
    <>
      <div className='buttons close'>
        <Button bgColor={`${!isOpen ? '' : '#7950f2'}`} onButtonClick={() => setIsOpen((prevState) => !prevState)}>
          &times;
        </Button>
      </div>
      {/*{isOpen ? (*/}
        <div className={`steps ${isOpen ? '' : 'hide'}`}>
          <Steps step={step} />
          <StepMessage step={step}>
            {messages[step - 1]}
					</StepMessage>
          <div className='buttons'>
            <Button bgColor={`${step <= 1 ? '' : '#7950f2'}`} onButtonClick={previousButtonClickHandler} disable={step<= 1}>
              <span>👈</span>
              Previous
            </Button>
            <Button bgColor={`${step >= 3 ? '' : '#7950f2'}`} onButtonClick={nextButtonClickHandler} disable={step >= 3}>
              <span>👉</span>
              Next
            </Button>
          </div>
        </div>
      {/*) : null}*/}
    </>
  );
}

const StepMessage = ({step, children }) => {
  return (
    <div className='message'>
      <h3>Step {step}:</h3>
      {children}
    </div>
  )
};

const Button = ({ bgColor, onButtonClick, children }) => {
  return (
    <button
      style={{
      backgroundColor: bgColor,
      color: '#fff',
     }}
      onClick={onButtonClick}
    >
      {children}
    </button>
  )
}

const Steps = ({ step }) => {
  return (
    <div className='numbers'>
      <div className={step >= 1 ? 'active' : ''}>1</div>
      <div className={step >= 2 ? 'active' : ''}>2</div>
      <div className={step >= 3 ? 'active' : ''}>3</div>
    </div>
  )
}

export default App;
