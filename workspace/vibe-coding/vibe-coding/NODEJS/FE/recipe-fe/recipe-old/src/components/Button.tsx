import React from 'react';
import styled from 'styled-components';
import { colors, typography, borderRadius, shadows } from '../theme/theme';

interface ButtonProps {
  primary?: boolean;
  outlined?: boolean;
  small?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string; // URL for anchor functionality
  target?: string; // Target for anchor links (_blank, _self, etc.)
}

type StyledButtonProps = {
  $primary?: boolean;
  $outlined?: boolean;
  $small?: boolean;
  as?: React.ElementType;
};

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => (props.$small ? '0.5rem 1rem' : '0.75rem 1.5rem')};
  font-size: ${(props) => (props.$small ? '0.875rem' : '1rem')};
  font-weight: ${typography.fontWeights.light};
  letter-spacing: ${typography.letterSpacing};
  border-radius: ${borderRadius.md};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  text-decoration: none; // For anchor links
  cursor: pointer;

  ${(props) =>
    props.$primary &&
    !props.$outlined &&
    `
    background-color: ${colors.emeraldGreen};
    color: ${colors.white};
    border: none;
    box-shadow: ${shadows.soft};

    &:hover {
      background-color: ${colors.emeraldGreen}ee;
      transform: translateY(-2px);
      box-shadow: ${shadows.medium};
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${(props) =>
    props.$outlined &&
    `
    background-color: transparent;
    border: 1px solid ${
      props.$primary ? colors.emeraldGreen : colors.galaxyGrey
    };
    color: ${props.$primary ? colors.emeraldGreen : colors.galaxyGrey};

    &:hover {
      background-color: ${
        props.$primary ? colors.emeraldGreen + '0D' : colors.galaxyGrey + '0D'
      };
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${(props) =>
    !props.$primary &&
    !props.$outlined &&
    `
    background-color: ${colors.antiqueWhite};
    color: ${colors.deepSpace};
    border: none;

    &:hover {
      background-color: ${colors.antiqueWhite}ee;
      transform: translateY(-2px);
      box-shadow: ${shadows.soft};
    }

    &:active {
      transform: translateY(0);
    }
  `}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.cosmicLatte},
      0 0 0 4px ${colors.emeraldGreen}66;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  primary = false,
  outlined = false,
  small = false,
  href,
  target,
  ...otherProps
}) => {
  // If href is provided, render as an anchor tag
  if (href) {
    return (
      <StyledButton
        as='a'
        href={href}
        target={target}
        $primary={primary}
        $outlined={outlined}
        $small={small}
        {...otherProps}>
        {children}
      </StyledButton>
    );
  }

  // Otherwise render as a regular button
  return (
    <StyledButton
      $primary={primary}
      $outlined={outlined}
      $small={small}
      {...otherProps}>
      {children}
    </StyledButton>
  );
};

export default Button;
