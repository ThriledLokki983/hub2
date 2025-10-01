/**
 * creates and returns a validation rule object that
 * is used by useForm hook to validate the form inputs
 *
 * @param {string} ruleName - name of the validation rule
 * @param {string} errorMessage - message to display
 * @param {function} validateFunc - validation function
 */
export function createValidationRule(
	ruleName: string,
	errorMessage: string,
	validateFunc: Function
) {
	return {
		name: ruleName,
		message: errorMessage,
		validate: validateFunc,
	};
}

export function requiredRule(inputName: string) {
	if (inputName) {
		return createValidationRule(
			'required',
			`${inputName} required`,
			(inputValue: string, formObj: any) => inputValue?.length !== 0
		);
	}
}

export function minLengthRule(inputName: string, minCharacters: number) {
	return createValidationRule(
		'minLength',
		`${inputName} should contain at least ${minCharacters} characters`,
		(inputValue: string, formObj: any) =>
			inputValue?.length >= minCharacters
	);
}

export function maxLengthRule(inputName: string, maxCharacters: number) {
	return createValidationRule(
		'minLength',
		`${inputName} cannot contain more than ${maxCharacters} characters`,
		(inputValue: string, formObj: any) =>
			inputValue?.length <= maxCharacters
	);
}

export function passwordMatchRule() {
	return createValidationRule(
		'passwordMatch',
		`passwords do not match`,
		(inputValue: string, formObj: any) =>
			inputValue === formObj.password.value
	);
}
