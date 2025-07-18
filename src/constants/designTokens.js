/**
 * Design Tokens - Centralisation des valeurs de design
 * Facilite la maintenance et la cohérence visuelle
 */

// Couleurs principales
export const COLORS = {
  // Palette Sony Green
  primary: {
    main: '#1EB900',
    light: '#4CAF50',
    lighter: '#81C784',
    dark: '#0F5D00',
  },
  
  // Couleurs neutres
  neutral: {
    black: '#000000',
    white: '#ffffff',
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    }
  },

  // Couleurs de fond
  background: {
    light: '#ffffff',
    dark: '#1e1e1e',
    presentation: '#212121',
  },

  // États
  state: {
    hover: 'rgba(30, 185, 0, 0.1)',
    focus: 'rgba(30, 185, 0, 0.2)',
    active: '#1EB900',
    disabled: '#e0e0e0',
  }
};

// Espacements
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
  
  // Espacements spécifiques
  section: {
    margin: '150px',
    marginLarge: '300px',
    padding: '20px',
  },
  
  header: {
    height: '80px',
    padding: '20px 40px',
  }
};

// Typographie
export const TYPOGRAPHY = {
  fontFamily: {
    primary: "'Pathway Extreme', sans-serif",
    fallback: 'system-ui, -apple-system, sans-serif',
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
    display: '120px',
  },
  
  fontWeight: {
    normal: 500,
    medium: 600,
    bold: 800,
    black: 900,
  },
  
  letterSpacing: {
    tight: '0.1em',
    normal: '0.3em',
    wide: '0.4em',
  }
};

// Animations et transitions
export const MOTION = {
  duration: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.6s',
    slower: '0.8s',
    slowest: '1.2s',
  },
  
  easing: {
    ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
    easeOut: 'cubic-bezier(0.02, 0.4, 0.05, 1)',
    bounce: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  },
  
  // Durées spécifiques
  click: '0.6s',
  scroll: '1.5s',
  section: '1.2s',
};

// Breakpoints pour le responsive
export const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
  
  // Media queries helpers
  up: (size) => `@media (min-width: ${BREAKPOINTS[size]})`,
  down: (size) => `@media (max-width: ${BREAKPOINTS[size]})`,
};

// Z-index système
export const Z_INDEX = {
  base: 1,
  dropdown: 10,
  modal: 100,
  tooltip: 200,
  header: 1000,
  cursor: 9999,
  cursorTrail: 9998,
  flash: 9997,
};

// Ombres
export const SHADOWS = {
  sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
  md: '0 4px 8px rgba(0, 0, 0, 0.12)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
  xl: '0 16px 32px rgba(0, 0, 0, 0.2)',
  
  // Ombres spécifiques
  logo: '0 8px 16px rgba(0, 0, 0, 0.15)',
  focus: '0 0 20px rgba(30, 185, 0, 0.3)',
};