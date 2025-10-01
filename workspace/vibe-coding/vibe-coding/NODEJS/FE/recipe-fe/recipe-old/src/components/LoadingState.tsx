import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { colors, spacing } from '../theme/theme';

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

// Kente pattern colors array
const kenteColors = [
  colors.maximumYellow,
  colors.darkPastelRed,
  colors.deepSpace,
  colors.emeraldGreen,
];

// Animation for the segments
const pulse = keyframes`
  0% {
    transform: scaleY(0.3);
    opacity: 0.5;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(0.3);
    opacity: 0.5;
  }
`;

const Container = styled.div<{ $fullPage?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl} 0;
  width: 100%;
  ${(props) =>
    props.$fullPage &&
    `
    height: 70vh;
  `}
`;

const KenteSpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: ${spacing.lg};
`;

const KenteSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const KenteSegment = styled.div<{ $index: number; color: string }>`
  width: 8px;
  height: 40px;
  margin: 0 2px;
  background-color: ${(props) => props.color};
  border-radius: 4px;
  animation: ${pulse} 1.2s ease-in-out infinite;
  animation-delay: ${(props) => props.$index * 0.1}s;
`;

const rotateKente = keyframes`
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
`;

const KenteCircle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-image: repeating-linear-gradient(
      45deg,
      ${colors.maximumYellow},
      ${colors.maximumYellow} 10px,
      ${colors.darkPastelRed},
      ${colors.darkPastelRed} 20px,
      ${colors.deepSpace},
      ${colors.deepSpace} 30px,
      ${colors.emeraldGreen},
      ${colors.emeraldGreen} 40px
    )
    1;
  animation: ${rotateKente} 8s linear infinite;
`;

const Message = styled.p`
  color: ${colors.deepSpace};
  font-size: 1rem;
  text-align: center;
  margin-top: ${spacing.md};
  position: relative;
  padding-bottom: ${spacing.md};

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 2px;
    width: 40px;
    background: linear-gradient(
      to right,
      ${colors.maximumYellow},
      ${colors.darkPastelRed},
      ${colors.deepSpace},
      ${colors.emeraldGreen}
    );
  }
`;

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading recipes...',
  fullPage = false,
}) => {
  const [segments, setSegments] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Create kente-colored segments
    const kenteSegments = [];
    for (let i = 0; i < 6; i++) {
      const colorIndex = i % kenteColors.length;
      kenteSegments.push(
        <KenteSegment
          key={i}
          $index={i}
          color={kenteColors[colorIndex]}
        />
      );
    }
    setSegments(kenteSegments);
  }, []);

  return (
    <Container $fullPage={fullPage}>
      <KenteSpinnerWrapper>
        <KenteCircle />
        <KenteSpinner>{segments}</KenteSpinner>
      </KenteSpinnerWrapper>
      <Message>{message}</Message>
    </Container>
  );
};

export default LoadingState;
