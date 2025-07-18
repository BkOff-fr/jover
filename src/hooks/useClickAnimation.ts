import { useCallback } from 'react';
import { ANIMATION_CONFIG } from '../utils/constants';

// Return type for useClickAnimation hook
interface ClickAnimationHookReturn {
  triggerClickAnimation: (element: HTMLElement | null, className?: string, duration?: number) => (() => void) | undefined;
  handleNavClick: (e: React.MouseEvent<HTMLElement>, sectionId: string, onNavigate?: (sectionId: string) => void) => (() => void) | undefined;
  handleClick: (element: HTMLElement | null) => void;
}

/**
 * Hook personnalisé pour les animations au clic
 * Gère l'ajout/suppression de classes d'animation
 */
export const useClickAnimation = (): ClickAnimationHookReturn => {
  const triggerClickAnimation = useCallback((element: HTMLElement | null, className: string = 'clicked', duration: number = ANIMATION_CONFIG.CLICK_DURATION): (() => void) | undefined => {
    if (!element) return;

    // Ajouter la classe d'animation
    element.classList.add(className);
    
    // Programmer la suppression de la classe
    const timeoutId = setTimeout(() => {
      element.classList.remove(className);
    }, duration);

    // Retourner une fonction de nettoyage
    return () => {
      clearTimeout(timeoutId);
      element.classList.remove(className);
    };
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLElement>, sectionId: string, onNavigate?: (sectionId: string) => void): (() => void) | undefined => {
    e.preventDefault();
    
    // Déclencher l'animation
    const cleanup = triggerClickAnimation(e.currentTarget);
    
    // Appeler la fonction de navigation
    if (onNavigate) {
      onNavigate(sectionId);
    }

    // Note: Le cleanup sera automatiquement appelé par le timeout
    return cleanup;
  }, [triggerClickAnimation]);

  // Simple handleClick function for direct element animation
  const handleClick = useCallback((element: HTMLElement | null): void => {
    if (element) {
      triggerClickAnimation(element);
    }
  }, [triggerClickAnimation]);

  return {
    triggerClickAnimation,
    handleNavClick,
    handleClick,
  };
};

// Export types for use in other files
export type { ClickAnimationHookReturn };