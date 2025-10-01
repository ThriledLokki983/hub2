import styled from 'styled-components';

export const Results = styled.div`
	display: flex;
	flex-direction: column;
	padding: 2rem 0 0 0;

	a {
		text-decoration: none;
		font-size: 1.5rem;
		color: #333;
	}
`;

export const ButtonBox = styled.div`
	width: 100%;
	margin-block-start: 10rem;
	display: flex;
	justify-content: flex-end;
	transform: translateX(1.3rem);
`;

export const MultiButton = styled(ButtonBox)`
	justify-content: space-between;
`;
