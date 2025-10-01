import { countries } from './data/countriesData';
import { createFormFieldConfig } from './formFieldConfig';
import {
	requiredRule,
	minLengthRule,
	maxLengthRule,
} from './inputValidationRules';

// object representation of the  form

export const customerDetails = {
	aanhef: {
		...createFormFieldConfig(
			'Aanhef',
			'aanhef',
			'radio',
			'',
			false,
			[],
			'',
			false,
			0,
			true,
			['Dhr', 'Mevrouw']
		),
		validationRules: [requiredRule('aanhef')],
	},
	voorletters: {
		...createFormFieldConfig('Voorletters(s)', 'voorletters', 'text'),
		validationRules: [
			requiredRule('voorletters'),
			minLengthRule('voorletters', 3),
			maxLengthRule('voorletters', 5),
		],
	},
	voornaam: {
		...createFormFieldConfig('Voornaam', 'voornaam', 'text'),
		validationRules: [
			requiredRule('voornaam'),
			minLengthRule('voornaam', 3),
			maxLengthRule('voornaam', 25),
		],
	},
	tussenvoegsel: {
		...createFormFieldConfig('Tussenvoegsel', 'tussenvoegsel', 'text'),
		validationRules: [
			requiredRule('tussenvoegsel'),
			minLengthRule('tussenvoegsel', 3),
			maxLengthRule('tussenvoegsel', 25),
		],
	},
	achternaam: {
		...createFormFieldConfig('Achternaam', 'achternaam', 'text'),
		validationRules: [
			requiredRule('achternaam'),
			minLengthRule('achternaam', 3),
			maxLengthRule('achternaam', 25),
		],
	},
	btw_nummer: {
		...createFormFieldConfig('BTW Nummer', 'btw_nummer', 'text'),
		validationRules: [
			requiredRule('btw_nummer'),
			minLengthRule('btw_nummer', 3),
			maxLengthRule('btw_nummer', 25),
		],
	},
	address: {
		...createFormFieldConfig('Adres', 'address', 'text'),
		validationRules: [
			requiredRule('address'),
			minLengthRule('address', 3),
			maxLengthRule('address', 25),
		],
	},
	postcode: {
		...createFormFieldConfig('Postcode', 'postcode', 'text'),
		validationRules: [
			requiredRule('postcode'),
			minLengthRule('postcode', 3),
			maxLengthRule('postcode', 25),
		],
	},
	plaats: {
		...createFormFieldConfig('Plaats', 'plaats', 'text'),
		validationRules: [
			requiredRule('plaats'),
			minLengthRule('plaats', 3),
			maxLengthRule('plaats', 25),
		],
	},
	land: {
		...createFormFieldConfig(
			'Land',
			'land',
			'',
			'',
			true,
			countries,
			'Nederland'
		),
		validationRules: [requiredRule('land')],
	},
	email: {
		...createFormFieldConfig('E-mailadres', 'email', 'email'),
		validationRules: [
			requiredRule('email'),
			minLengthRule('email', 3),
			maxLengthRule('email', 25),
		],
	},
	telefoonnummer: {
		...createFormFieldConfig('Telefoonnummer', 'telefoonnummer', 'number'),
		validationRules: [
			requiredRule('telefoonnummer'),
			minLengthRule('telefoonnummer', 3),
			maxLengthRule('telefoonnummer', 25),
		],
	},
	extraopmerking: {
		...createFormFieldConfig(
			'Extra opmerkingen',
			'extraopmerking',
			'text',
			'',
			false,
			'',
			'',
			true,
			5
		),
		validationRules: [
			requiredRule('extraopmerking'),
			minLengthRule('extraopmerking', 2),
			maxLengthRule('extraopmerking', 25),
		],
	},
};
