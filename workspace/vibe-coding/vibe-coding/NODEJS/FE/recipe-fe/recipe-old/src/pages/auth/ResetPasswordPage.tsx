import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import {
  colors,
  typography,
  borderRadius,
  shadows,
  spacing,
  breakpoints,
} from '../../theme/theme';
import { kenteAccentHorizontal } from '../../components/KentePatterns';

const ResetPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 160px);
  padding: ${spacing.lg} ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.xl} ${spacing.lg};
    min-height: calc(100vh - 200px);
  }
`;

const ResetCard = styled.div`
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

const ResetHeader = styled.div`
  margin-bottom: ${spacing.lg};
  text-align: center;
`;

const ResetTitle = styled.h1`
  ${kenteAccentHorizontal}
  font-size: 2rem;
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
  padding-bottom: ${spacing.xs};
  display: inline-block;
`;

const ResetDescription = styled.p`
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

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.emeraldGreen};
  font-size: 0.9rem;
  margin-top: ${spacing.xs};
  padding: ${spacing.sm};
  background-color: ${colors.emeraldGreen}10;
  border-radius: ${borderRadius.md};
  text-align: center;
  justify-content: center;
`;

const ResetButton = styled.button`
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

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.emeraldGreen};
  font-size: 0.9rem;
  text-decoration: none;
  margin-top: ${spacing.lg};

  &:hover {
    text-decoration: underline;
  }
`;

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're on the reset link page (has a token in the URL) or the request page
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Here you would typically make an API call to send a reset password link
      // For now, we'll just simulate a successful request after a short delay
      setTimeout(() => {
        // Mock successful password reset request
        console.log('Password reset requested for:', email);
        setSuccess('Password reset link has been sent to your email address. Please check your inbox.');
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Error sending password reset link. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <ResetPageContainer>
      <ResetCard>
        <ResetHeader>
          <ResetTitle>Reset Password</ResetTitle>
          <ResetDescription>
            Enter your email address to receive a password reset link.
          </ResetDescription>
        </ResetHeader>

        {success ? (
          <>
            <SuccessMessage>{success}</SuccessMessage>
            <BackLink to="/auth/login">
              <FiArrowLeft size={16} />
              <span>Back to Login</span>
            </BackLink>
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            {error && (
              <ErrorMessage>
                <FiAlertCircle />
                <span>{error}</span>
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
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <ResetButton type="submit" disabled={isLoading}>
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            </ResetButton>

            <BackLink to="/auth/login">
              <FiArrowLeft size={16} />
              <span>Back to Login</span>
            </BackLink>
          </Form>
        )}
      </ResetCard>
    </ResetPageContainer>
  );
};

export default ResetPasswordPage;