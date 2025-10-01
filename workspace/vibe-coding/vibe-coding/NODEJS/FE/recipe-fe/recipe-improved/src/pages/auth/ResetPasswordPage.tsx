import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  GlassCard,
  Heading,
  Text,
  FormGroup,
  Label,
  Input,
  Button,
  Divider,
  FlexBox,
  CosmicAccent,
  NebulaOverlay
} from '../../components/ui/CommonElements';
import { colors, spacing, transitions } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';

const ResetContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
  position: relative;
  background-color: ${colors.darkBackground};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(125deg,
      rgba(10, 10, 10, 0.99) 0%,
      rgba(20, 20, 20, 0.9) 100%
    );
    z-index: 0;
  }
`;

const ResetCard = styled(GlassCard)`
  width: 100%;
  max-width: 430px;
  z-index: 1;
  position: relative;
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${spacing.xl};

  h1 {
    color: ${colors.white};
    font-weight: 200;
    letter-spacing: -0.05em;

    span {
      color: ${colors.primaryOrange};
    }
  }
`;

const StyledLink = styled(Link)`
  color: ${colors.primaryOrange};
  text-decoration: none;
  font-weight: 400;
  transition: ${transitions.normal};

  &:hover {
    text-decoration: underline;
  }
`;

const SuccessMessage = styled.div`
  color: ${colors.success};
  background-color: rgba(76, 175, 80, 0.1);
  padding: ${spacing.md};
  border-radius: 4px;
  margin-bottom: ${spacing.lg};
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: ${colors.error};
  font-size: 0.85rem;
  margin-top: ${spacing.xs};
  margin-bottom: ${spacing.sm};
  display: flex;
  align-items: center;

  svg {
    margin-right: ${spacing.xs};
  }
`;

const ResetPasswordPage = () => {
  const { resetPassword, error, loading, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      // Auth context will handle the error
    }
  };

  return (
    <ResetContainer>
      <NebulaOverlay />
      <CosmicAccent style={{ top: '15%', right: '20%' }} />

      <ResetCard>
        <Logo>
          <h1>cosm<span>eat</span></h1>
        </Logo>

        <Heading style={{ textAlign: 'center', fontSize: '2rem' }}>Reset Password</Heading>

        {isSubmitted ? (
          <>
            <SuccessMessage>
              Password reset instructions have been sent to your email.
            </SuccessMessage>

            <Text style={{ textAlign: 'center' }}>
              Please check your inbox and follow the instructions to reset your password.
            </Text>

            <Divider />

            <FlexBox justify="center">
              <Text style={{ marginBottom: 0 }}>
                Remember your password? <StyledLink to="/login">Sign in</StyledLink>
              </Text>
            </FlexBox>
          </>
        ) : (
          <>
            <Text style={{ textAlign: 'center', opacity: 0.7, marginBottom: spacing.lg }}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>

            {error && (
              <ErrorMessage>
                <span>{error}</span>
              </ErrorMessage>
            )}

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </FormGroup>

              <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </form>

            <Divider />

            <FlexBox justify="center">
              <Text style={{ marginBottom: 0 }}>
                Remember your password? <StyledLink to="/login">Sign in</StyledLink>
              </Text>
            </FlexBox>
          </>
        )}
      </ResetCard>
    </ResetContainer>
  );
};

export default ResetPasswordPage;
