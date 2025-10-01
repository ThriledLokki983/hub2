import styled from 'styled-components';
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../../theme/theme';

// Container components
export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing.lg};
  min-height: 100vh;
`;

export const Card = styled.div`
  background: ${colors.midBackground};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.medium};
  color: ${colors.white};
`;

export const GlassCard = styled(Card)`
  background: rgba(46, 46, 46, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

// Typography components
export const Heading = styled.h1`
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.light};
  font-size: ${typography.sizes.headingLarge};
  letter-spacing: ${typography.letterSpacing};
  color: ${colors.white};
  margin-bottom: ${spacing.lg};
  line-height: 1.2;
`;

export const SubHeading = styled.h2`
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.light};
  font-size: ${typography.sizes.headingSmall};
  letter-spacing: ${typography.letterSpacing};
  color: ${colors.white};
  margin-bottom: ${spacing.md};
  line-height: 1.3;
`;

export const Text = styled.p`
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.light};
  font-size: ${typography.sizes.body};
  color: ${colors.white};
  line-height: 1.6;
  margin-bottom: ${spacing.md};
`;

// Form components
export const FormGroup = styled.div`
  margin-bottom: ${spacing.lg};
`;

export const Label = styled.label`
  display: block;
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.regular};
  font-size: ${typography.sizes.bodySmall};
  color: ${colors.white};
  margin-bottom: ${spacing.xs};
  letter-spacing: ${typography.letterSpacing};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${spacing.md};
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.light};
  font-size: ${typography.sizes.body};
  background-color: ${colors.surfaceBackground};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  color: ${colors.white};
  transition: ${transitions.normal};

  &:focus {
    outline: none;
    border-color: ${colors.primaryOrange};
    box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.2);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${spacing.md};
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.light};
  font-size: ${typography.sizes.body};
  background-color: ${colors.surfaceBackground};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  color: ${colors.white};
  transition: ${transitions.normal};
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${colors.primaryOrange};
    box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.2);
  }
`;

// Button components
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.light};
  letter-spacing: ${typography.letterSpacing};
  border-radius: ${borderRadius.md};
  transition: ${transitions.normal};
  cursor: pointer;
  border: none;

  /* Size variations */
  font-size: ${props =>
    props.size === 'small' ? '0.875rem' :
    props.size === 'large' ? '1.2rem' :
    '1rem'
  };

  padding: ${props =>
    props.size === 'small' ? '0.5rem 1rem' :
    props.size === 'large' ? '1rem 2rem' :
    '0.75rem 1.5rem'
  };

  /* Style variations */
  background: ${props =>
    props.variant === 'secondary' ? colors.accentBlue :
    props.variant === 'outline' ? 'transparent' :
    colors.accentGradient
  };

  color: ${props => props.variant === 'outline' ? colors.primaryOrange : colors.white};

  border: ${props => props.variant === 'outline' ? `1px solid ${colors.primaryOrange}` : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props =>
      props.variant === 'outline' ? 'none' :
      shadows.cosmic
    };
    background: ${props =>
      props.variant === 'secondary' ? colors.accentBlue :
      props.variant === 'outline' ? 'rgba(255, 122, 0, 0.1)' :
      'linear-gradient(135deg, #FF8C42 0%, #FF7A00 100%)'
    };
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* Add some space when there are icons */
  svg {
    margin-right: ${props => props.children ? spacing.xs : '0'};
  }
`;

// Layout components
export const FlexBox = styled.div<{
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  gap?: keyof typeof spacing;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'flex-start'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
  gap: ${props => spacing[props.gap || 'md']};
`;

// Dividers and spacers
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: ${spacing.lg} 0;
`;

export const Spacer = styled.div<{ size: keyof typeof spacing }>`
  height: ${props => spacing[props.size]};
  width: 100%;
`;

// Status indicators
export const Badge = styled.span<{ variant?: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-block;
  padding: ${spacing.xxs} ${spacing.sm};
  border-radius: ${borderRadius.round};
  font-size: ${typography.sizes.caption};
  font-weight: ${typography.fontWeights.medium};
  background-color: ${props =>
    props.variant === 'success' ? colors.success :
    props.variant === 'warning' ? colors.warning :
    props.variant === 'error' ? colors.error :
    props.variant === 'info' ? colors.info :
    colors.primaryOrange
  };
  color: ${colors.white};
`;

// Animation helper
export const fadeIn = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Nebula effect component for backgrounds
export const NebulaOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/nebula-texture.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.05;
  pointer-events: none;
`;

// Cosmic star accent for UI elements
export const CosmicAccent = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255,122,0,0.15) 0%, rgba(255,122,0,0) 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
`;

