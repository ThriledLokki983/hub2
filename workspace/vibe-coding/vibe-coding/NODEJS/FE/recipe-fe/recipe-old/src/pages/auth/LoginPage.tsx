import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import {
  colors,
  typography,
  borderRadius,
  shadows,
  spacing,
  breakpoints,
} from '../../theme/theme';
import { kenteAccentHorizontal } from '../../components/KentePatterns';
import { useAuth } from '../../contexts/AuthContext';

const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 160px);
  padding: ${spacing.lg} ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.xl} ${spacing.lg};
    min-height: calc(100vh - 200px);
  }
`;

const LoginCard = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  padding: ${spacing.lg};
  max-width: 450px;
  width: 100%;
  margin: auto;

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.xl};
    border-radius: ${borderRadius.xl};
  }
`;

const LoginHeader = styled.div`
  margin-bottom: ${spacing.lg};
  text-align: center;
`;

const LoginTitle = styled.h1`
  ${kenteAccentHorizontal}
  font-size: 2rem;
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
  padding-bottom: ${spacing.xs};
  display: inline-block;
`;

const LoginDescription = styled.p`
  color: ${colors.galaxyGrey};
  font-weight: ${typography.fontWeights.light};
  font-size: 1rem;
  margin-top: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: ${colors.deepSpace};
  font-size: 0.9rem;
  margin-bottom: ${spacing.xs};
  font-weight: ${typography.fontWeights.medium};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${spacing.md} ${spacing.md} ${spacing.md} ${spacing.xl};
  border: 1px solid ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  font-size: 1rem;
  color: ${colors.deepSpace};
  background-color: ${colors.white};
  transition: all 0.2s ease;
  font-family: ${typography.fontFamily};

  &:focus {
    outline: none;
    border-color: ${colors.emeraldGreen};
    box-shadow: 0 0 0 2px ${colors.emeraldGreen}20;
  }

  &::placeholder {
    color: ${colors.galaxyGrey}80;
    font-size: 0.9rem;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: ${spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.galaxyGrey};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.darkPastelRed};
  font-size: 0.85rem;
  margin-top: ${spacing.xs};
`;

const LoginButton = styled.button`
  background-color: ${colors.emeraldGreen};
  color: ${colors.white};
  border: none;
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.medium};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: ${spacing.sm};

  &:hover {
    background-color: ${colors.emeraldGreen}dd;
  }

  &:disabled {
    background-color: ${colors.galaxyGrey}50;
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled(Link)`
  color: ${colors.emeraldGreen};
  font-size: 0.9rem;
  text-decoration: none;
  text-align: right;
  margin-top: ${spacing.xs};

  &:hover {
    text-decoration: underline;
  }
`;

const SignupPrompt = styled.div`
  margin-top: ${spacing.lg};
  text-align: center;
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
`;

const SignupLink = styled(Link)`
  color: ${colors.emeraldGreen};
  font-weight: ${typography.fontWeights.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error: authError, loading: authLoading, isAuthenticated, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    // Clear any auth errors when component mounts
    clearError();
  }, [isAuthenticated, navigate, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      // Use the login function from auth context
      await login(email, password);
      // Navigation will happen automatically via the useEffect when isAuthenticated becomes true
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <LoginPageContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>Login</LoginTitle>
          <LoginDescription>Welcome back! Please enter your details.</LoginDescription>
        </LoginHeader>

        <Form onSubmit={handleSubmit}>
          {(error || authError) && (
            <ErrorMessage>
              <FiAlertCircle />
              <span>{error || authError}</span>
            </ErrorMessage>
          )}

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <InputWrapper>
              <InputIcon>
                <FiMail size={18} />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <InputIcon>
                <FiLock size={18} />
              </InputIcon>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputWrapper>
            <ForgotPassword to="/auth/reset-password">Forgot password?</ForgotPassword>
          </FormGroup>

          <LoginButton type="submit" disabled={authLoading}>
            {authLoading ? 'Logging in...' : 'Log in'}
          </LoginButton>
        </Form>

        <SignupPrompt>
          Don't have an account? <SignupLink to="/auth/signup">Sign up</SignupLink>
        </SignupPrompt>
      </LoginCard>
    </LoginPageContainer>
  );
};

export default LoginPage;