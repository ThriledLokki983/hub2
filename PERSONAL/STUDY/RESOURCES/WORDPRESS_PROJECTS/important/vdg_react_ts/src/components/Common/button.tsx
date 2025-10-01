import React from 'react';

interface ButtonProps {
	children: any;
}

const Button = ({ children }: ButtonProps) => {
	return <div>{children}</div>;
};

export default Button;
