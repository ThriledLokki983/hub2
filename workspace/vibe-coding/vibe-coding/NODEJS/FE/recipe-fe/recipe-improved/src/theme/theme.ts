// Cosmic-themed design tokens
export const colors = {
  // Deep Galaxy Greys
  darkBackground: '#0D0D0D',
  midBackground: '#1A1A1A',
  surfaceBackground: '#2E2E2E',

  // Clean Whites
  white: '#FFFFFF',

  // Cosmic Oranges
  primaryOrange: '#FF7A00',
  secondaryOrange: '#FF8C42',

  // Muted Nebula Blues
  accentBlue: '#4A5B6E',

  // Additional UI Colors
  error: '#FF5252',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',

  // Gradient backgrounds
  cosmicGradient: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 100%)',
  accentGradient: 'linear-gradient(135deg, #FF7A00 0%, #FF8C42 100%)',
};

export const typography = {
  fontFamily: "'Inter', 'Neue Haas Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  letterSpacing: '-0.04em',

  fontWeights: {
    thin: 100,
    extraLight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },

  sizes: {
    headingLarge: '3.5rem',
    headingMedium: '2.75rem',
    headingSmall: '2rem',
    subtitle: '1.5rem',
    body: '1rem',
    bodySmall: '0.875rem',
    caption: '0.75rem',
  },
};

export const spacing = {
  xxs: '0.25rem',
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  round: '9999px',
};

export const shadows = {
  subtle: '0 2px 10px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 20px rgba(0, 0, 0, 0.15)',
  strong: '0 8px 30px rgba(0, 0, 0, 0.2)',
  cosmic: '0 8px 30px rgba(255, 122, 0, 0.15)',
  inset: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
};

export const transitions = {
  fast: '0.2s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
};

export const breakpoints = {
  mobile: '576px',
  tablet: '768px',
  laptop: '992px',
  desktop: '1200px',
};

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
};

export default theme;
