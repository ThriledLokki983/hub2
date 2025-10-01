import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const LoginContainer = styled.div`
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

const LoginCard = styled(GlassCard)`
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

const ForgotPasswordLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.85rem;
  display: block;
  text-align: right;
  margin-top: ${spacing.xs};
  transition: ${transitions.normal};

  &:hover {
    color: ${colors.white};
  }
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

const SocialButton = styled(Button)`
  width: 100%;
  background: ${colors.surfaceBackground};
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: ${spacing.sm};

  &:hover {
    background: rgba(74, 91, 110, 0.2);
  }

  svg {
    margin-right: ${spacing.sm};
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: ${spacing.lg} 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  span {
    padding: 0 ${spacing.sm};
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
  }
`;

const LoginPage = () => {
  const { login, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      // Auth context will handle the error
    }
  };

  return (
    <LoginContainer>
      <NebulaOverlay />
      <CosmicAccent style={{ top: '15%', left: '10%' }} />
      <CosmicAccent style={{ bottom: '20%', right: '10%' }} />

      <LoginCard>
        <Logo>
          <h1>cosm<span>eat</span></h1>
        </Logo>

        <Heading style={{ textAlign: 'center', fontSize: '2rem' }}>Welcome Back</Heading>
        <Text style={{ textAlign: 'center', opacity: 0.7, marginBottom: spacing.lg }}>
          Log in to continue your cosmic culinary journey
        </Text>

        <SocialButton>
          <span>Sign in with Google</span>
        </SocialButton>

        <OrDivider>
          <span>or sign in with email</span>
        </OrDivider>

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

          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <ForgotPasswordLink to="/reset-password">
              Forgot password?
            </ForgotPasswordLink>
          </FormGroup>

          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <Divider />

        <FlexBox justify="center">
          <Text style={{ marginBottom: 0 }}>
            Don't have an account? <StyledLink to="/signup">Create account</StyledLink>
          </Text>
        </FlexBox>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
