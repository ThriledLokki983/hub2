import styled from '@emotion/styled';
import {
  colors,
  shadows,
  borderRadius,
  spacing,
  transitions,
  typography,
} from '../../styles/theme/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};
  border: none;
  border-radius: ${borderRadius.md};
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: ${transitions.default};
  width: ${props => (props.fullWidth ? '100%' : 'auto')};

  /* Size Variations */
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          padding: ${spacing[2]} ${spacing[3]};
          font-size: ${typography.fontSizes.sm};
        `;
      case 'lg':
        return `
          padding: ${spacing[4]} ${spacing[6]};
          font-size: ${typography.fontSizes.lg};
        `;
      default: // md
        return `
          padding: ${spacing[3]} ${spacing[4]};
          font-size: ${typography.fontSizes.base};
        `;
    }
  }}

  /* Variant Styles */
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: ${colors.softAmber};
          color: ${colors.charcoalInk};
          &:hover {
            transform: translateY(-2px);
            box-shadow: ${shadows.md};
            background-color: ${colors.softAmber}ee;
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          border: 1px solid ${colors.deepOliveGreen};
          color: ${colors.deepOliveGreen};
          &:hover {
            background-color: ${colors.deepOliveGreen}10;
            transform: translateY(-2px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: ${colors.deepOliveGreen};
          padding-left: ${spacing[2]};
          padding-right: ${spacing[2]};
          &:hover {
            background-color: ${colors.deepOliveGreen}10;
          }
        `;
      default: // primary
        return `
          background-color: ${colors.deepOliveGreen};
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: ${shadows.cosmic};
            background-color: ${colors.deepOliveGreen}ee;
          }
          &:active {
            transform: translateY(0);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Icon alignment */
  svg {
    width: 1.25em;
    height: 1.25em;
  }
`;

export const IconButton = styled(Button)`
  padding: ${spacing[2]};
  border-radius: ${borderRadius.full};

  svg {
    width: 1.5em;
    height: 1.5em;
  }
`;

export const ButtonGroup = styled.div<{ spacing?: keyof typeof spacing }>`
  display: flex;
  gap: ${props => (props.spacing ? spacing[props.spacing] : spacing[2])};
  align-items: center;

  &.vertical {
    flex-direction: column;
    align-items: stretch;
  }
`;
