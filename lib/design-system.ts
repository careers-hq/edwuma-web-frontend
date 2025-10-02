// Design System Configuration
export const colors = {
  primary: '#244034',
  accent: '#d2f34c',
  success: '#00bf58',
  text: {
    primary: 'rgba(0, 0, 0, 0.7)',
    secondary: 'rgba(0, 0, 0, 0.5)',
    inverse: '#ffffff',
  },
  background: {
    white: '#ffffff',
    surface: '#f8fafc',
    primary: '#244034',
  },
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 1px 3px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
} as const;

export const typography = {
  fontFamily: {
    primary: ['Gordita', 'EB Garamond', 'serif', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    secondary: ['EB Garamond', 'serif'],
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
  },
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '2',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const animations = {
  transition: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
  },
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
} as const;
