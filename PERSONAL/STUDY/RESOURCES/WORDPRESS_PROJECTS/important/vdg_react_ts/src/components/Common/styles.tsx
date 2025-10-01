import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.main`
	width: min(90%, 150rem);
	margin-inline: auto;
	display: flex;
	place-content: center;
	flex: 1;

	@media (max-width: 768px) {
		width: 98%;
	}
`;

export const Button = styled.button`
	font-family: 'Frutiger LT';
	font-size: 1.5rem;
	color: #fff;
	line-height: 1em;
	background: rgba(14, 26, 65, 0.9);
	border: none !important;
	padding: 2.4rem 3.2rem;
	border-radius: 1.5px;
	text-transform: uppercase;
	transition: all 0.2s ease-in-out;
	width: fit-content;

	&:hover {
		background: rgba(14, 26, 65, 1);
		cursor: pointer;
	}
`;

export const LinkButton = styled(Link)`
	text-decoration: none;
	font-family: 'Frutiger LT';
	font-size: 1.5rem;
	color: #fff;
	line-height: 1em;
	background: rgba(14, 26, 65, 0.9);
	border: none !important;
	padding: 2.4rem 3.2rem;
	border-radius: 1.5px;
	text-transform: uppercase;
	transition: all 0.2s ease-in-out;
	width: fit-content;

	&:hover {
		background: rgba(14, 26, 65, 1);
		cursor: pointer;
	}
`;

export const SearchButton = styled.button`
	position: absolute;
	right: 1rem;
	top: 0.8rem;
	bottom: 1rem;
	padding: 0.5rem 3rem;
	font-family: 'Frutiger LT';
	font-size: 1.5rem;
	color: #0e1a41;
	cursor: pointer;
	background-color: #fff;
	border-radius: 0;
	border: 1px solid rgba(51, 51, 51, 0.3);
	transition: all 0.2s ease-in-out;
	width: fit-content;

	&:hover {
		background-color: #0e1a41;
		color: #fff;
		outline: none;
	}
`;

export const Content = styled.section`
	width: 100%;
	flex: 1;
	margin-inline: auto;
	margin-bottom: 5rem;
	padding: 5rem 4rem 5rem 4rem;
	border: 1px solid rgba(51, 51, 51, 0.1);
	border-radius: 2px;
	box-shadow: 0 1rem 2rem rgb(0 0 0 / 10%);
	height: fit-content;

	@media (max-width: 768px) {
		padding: 1rem;
	}
`;

export const FormContainer = styled.form`
	width: 100%;
	// max-height: 70vh;
	// overflow: auto;
`;

export const ProductSearchForm = styled(FormContainer)`
	margin-bottom: 6rem;
`;

export const FieldGroup = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	gap: 2rem;
	flex: 1;

	input {
		width: -webkit-fill-available;
	}

	label {
		font-size: 1.8rem;
		font-family: 'Kepler Std Regular', sans-serif;
		color: #0e1a41;
		flex: 0.3;
	}

	input,
	select {
		padding: 1rem 1.5rem;
		font-size: 1.5rem;
		border: none;
		border: 1px solid rgba(51, 51, 51, 0.3);
		border-radius: 2px;
		transition: all 0.2s;
	}

	input:focus,
	select:focus {
		outline: none;
		border: 1px solid #0e1a41;
	}

	button {
		width: fit-content;
		font-family: 'Frutiger LT';
		font-size: 1.5rem;
		color: #fff;
		line-height: 1em;
		background: #0e1a41;
		border: none !important;
		padding: 1.2rem 2rem;
		border-radius: 1.5px;
		text-transform: uppercase;
		cursor: pointer;
		text-transform: capitalize !important;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		span {
			visibility: hidden;
			display: none;
			width: fit-content;
			background-color: rgba(0, 0, 0, 0.7);
			color: #fff;
			text-align: center;
			border-radius: 3px;
			padding: 0.5rem 1rem;
			position: absolute;
			font-size: 1.2rem;
			z-index: 1;
			right: -7rem;
			top: 0;
			transition: all 0.3s ease-out;
		}

		svg {
			width: fit-content;
			stroke-width: 3rem;
			height: 1.7rem;
			overflow: initial;
			fill: #fff;
			stroke: #fff;
		}

		&:hover {
			span {
				visibility: visible;
				display: block;
				right: 0rem;
				top: -3rem;
			}
		}
	}

	> div {
		display: flex;
		justify-content: space-between;
		flex: 1;
		gap: 10rem;
	}

	> div div > label {
		margin-right: 1.5rem;
	}
`;

export const SelectGroupDiv = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 3rem;
	padding-bottom: 2rem;
`;

export const FieldGroupSelect = styled(FieldGroup)`
	width: auto;
	margin-bottom: 15rem;

	select {
		padding: 1rem 1.5rem;
	}

	${SelectGroupDiv} {
		> div {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			gap: 5rem;

			> div {
				flex: 1;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
				gap: 2rem;

				select {
					flex: 1;
				}
			}
		}
	}
`;

