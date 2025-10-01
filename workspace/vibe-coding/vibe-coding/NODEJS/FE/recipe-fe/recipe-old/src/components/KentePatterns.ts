import { css } from 'styled-components';
import { colors } from '../theme/theme';

// Updated patterns with solid colors in yellow-red-black-green-yellow order
export const kenteAccentHorizontal = css`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    height: 4px;
    left: 0;
    right: 0;
    bottom: -16px;
    background: repeating-linear-gradient(
      90deg,
      ${colors.maximumYellow},
      ${colors.maximumYellow} 20px,
      ${colors.darkPastelRed},
      ${colors.darkPastelRed} 40px,
      ${colors.deepSpace},
      ${colors.deepSpace} 60px,
      ${colors.emeraldGreen},
      ${colors.emeraldGreen} 80px,
      ${colors.maximumYellow},
      ${colors.maximumYellow} 100px
    );
  }
`;

export const kenteBorder = css`
  border: none;
  position: relative;
  padding-left: 16px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 4px;
    background: repeating-linear-gradient(
      0deg,
      ${colors.maximumYellow},
      ${colors.maximumYellow} 20px,
      ${colors.darkPastelRed},
      ${colors.darkPastelRed} 40px,
      ${colors.deepSpace},
      ${colors.deepSpace} 60px,
      ${colors.emeraldGreen},
      ${colors.emeraldGreen} 80px,
      ${colors.maximumYellow},
      ${colors.maximumYellow} 100px
    );
  }
`;

export const kenteBackground = css`
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -5%;
    right: -5%;
    width: 30%;
    height: 30%;
    opacity: 0.05;
    background-image: repeating-linear-gradient(
      45deg,
      ${colors.maximumYellow},
      ${colors.maximumYellow} 25px,
      transparent 25px,
      transparent 50px,
      ${colors.darkPastelRed},
      ${colors.darkPastelRed} 75px,
      transparent 75px,
      transparent 100px,
      ${colors.deepSpace},
      ${colors.deepSpace} 125px,
      transparent 125px,
      transparent 150px,
      ${colors.emeraldGreen},
      ${colors.emeraldGreen} 175px,
      transparent 175px,
      transparent 200px
    );
    z-index: 0;
    border-radius: 50%;
    transform: rotate(-10deg);
  }
`;

export const kenteAccentDot = css`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${colors.maximumYellow};
    right: -16px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const kenteCornerAccent = css`
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 15px;
    height: 15px;
    background: linear-gradient(
      135deg,
      transparent 0%,
      transparent 50%,
      ${colors.maximumYellow} 50%,
      ${colors.maximumYellow} 100%
    );
  }
`;

export const kenteDiamondAccent = css`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    height: 40px;
    width: 40px;
    right: 10px;
    bottom: 10px;
    opacity: 0.1;
    background-image: linear-gradient(
        45deg,
        transparent 45%,
        ${colors.darkPastelRed} 45%,
        ${colors.darkPastelRed} 55%,
        transparent 55%
      ),
      linear-gradient(
        -45deg,
        transparent 45%,
        ${colors.emeraldGreen} 45%,
        ${colors.emeraldGreen} 55%,
        transparent 55%
      );
    background-size: 20px 20px;
  }
`;
