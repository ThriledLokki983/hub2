import { createGlobalStyle } from 'styled-components';
import { colors, typography } from '../theme/theme';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    scrollbar-width: thin;
    scrollbar-color: ${colors.emeraldGreen} ${colors.antiqueWhite};
  }

  /* Kente-style Scrollbar - WebKit browsers (Chrome, Safari, Opera) */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.antiqueWhite};
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background:
      repeating-linear-gradient(
        to bottom,
        ${colors.maximumYellow} 0px,
        ${colors.maximumYellow} 8px,
        ${colors.darkPastelRed} 8px,
        ${colors.darkPastelRed} 16px,
        ${colors.deepSpace} 16px,
        ${colors.deepSpace} 24px,
        ${colors.emeraldGreen} 24px,
        ${colors.emeraldGreen} 32px
      );
    border: 2px solid ${colors.antiqueWhite};
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  ::-webkit-scrollbar-thumb:hover {
    background:
      repeating-linear-gradient(
        to bottom,
        ${colors.emeraldGreen} 0px,
        ${colors.emeraldGreen} 8px,
        ${colors.maximumYellow} 8px,
        ${colors.maximumYellow} 16px,
        ${colors.darkPastelRed} 16px,
        ${colors.darkPastelRed} 24px,
        ${colors.deepSpace} 24px,
        ${colors.deepSpace} 32px
      );
  }

  ::-webkit-scrollbar-corner {
    background: ${colors.antiqueWhite};
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: ${typography.fontFamily};
    letter-spacing: ${typography.letterSpacing};
    background-color: ${colors.cosmicLatte};
    color: ${colors.deepSpace};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${typography.fontWeights.light};
    letter-spacing: ${typography.letterSpacing};
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 2.75rem;
  }

  h2 {
    font-size: 2.25rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.25rem;
  }

  h6 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  button {
    font-family: ${typography.fontFamily};
    letter-spacing: ${typography.letterSpacing};
    cursor: pointer;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyles;
