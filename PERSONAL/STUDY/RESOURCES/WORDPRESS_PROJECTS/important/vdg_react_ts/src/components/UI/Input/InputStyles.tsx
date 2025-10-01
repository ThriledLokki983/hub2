import styled from 'styled-components';

export const InputContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: end;

	&:not(:last-child) {
		margin-bottom: 2rem;
	}
`;

export const InputContent = styled.div`
	width: 100%;
	flex: 1;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	gap: 2rem;
	align-items: center;
	justify-content: space-between;

	& > div:first-of-type {
		flex: 0.2;
	}

	& > div:last-of-type {
		flex: 0.8;
	}

	@media (max-width: 768px) {
		flex-direction: column;
		align-items: flex-start;
	}
`;

export const LabelContainer = styled.div``;

export const Label = styled.label`
	margin: 0 0 6px 0;
	font-size: 1.1rem;
	flex: 0.2;
	font-size: 1.8rem;
`;

export const InputFieldContainer = styled.div`
	width: 100%;
`;

export const Input = styled.input`
	width: 100%;
	padding-block: 1.5rem;
	border: none;
	background-color: #eee;
	outline: none;
	font-size: 1.1rem;
	box-sizing: border-box;
	flex: 0.8;
	padding-inline-start: 1rem;
	font-size: 1.5rem;
	border: 1px solid rgba(51, 51, 51, 0.3);
	transition: all 0.2s;

	&:focus {
		outline: 0;
		box-shadow: 0 1rem 2rem rgb(0 0 0 / 10%);
		border-bottom: 0.3rem solid #333;
	}
`;

export const RadioGroup = styled.div`
	display: inline-block !important;
`;

export const RadioInputContainer = styled.div`
	display: inline-block;
	margin-right: 2rem;
`;

export const RadioLabel = styled.label`
	width: 8rem;
	height: 5rem;
	font-size: 1.7rem;
	border: 1px solid rgba(51, 51, 51, 0.3);
	border-radius: 2px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	margin: 0;
`;

export const RadioInput = styled.input`
	display: none;

	&:checked {
		display: none;
	}

	&:checked ~ label {
		background-color: #0e1a41;
		color: #fff;
	}
`;

export const TextArea = styled.textarea`
	width: 100%;
	padding-block: 1.5rem;
	border: none;
	background-color: #eee;
	outline: none;
	font-size: 1.1rem;
	box-sizing: border-box;
	flex: 0.8;
	padding-inline-start: 1rem;
	font-size: 1.5rem;
	border: 1px solid rgba(51, 51, 51, 0.3);
	transition: all 0.2s;

	&:focus {
		outline: 0;
		box-shadow: 0 1rem 2rem rgb(0 0 0 / 10%);
		border-bottom: 0.3rem solid #333;
	}
`;

export const ErrormessageContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	gap: 2rem;

	span {
		padding-bottom: 5px;
		color: red;
		font-size: 1.3rem;
	}

	& > span:first-of-type {
		flex: 0.2;
	}

	& > span:last-of-type {
		flex: 0.8;
		color: red;
		padding-block: 5px;
		padding-inline-start: 1px;
	}
`;

export const Select = styled.select`
	width: 100%;
	padding-block: 1.5rem;
	padding-inline-start: 1rem;
	font-size: 1.5rem;
	border: 1px solid rgba(51, 51, 51, 0.3);
	transition: all 0.2s;

	&:focus {
		outline: 0;
		box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
		border-bottom: 0.3rem solid #333;
	}

	&::-webkit-input-placeholder {
		font: normal lighter 1.8rem 'Kepler Std Regular';
		color: rgba(51, 51, 51, 0.5);
	}
`;

// @media screen and (max-width: 768px) {
// 	.input-content {
// 		flex-direction: column;
// 		align-items: flex-start;
// 	}

// 	.input-content > * {
// 		width: 100%;
// 	}
// }

// .input-validate-message span {
// 	width: 80%;
// 	margin-left: 20%;
// 	padding-bottom: 5px;
// 	color: red;
// }

// .error {
// 	color: rgb(5, 4, 4);
// }
