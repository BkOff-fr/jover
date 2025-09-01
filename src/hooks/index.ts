// Export all hooks
export { default as useScroll } from './useScroll';
export { default as useMouse } from './useMouse';
export { default as useTheme } from './useTheme';
export { default as useClickAnimation } from './useClickAnimation';

// Re-export types
export type { AppScrollHook, AppMouseHook, AppThemeHook, AppClickAnimationHook } from '../context/AppContext';