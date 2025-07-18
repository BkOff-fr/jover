/**
 * Hooks Exports
 * Point d'entrée centralisé pour tous les hooks personnalisés
 */

export { useScroll } from './useScroll';
export { useTheme } from './useTheme';
export { useMouse } from './useMouse';
export { useClickAnimation } from './useClickAnimation';

// Re-export types for easy importing
export type { ScrollHookReturn, ScrollManager, LenisScrollEvent } from './useScroll';
export type { MousePosition, MouseHookReturn } from './useMouse';
export type { ThemeHookReturn } from './useTheme';
export type { ClickAnimationHookReturn } from './useClickAnimation';