import React from 'react';
import Style from './header.style';
import logo from '../../assets/site-logo.svg';

const Header = () => {
	return (
		<Style.HeaderContainer>
			<Style.LogoBox>
				<Style.Logo src={logo} alt='Van der Gang Watches' />
			</Style.LogoBox>
			<Style.Info>
				<Style.InfoProgress>
					<Style.Progress>
						<Style.ProgressBar />
					</Style.Progress>
				</Style.InfoProgress>
			</Style.Info>
		</Style.HeaderContainer>
	);
};

export default Header;
