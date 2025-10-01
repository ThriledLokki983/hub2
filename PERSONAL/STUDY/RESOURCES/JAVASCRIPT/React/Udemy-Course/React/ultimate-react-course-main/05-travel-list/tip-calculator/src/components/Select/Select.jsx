
import PropTypes from 'prop-types';

const Select = ({ options, value, id, onChange }) => {
	return (
		<select value={value} onChange={onChange} id={id} name={id}>
			{options.map((option) => (
				<option key={option.label} value={option.value}>{option.label}</option>
			))}
		</select>
	);
};

Select.propTypes = {
	options: PropTypes.array.isRequired,
	value: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default Select;