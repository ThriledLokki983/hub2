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

const SignupContainer = styled.div`
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

const SignupCard = styled(GlassCard)`
  width: 100%;
  max-width: 480px;
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

const ErrorMessage = styled.div`
  color: ${colors.error};
  font-size: 0.85rem;
  margin-top: ${spacing.xs};
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

const SignupPage = () => {
  const { signup, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (validateForm()) {
      try {
        await signup(name, email, password);
        navigate('/'); // Redirect to home page after successful signup
      } catch (err) {
        // Auth context will handle the error
      }
    }
  };

  return (
    <SignupContainer>
      <NebulaOverlay />
      <CosmicAccent style={{ top: '10%', right: '5%' }} />
      <CosmicAccent style={{ bottom: '10%', left: '5%' }} />

      <SignupCard>
        <Logo>
          <h1>cosm<span>eat</span></h1>
        </Logo>

        <Heading style={{ textAlign: 'center', fontSize: '2rem' }}>Create Account</Heading>
        <Text style={{ textAlign: 'center', opacity: 0.7 }}>
          Join our cosmic community of food explorers
        </Text>

        <SocialButton>
          <span>Continue with Google</span>
        </SocialButton>

        <OrDivider>
          <span>or continue with email</span>
        </OrDivider>

        {error && (
          <ErrorMessage>
            <span>{error}</span>
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
            {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
            {formErrors.confirmPassword && <ErrorMessage>{formErrors.confirmPassword}</ErrorMessage>}
          </FormGroup>

          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <Divider />

        <FlexBox justify="center">
          <Text style={{ marginBottom: 0 }}>
            Already have an account? <StyledLink to="/login">Log in</StyledLink>
          </Text>
        </FlexBox>
      </SignupCard>
    </SignupContainer>
  );
};

export default SignupPage;
