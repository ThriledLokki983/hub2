import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius } from '../theme/theme';
import Button from './Button';

interface ErrorStateProps {
  message?: string;
  retry?: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  background-color: ${colors.white};
  border-radius: ${borderRadius.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: ${spacing.xl} 0;
`;

const ErrorIcon = styled.div`
  color: ${colors.darkPastelRed};
  font-size: 2.5rem;
  margin-bottom: ${spacing.md};

  &::before {
    content: '⚠️';
  }
`;

const Message = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 1rem;
  margin-bottom: ${spacing.lg};
`;

const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong. Please try again later.',
  retry,
}) => {
  return (
    <Container>
      <ErrorIcon />
      <Message>{message}</Message>
      {retry && (
        <Button
          onClick={retry}
          primary>
          Try Again
        </Button>
      )}
    </Container>
  );
};

export default ErrorState;
