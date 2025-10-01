import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';
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

const SignupPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 160px);
  padding: ${spacing.lg} ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.xl} ${spacing.lg};
    min-height: calc(100vh - 200px);
  }
`;

const SignupCard = styled.div`
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

const SignupHeader = styled.div`
  margin-bottom: ${spacing.lg};
  text-align: center;
`;

const SignupTitle = styled.h1`
  ${kenteAccentHorizontal}
  font-size: 2rem;
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
  padding-bottom: ${spacing.xs};
  display: inline-block;
`;

const SignupDescription = styled.p`
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

const SignupButton = styled.button`
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

const LoginPrompt = styled.div`
  margin-top: ${spacing.lg};
  text-align: center;
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
`;

const LoginLink = styled(Link)`
  color: ${colors.emeraldGreen};
  font-weight: ${typography.fontWeights.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PrivacyText = styled.p`
  font-size: 0.8rem;
  color: ${colors.galaxyGrey};
  text-align: center;
  margin-top: ${spacing.md};
`;

const PrivacyLink = styled(Link)`
  color: ${colors.emeraldGreen};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, error: authError, loading: authLoading, isAuthenticated, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Form validation states
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    // Clear any auth errors when component mounts
    clearError();
  }, [isAuthenticated, navigate, clearError]);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form field on blur
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          setNameError('Name is required');
        } else if (value.trim().length < 2) {
          setNameError('Name must be at least 2 characters');
        } else {
          setNameError(null);
        }
        break;
      case 'email':
        if (!value.trim()) {
          setEmailError('Email is required');
        } else if (!validateEmail(value)) {
          setEmailError('Please enter a valid email address');
        } else {
          setEmailError(null);
        }
        break;
      case 'password':
        if (!value) {
          setPasswordError('Password is required');
        } else if (value.length < 8) {
          setPasswordError('Password must be at least 8 characters long');
        } else if (!/[A-Z]/.test(value)) {
          setPasswordError('Password must contain at least one uppercase letter');
        } else if (!/[0-9]/.test(value)) {
          setPasswordError('Password must contain at least one number');
        } else {
          setPasswordError(null);
        }
        break;
      case 'confirmPassword':
        if (!value) {
          setConfirmPasswordError('Please confirm your password');
        } else if (value !== password) {
          setConfirmPasswordError('Passwords do not match');
        } else {
          setConfirmPasswordError(null);
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    validateField('name', name);
    validateField('email', email);
    validateField('password', password);
    validateField('confirmPassword', confirmPassword);

    // Check if there are any validation errors
    if (!name || !email || !password || !confirmPassword ||
        nameError || emailError || passwordError || confirmPasswordError) {
      setError('Please fix the errors in the form');
      return;
    }

    // Use the signup function from auth context
    try {
      await signup(name, email, password);
      // Navigation will happen automatically via the useEffect when isAuthenticated becomes true
    } finally {
      // Error is handled by the auth context
			console.log(`SignUp is completed.........`);

    }
  };

  return (
    <SignupPageContainer>
      <SignupCard>
        <SignupHeader>
          <SignupTitle>Sign Up</SignupTitle>
          <SignupDescription>Create your account to start cooking!</SignupDescription>
        </SignupHeader>

        <Form onSubmit={handleSubmit}>
          {(error || authError) && (
            <ErrorMessage>
              <FiAlertCircle />
              <span>{error || authError}</span>
            </ErrorMessage>
          )}

          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <InputWrapper>
              <InputIcon>
                <FiUser size={18} />
              </InputIcon>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => validateField('name', name)}
                required
              />
            </InputWrapper>
            {nameError && <ErrorMessage><FiAlertCircle /><span>{nameError}</span></ErrorMessage>}
          </FormGroup>

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
                onBlur={() => validateField('email', email)}
                required
              />
            </InputWrapper>
            {emailError && <ErrorMessage><FiAlertCircle /><span>{emailError}</span></ErrorMessage>}
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validateField('password', password)}
                required
              />
            </InputWrapper>
            {passwordError && <ErrorMessage><FiAlertCircle /><span>{passwordError}</span></ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputWrapper>
              <InputIcon>
                <FiLock size={18} />
              </InputIcon>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => validateField('confirmPassword', confirmPassword)}
                required
              />
            </InputWrapper>
            {confirmPasswordError && <ErrorMessage><FiAlertCircle /><span>{confirmPasswordError}</span></ErrorMessage>}
          </FormGroup>

          <SignupButton type="submit" disabled={authLoading}>
            {authLoading ? 'Creating Account...' : 'Create Account'}
          </SignupButton>

          <PrivacyText>
            By signing up, you agree to our <PrivacyLink to="/legal/terms-of-service">Terms of Service</PrivacyLink> and <PrivacyLink to="/legal/privacy-policy">Privacy Policy</PrivacyLink>
          </PrivacyText>
        </Form>

        <LoginPrompt>
          Already have an account? <LoginLink to="/auth/login">Log in</LoginLink>
        </LoginPrompt>
      </SignupCard>
    </SignupPageContainer>
  );
};

export default SignupPage;