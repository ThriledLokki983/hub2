import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Details = styled(Link)`
	text-decoration: none;
	width: 78.3%;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	gap: 2rem;
	margin-inline-start: auto;
	padding-block-start: 0.5rem;
	color: black;

	&:hover {
		background-color: #eee;
		cursor: pointer;
	}
`;

export const Span = styled.span`
	flex: 1;
	padding-inline-start: 2rem;
	font-size: 1.6rem;
	padding-block: 0.5rem;
	flex-wrap: wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
