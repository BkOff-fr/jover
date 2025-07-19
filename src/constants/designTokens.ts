/**
 * Design Tokens - Centralisation des valeurs de design
 * Facilite la maintenance et la cohérence visuelle
 */

// Types pour les couleurs
interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

interface PrimaryColors {
  main: string;
  light: string;
  lighter: string;
  dark: string;
}

interface NeutralColors {
  black: string;
  white: string;
  gray: ColorShades;
}

interface BackgroundColors {
  light: string;
  dark: string;
  presentation: string;
}

interface StateColors {
  hover: string;
  focus: string;
  active: string;
  disabled: string;
}

// Types pour l'espacement
interface SectionSpacing {
  margin: string;
  marginLarge: string;
  padding: string;
}

interface HeaderSpacing {
  height: string;
  padding: string;
}

// Types pour la typographie
interface FontFamily {
  primary: string;
  fallback: string;
}

interface FontSizes {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  xxxl: string;
  display: string;
}

interface FontWeights {
  normal: number;
  medium: number;
  bold: number;
  black: number;
}

interface LetterSpacing {
  tight: string;
  normal: string;
  wide: string;
}

// Types pour les animations
interface Duration {
  fast: string;
  normal: string;
  slow: string;
  slower: string;
  slowest: string;
}

interface Easing {
  ease: string;
  easeOut: string;
  bounce: string;
}

// Types pour les breakpoints
interface Breakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  wide: string;
  up: (size: keyof Omit<Breakpoints, 'up' | 'down'>) => string;
  down: (size: keyof Omit<Breakpoints, 'up' | 'down'>) => string;
}

// Types pour les z-index
interface ZIndex {
  base: number;
  dropdown: number;
  modal: number;
  tooltip: number;
  header: number;
  cursor: number;
  cursorTrail: number;
  flash: number;
}

// Types pour les ombres
interface Shadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  logo: string;
  focus: string;
}

// Couleurs principales
export const COLORS = {
  // Palette Sony Green
  primary: {
    main: '#1EB900',
    light: '#4CAF50',
    lighter: '#81C784',
    dark: '#0F5D00',
  } as PrimaryColors,
  
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
  } as { black: string; white: string; gray: ColorShades },

  // Couleurs de fond
  background: {
    light: '#ffffff',
    dark: '#1e1e1e',
    presentation: '#212121',
  } as BackgroundColors,

  // États
  state: {
    hover: 'rgba(30, 185, 0, 0.1)',
    focus: 'rgba(30, 185, 0, 0.2)',
    active: '#1EB900',
    disabled: '#e0e0e0',
  } as StateColors
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
  } as SectionSpacing,
  
  header: {
    height: '80px',
    padding: '20px 40px',
  } as HeaderSpacing
};

// Typographie
export const TYPOGRAPHY = {
  fontFamily: {
    primary: "'Pathway Extreme', sans-serif",
    fallback: 'system-ui, -apple-system, sans-serif',
  } as FontFamily,
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
    display: '120px',
  } as FontSizes,
  
  fontWeight: {
    normal: 500,
    medium: 600,
    bold: 800,
    black: 900,
  } as FontWeights,
  
  letterSpacing: {
    tight: '0.1em',
    normal: '0.3em',
    wide: '0.4em',
  } as LetterSpacing
};

// Animations et transitions
export const MOTION = {
  duration: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.6s',
    slower: '0.8s',
    slowest: '1.2s',
  } as Duration,
  
  easing: {
    ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
    easeOut: 'cubic-bezier(0.02, 0.4, 0.05, 1)',
    bounce: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  } as Easing,
  
  // Durées spécifiques
  click: '0.6s',
  scroll: '1.5s',
  section: '1.2s',
};

// Breakpoints pour le responsive
export const BREAKPOINTS: Breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
  
  // Media queries helpers
  up: (size: keyof Omit<Breakpoints, 'up' | 'down'>) => `@media (min-width: ${BREAKPOINTS[size]})`,
  down: (size: keyof Omit<Breakpoints, 'up' | 'down'>) => `@media (max-width: ${BREAKPOINTS[size]})`,
};

// Z-index système
export const Z_INDEX: ZIndex = {
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
export const SHADOWS: Shadows = {
  sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
  md: '0 4px 8px rgba(0, 0, 0, 0.12)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
  xl: '0 16px 32px rgba(0, 0, 0, 0.2)',
  
  // Ombres spécifiques
  logo: '0 8px 16px rgba(0, 0, 0, 0.15)',
  focus: '0 0 20px rgba(30, 185, 0, 0.3)',
};