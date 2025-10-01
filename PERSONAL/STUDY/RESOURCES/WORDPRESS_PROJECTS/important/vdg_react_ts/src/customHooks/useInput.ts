import { useState } from 'react';

export const useInput = (validateValueFn: any) => {
	const [enteredValue, setEnteredValue] = useState('');
	const [isTouch, setIsTouch] = useState(false);

	const valueIsValid = validateValueFn(enteredValue);
	const hasError = !valueIsValid && isTouch;

	const valueChangeHandler = (event: any) => {
		setEnteredValue(event.target.value);
	};

	const inputBlurHandler = () => {
		setIsTouch(true);
	};

	const reset = () => {
		setEnteredValue('');
		setIsTouch(false);
	};

	return {
		value: enteredValue,
		isValid: valueIsValid,
		hasError,
		reset,
		valueChangeHandler,
		inputBlurHandler,
	};
};
