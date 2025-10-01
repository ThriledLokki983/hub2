import { css } from '@emotion/react';

// Colors
export const colors = {
  // Primary Palette
  deepOliveGreen: '#3A4F41', // Brand Primary
  softAmber: '#F4C77B', // Accent / CTA
  boneWhite: '#F8F5F0', // Light Background
  warmFog: '#EAE6E1', // Cards / Surfaces
  clayRed: '#C25A5A', // Alerts / Highlights
  charcoalInk: '#2A2A2A', // Text Primary

  // Optional Complement
  slateGray: '#6E7673', // Secondary UI / Hover
  mutedTaupe: '#DAD5CF', // Divider / Line
};

// Typography
export const typography = {
  fontFamily: "'General Sans', 'Inter', 'Satoshi', system-ui, -apple-system, sans-serif",
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2rem', // 32px
    '5xl': '2.25rem', // 36px
    '6xl': '3rem', // 48px
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
  },
};

// Spacing (4pt grid)
export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
};

// Shadows
export const shadows = {
  xs: '0 1px 2px rgba(42, 42, 42, 0.05)',
  sm: '0 2px 4px rgba(42, 42, 42, 0.05)',
  md: '0 4px 8px rgba(42, 42, 42, 0.05)',
  lg: '0 8px 16px rgba(42, 42, 42, 0.05)',
  xl: '0 16px 32px rgba(42, 42, 42, 0.05)',
  cosmic: '0 8px 32px rgba(58, 79, 65, 0.12)',
  inner: 'inset 0 2px 4px rgba(42, 42, 42, 0.05)',
  none: 'none',
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

// Transitions
export const transitions = {
  default: 'all 0.2s ease-out',
  fast: 'all 0.15s ease-out',
  slow: 'all 0.3s ease-out',
};

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-index
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Common Mixins & Utilities
export const mixins = {
  glassmorphism: css`
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `,
  hoverTransition: css`
    transition: all 0.2s ease-out;
    &:hover {
      transform: translateY(-2px);
    }
  `,
  focusRing: css`
    outline: none;
    box-shadow: 0 0 0 3px rgba(58, 79, 65, 0.25);
  `,
};
