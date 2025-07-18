import { useEffect } from 'react';

// Return type for useTheme hook
interface ThemeHookReturn {
  isDarkTheme: boolean;
  themeClass: string;
}

/**
 * Hook personnalisé pour la gestion du thème
 * Applique les classes CSS appropriées au body
 */
export const useTheme = (isDarkTheme: boolean): ThemeHookReturn => {
  useEffect(() => {
    // Appliquer/retirer la classe dark-theme sur le body
    document.body.classList.toggle('dark-theme', isDarkTheme);
    
    // Cleanup : retirer la classe si le composant se démonte
    return () => {
      document.body.classList.remove('dark-theme');
    };
  }, [isDarkTheme]);

  return {
    isDarkTheme,
    themeClass: isDarkTheme ? 'dark-theme' : '',
  };
};

// Export types for use in other files
export type { ThemeHookReturn };