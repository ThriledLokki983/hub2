import Style from './header.style';
import logo from '../../assets/site-logo.svg';
import Progress from './Progress';

interface HeaderProps {
	progressValue: number;
}

const Header = ({ progressValue }: HeaderProps) => {
	return (
		<Style.HeaderContainer>
			<Style.LogoBox>
				<Style.Logo src={logo} alt='Van der Gang Watches' />
			</Style.LogoBox>
			<Progress progress={progressValue} />
		</Style.HeaderContainer>
	);
};

export default Header;
