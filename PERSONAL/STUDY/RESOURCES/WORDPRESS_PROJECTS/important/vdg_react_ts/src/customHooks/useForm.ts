import { useState, useCallback, useMemo } from 'react';

function useForm(formObj: any) {
	const [form, setForm] = useState(formObj);
	const [formData, setFormData] = useState<any>({});

	function renderFormInputs() {
		return Object.values(form).map((inputObj: any) => {
			const { value, label, errorMessage, valid, renderInput } = inputObj;
			return renderInput(
				onInputChange,
				value,
				valid,
				errorMessage,
				label
			);
		});
	}

	const reRenderFormInputsWithValues = useCallback(
		(valuesObj: any) => {
			const newForm = { ...form };
			for (const key in newForm) {
				newForm[key].value = valuesObj[key];
				newForm[key].touched = true;
				newForm[key].valid = true;
			}
			// setForm(newForm);
		},
		[form]
	);

	const isInputFieldValid = useCallback(
		(inputField: any) => {
			const { value, validationRules } = inputField;

			for (const rule of validationRules) {
				if (!rule?.validate(value, form)) {
					inputField.errorMessage = rule.message;
					return false;
				}
			}
			return true;
		},
		[form]
	);

	const onInputChange = useCallback(
		(event: any) => {
			event.persist();
			const { name, value } = event.target;
			const inputObj = { ...form[name] };
			inputObj.value = value;

			const isValidInput = isInputFieldValid(inputObj);
			if (isValidInput && !inputObj.valid) {
				inputObj.valid = true;

				setFormData({ ...formData, [name]: value });

				console.log('formData', formData);
			} else if (!isValidInput && inputObj.valid) {
				inputObj.valid = false;
			}

			inputObj.touched = true;
			setForm({ ...form, [name]: inputObj });

			return form;
		},
		[form, formData, isInputFieldValid]
	);

	const onFormSubmit = useCallback(
		(event: any) => {
			event.preventDefault();

			const formData: any = {};
			for (const key in form) {
				formData[key] = form[key].value;
			}
			setFormData(formData);
		},
		[form]
	);

	const isFormValid = useCallback(() => {
		let isValid = true;
		const arr: any = Object.values(form);

		for (let i = 0; i < arr.length; i++) {
			if (!arr[i].valid) {
				isValid = false;
				break;
			}
		}

		return isValid;
	}, [form]);

	const fillCustomerForm = useCallback(
		(customer: any) => {
			const newForm: any = {};

			for (const key in form) {
				Object.keys(customer).forEach((customerKey) => {
					if (key === customerKey) {
						if (customer[customerKey] !== null) {
							form[key].value = customer[customerKey]?.trim();
							const inputObj = { ...form[key] };

							inputObj.value = customer[customerKey]?.trim();

							newForm[key].valid = true;
							newForm[key].touch = true;
							newForm[key] = inputObj;
						} else {
							form[key].value = '';
							const inputObj = { ...form[key] };

							inputObj.value = '';

							newForm[key].valid = false;
							newForm[key].touch = false;
							newForm[key] = inputObj;
						}
					} else {
						newForm[key] = form[key];
					}
				});
			}
		},
		[form]
	);

	return {
		renderFormInputs,
		isFormValid,
		onFormSubmit,
		formData,
		fillCustomerForm,
		reRenderFormInputsWithValues,
	};
}

export default useForm;
