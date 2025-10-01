import { useState, useEffect, useCallback } from 'react';

// a customer hook that takes a form object and and values object and returns a form object with the values set

function useFillForm(formObj: any, values: any) {
	const [form, setForm] = useState(formObj);

	// function renderFormInputs() {
	// 	return Object.values(form).map((inputObj: any) => {
	// 		const { value, label, errorMessage, valid, renderInput } = inputObj;
	// 		return renderInput(
	// 			onInputChange,
	// 			value,
	// 			valid,
	// 			errorMessage,
	// 			label
	// 		);
	// 	});
	// }

	useEffect(() => {
		if (values) {
			const newForm = { ...form };
			for (const key in newForm) {
				newForm[key].value = values[key];
				newForm[key].touched = true;
				newForm[key].valid = true;
			}
			setForm(newForm);
			console.log(form);
		}
	}, []);

	// watch for changes in the form object and update the form state
	useEffect(() => {
		setForm(formObj);
	}, [formObj]);

	return { form };
}

export default useFillForm;
