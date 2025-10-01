import React from 'react';
import Style from './footer.style';
import logo from '../../assets/logo-foot.svg';

const Footer = () => {
	return (
		<Style.FooterContainer>
			<Style.FooterContent>
				<Style.FooterLogo src={logo} alt='Van der Gang Watches' />
			</Style.FooterContent>
		</Style.FooterContainer>
	);
};

export default Footer;
