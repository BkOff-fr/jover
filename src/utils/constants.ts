/**
 * Configuration Constants
 * Centralisation des valeurs de configuration métier
 */

// Types for configuration objects
interface ScrollConfig {
  INDICATOR_THRESHOLD: number;
  THEME_CHANGE_POINT: number;
  PARALLAX_MULTIPLIER: number;
  SMOOTH_DURATION: number;
  MOMENTUM_DECAY: number;
}

interface AnimationConfig {
  CLICK_DURATION: number;
  FLASH_DURATION: number;
  SCROLL_TIMEOUT: number;
  TRANSITION_DELAY: number;
}

interface SectionsConfig {
  ids: string[];
  thresholds: {
    detection: number;
    theme: number;
  };
}

// Configuration du scroll
export const SCROLL_CONFIG: ScrollConfig = {
  INDICATOR_THRESHOLD: 50,
  THEME_CHANGE_POINT: 0.3, // 30% de la hauteur de la fenêtre
  PARALLAX_MULTIPLIER: 0.3,
  SMOOTH_DURATION: 1.5,
  MOMENTUM_DECAY: 0.95,
};

// Configuration des animations
export const ANIMATION_CONFIG: AnimationConfig = {
  CLICK_DURATION: 600, // ms
  FLASH_DURATION: 150, // ms
  SCROLL_TIMEOUT: 100, // ms
  TRANSITION_DELAY: 50, // ms pour le trail du curseur
};

// Configuration des sections
export const SECTIONS_CONFIG: SectionsConfig = {
  ids: ['accueil', 'presentation', 'portfolio', 'contact'],
  thresholds: {
    detection: 0.5, // 50% de la hauteur pour la détection
    theme: 0.3, // 30% pour le changement de thème
  }
};

// Constantes de design
export const DESIGN_TOKENS = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px'
  },
  colors: {
    primary: '#1EB900',
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    }
  },
  animation: {
    duration: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.6s',
      slowest: '1.2s'
    }
  }
};

// Export des types pour utilisation dans d'autres fichiers
export type {
  ScrollConfig,
  AnimationConfig,
  SectionsConfig,
};