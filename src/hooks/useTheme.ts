'use client'

import { useState, useEffect } from 'react';

// Return type for useTheme hook
interface ThemeHookReturn {
  themeClass: string;
}

/**
 * Hook personnalisé pour la gestion du thème
 * Applique les classes CSS appropriées au body
 * Adapté pour Next.js avec vérifications SSR
 */
export const useTheme = (isDarkTheme: boolean): ThemeHookReturn => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Appliquer/retirer la classe dark-theme sur le body
    document.body.classList.toggle('dark-theme', isDarkTheme);
    
    // Cleanup : retirer la classe si le composant se démonte
    return () => {
      document.body.classList.remove('dark-theme');
    };
  }, [isDarkTheme, mounted]);

  return {
    themeClass: isDarkTheme ? 'dark-theme' : '',
  };
};

export default useTheme;