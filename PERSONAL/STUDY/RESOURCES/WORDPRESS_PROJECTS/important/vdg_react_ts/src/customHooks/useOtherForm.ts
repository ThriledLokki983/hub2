import { useState } from 'react';

const useForm = (initialValues: any) => {
	const [values, setValues] = useState(initialValues);

	return [
		values,
		(event: Event) => {
			const targetValue = (event.target as HTMLInputElement).value;

			setValues({
				...values,
				[(event as any)?.target.name]: targetValue,
			});
		},
		// get all in input fields in the form and create a new object with the values  of the input fields and the name of the input fields
		document
			.querySelectorAll('input, select, textarea')
			.forEach((input) => {
				const inputName = input.getAttribute('name');
				const isvalid = (input as any).validity.valid;
				const inputValue = (input as any).value;
				const newObject = { [inputName!]: inputValue };
				// console.log(isvalid);

				// console.log(newObject);
			}),
	];

	// function that takes a
};

export default useForm;