export const ProductSearchContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	gap: 5rem;

	border-bottom: 2px solid rgba(51, 51, 51, 0.1);
	margin-bottom: 2rem;
`;

export const FormField = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 15% 85%;
	align-items: end;

	&:not(:last-child) {
		margin-bottom: 2rem;
	}
`;

export const FormFieldLabel = styled.div`
	width: 100%;
	grid-column: 1/2;
`;

export const Label = styled.label`
	font-size: 1.8rem;
`;

export const FormFieldInput = styled.div`
	width: 100%;
	grid-column: 2/3;
	color: inherit;
	font-family: inherit;
`;

export const Input = styled.input`
	width: 100%;
	padding-block: 1.5rem;
	padding-inline-start: 1rem;
	font-size: 1.5rem;
	border: 1px solid rgba(51, 51, 51, 0.3);
	// border-radius: 2px;
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

export const ResultsContainer = styled.div`
	width: inherit;
	margin-bottom: 5rem;
	padding-top: 0.5rem;
`;

export const Lists = styled.ul`
	width: auto;
	margin: 0;
	padding-inline-start: 0;
`;

export const ListItem = styled.li`
	text-decoration: none;
	list-style-type: none;
	width: inherit;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.1rem 0;
	cursor: default;

	&:hover {
		background: #f4f6f6;
		transition: all 0.2s ease-in-out;
	}

	span {
		font-size: 1.5rem !important;
		color: #0e1a41;
		flex: 1;
	}

	button {
		font-family: 'Frutiger LT';
		font-size: 1.5rem;
		color: #fff;
		line-height: 1em;
		background: #0e1a41;
		border: none !important;
		padding: 1rem 2rem;
		border-radius: 1.5px;
		text-transform: uppercase;
		cursor: pointer;
		transition: display 0.2s ease-out;
		margin-left: 1.5rem;
		width: fit-content;
	}
`;

export const BasketContainer = styled.div`
	width: 100%;
`;

export const BasketHeader = styled.h2`
	font-size: 3rem;
	font-family: 'Kepler Std Regular';
	color: #333;
	margin-block-start: 0;
	margin-block-end: 1rem;
	// border-bottom: 2px solid rgba(51, 51, 51, 0.1);
`;

export const OrderDetails = styled.div``;

export const OrderDetailsColumn = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 3fr;
	justify-items: flex-start;
	padding: 1.5rem 0;
	border-block: 1px solid #333;

	span {
		font-size: 1.8rem;
		font-family: 'Frutiger LT', sans-serif;
		color: #0e1a41;
		font-weight: 700;
	}
`;

export const OrderLines = styled.div`
	display: flex;
	flex-direction: column;
	border-block-end: 1px solid #333;
`;

export const Div = styled.div``;

export const Band = styled.div``;

export const Extra = styled.div``;

export const Closing = styled.div``;

export const ProductContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 3fr;
	font-size: 1.6rem;
	align-items: center;
	padding: 1rem 0;
`;

export const ProductName = styled.div`
	padding-top: 1rem;
`;

export const ProductPrice = styled.div`
	input {
		text-align: right;
		width: 60%;
		font-size: 1.5rem;
		padding: 1.5rem 1rem;
		border: 1px solid rgba(51, 51, 51, 0.3);
		border-bottom-width: 0.3rem;
	}
`;

export const Description = styled.div``;

export const Buttons = styled.div``;

export const ProductDescription = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;

	${Description} {
		flex: 1;
	}

	${Buttons} {
		position: relative;
		display: flex;
		gap: 1rem;
		align-items: flex-end;
		flexx-wrap: wrap;
		margin-inline-start: 2rem;

		button {
			cursor: pointer;
			width: fit-content;
			display: flex;
			justify-content: center;
			align-items: center;

			svg {
				width: 2rem;
				height: 1.5rem;
				fill: #fff;
				stroke: #fff;
				stroke-width: 0rem;
			}

			span {
				visibility: hidden;
				display: none;
				width: fit-content;
				background-color: rgba(0, 0, 0, 0.7);
				color: #fff;
				text-align: center;
				border-radius: 3px;
				padding: 0.5rem 1rem;
				position: absolute;
				font-size: 1.2rem;
				z-index: 1;
				right: -7rem;
				top: 0;
				transition: all 0.3s ease-out;
			}

			&:hover {
				span {
					visibility: visible;
					display: inline-block;
				}
			}
		}
	}
`;

export const ProductTotal = styled(Div)`
	display: grid;
	grid-template-columns: 1fr 1fr 3fr;
	font-size: 1.6rem;
	align-items: center;
	padding-block: 1.5rem;

	span {
		font-size: 1.8rem;
		font-family: 'Kepler Std Regular' !important;
		color: #0e1a41;
	}
`;
