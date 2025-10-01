import { createFormFieldConfig } from './formFieldConfig';

import {
	requiredRule,
	minLengthRule,
	maxLengthRule,
	passwordMatchRule,
} from './inputValidationRules';

// object representation of signup form
export const signupForm = {
	name: {
		...createFormFieldConfig('Full Name', 'name', 'text'),
		validationRules: [
			requiredRule('name'),
			minLengthRule('name', 3),
			maxLengthRule('name', 25),
		],
	},
	email: {
		...createFormFieldConfig('Email', 'email', 'email'),
		validationRules: [
			requiredRule('email'),
			minLengthRule('email', 10),
			maxLengthRule('email', 25),
		],
	},
	password: {
		...createFormFieldConfig('Password', 'password', 'password'),
		validationRules: [
			requiredRule('password'),
			minLengthRule('password', 8),
			maxLengthRule('password', 20),
		],
	},
	confirmPassword: {
		...createFormFieldConfig(
			'Confirm Password',
			'confirmPassword',
			'password'
		),
		validationRules: [passwordMatchRule()],
	},
};
