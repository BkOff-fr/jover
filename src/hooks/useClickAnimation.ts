'use client'

import { useState, useCallback } from 'react';

// Types
interface ClickAnimationHookReturn {
  handleClick: (element: HTMLElement | null) => void;
}

/**
 * Hook personnalisé pour les animations de clic
 * Adapté pour Next.js avec vérifications SSR
 */
export const useClickAnimation = (): ClickAnimationHookReturn => {
  const [mounted, setMounted] = useState<boolean>(false);

  // Gestionnaire de clic avec animation
  const handleClick = useCallback((element: HTMLElement | null): void => {
    if (!element || typeof window === 'undefined') return;

    // Vérification des préférences d'animation
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Animation de clic simple
    const originalTransform = element.style.transform;
    
    element.style.transform = 'scale(0.95)';
    element.style.transition = 'transform 0.1s ease-out';

    setTimeout(() => {
      element.style.transform = originalTransform;
      
      // Nettoyage après l'animation
      setTimeout(() => {
        element.style.transition = '';
      }, 100);
    }, 100);
  }, []);

  return { handleClick };
};

export default useClickAnimation;