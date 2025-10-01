import PropTypes from 'prop-types';

const Label = ({ label, htmlFor }) => (
	<label htmlFor={htmlFor}>{label}</label>
);

Label.propTypes = {
	label: PropTypes.string.isRequired,
	htmlFor: PropTypes.string.isRequired,
};

export default Label;