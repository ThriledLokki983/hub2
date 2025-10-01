import styled from 'styled-components';

const HeaderContainer = styled.header`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const LogoBox = styled.div`
	height: 100%;
	width: 100%;
	text-align: center;
`;

const Logo = styled.img`
	height: 10rem;
	width: 20rem;
`;

const Info = styled.div`
	width: 7rem;
	width: 100%;
	padding: 0 0 8rem 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const InfoProgress = styled.div`
	height: 2rem;
	width: min(55%, 150rem);
	margin-left: auto;
	margin-right: auto;
`;

const Progress = styled.div`
	height: 2rem;
	border: 1px solid rgba(14, 26, 65, 0.5);
	border-radius: 2px;
`;

const ProgressBar = styled.div`
	height: 2rem;
	background-color: #0e1a41;
	transition: width 0.5s ease-in-out;
`;

export default {
	HeaderContainer,
	LogoBox,
	Logo,
	Info,
	InfoProgress,
	Progress,
	ProgressBar,
};
