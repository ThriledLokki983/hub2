import React from 'react';
import { Container } from './styles';

interface MainProps {
	children: any;
}

const Main = ({ children }: MainProps) => {
	return <Container>{children}</Container>;
};

export default Main;
