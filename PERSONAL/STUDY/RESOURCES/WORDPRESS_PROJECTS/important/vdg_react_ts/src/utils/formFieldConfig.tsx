import Input from '../components/UI/Input/Input';
import Select from '../components/UI/Select/Select';
import TextArea from '../components/UI/TextArea/TextArea';
import RadioGroup from '../components/UI/Radio/RadioGroup';

/**
 * creates and returns object representation of form field
 *
 * @param {string} label - label to show with the form input
 * @param {string} name - input name
 * @param {string} type - input type
 * @param {string} defaultValue - default value for the input
 */
export function createFormFieldConfig(
	label: string,
	name: string,
	type: string,
	defaultValue = '',
	select: boolean = false,
	data: any = [],
	selected: string = '',
	textArea: boolean = false,
	rows: number = 5,
	radio: boolean = false,
	titles: string[] = ['Dhr', 'Mevrouw']
) {
	return {
		renderInput: (
			handleChange: () => void,
			value: string | number | any,
			isValid: boolean,
			error: string,
			key: string
		) => {
			return !select && !textArea && !radio ? (
				<Input
					key={key}
					name={name}
					type={type}
					label={label}
					isValid={isValid}
					value={value}
					handleChange={handleChange}
					errorMessage={error}
				/>
			) : selected && !textArea && !radio ? (
				<Select
					key={key}
					label={label}
					name={name}
					value={selected}
					data={data}
					handleChange={handleChange}
				/>
			) : textArea && !select && !radio ? (
				<TextArea
					key={key}
					label={label}
					name={name}
					value={value}
					rowNumber={rows}
					isValid={isValid}
					errorMessage={error}
					handleChange={handleChange}
				/>
			) : (
				<RadioGroup
					key={key}
					handleChange={handleChange}
					label={label}
					name={name}
					value={value}
					errorMessage={error}
					isValid={isValid}
					type={type}
					titles={titles}
				/>
			);
		},
		label,
		value: defaultValue,
		valid: false,
		errorMessage: '',
		touched: false,
	};
}
