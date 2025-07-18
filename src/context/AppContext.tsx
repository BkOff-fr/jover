import React, { createContext, useContext, ReactNode } from 'react';
import { useScroll, useTheme, useMouse, useClickAnimation } from '../hooks';

// Types for mouse position
interface MousePosition {
  x: number;
  y: number;
}

// Types for scroll state
interface ScrollState {
  scrollProgress: number;
  activeSection: string;
  isDarkTheme: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollManagerRef: React.RefObject<any>;
  lenisRef: React.RefObject<any>;
}

// Types for mouse state
interface MouseState {
  mousePosition: MousePosition;
  screenPosition: MousePosition;
}

// Types for theme state
interface ThemeState {
  themeClass: string;
}

// Types for click animation state
interface ClickAnimationState {
  handleClick: (element: HTMLElement | null) => void;
}

// Main context type
interface AppContextType {
  // Scroll state
  scrollProgress: number;
  activeSection: string;
  isDarkTheme: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollManagerRef: React.RefObject<any>;
  lenisRef: React.RefObject<any>;
  
  // Mouse state
  mousePosition: MousePosition;
  screenPosition: MousePosition;
  
  // Theme state
  themeClass: string;
  
  // Click animations
  handleClick: (element: HTMLElement | null) => void;
}

// Provider props type
interface AppProviderProps {
  children: ReactNode;
}

// Specialized hook return types
interface AppScrollHook {
  scrollProgress: number;
  activeSection: string;
  isDarkTheme: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollManagerRef: React.RefObject<any>;
}

interface AppMouseHook {
  mousePosition: MousePosition;
  screenPosition: MousePosition;
}

interface AppThemeHook {
  isDarkTheme: boolean;
  themeClass: string;
}

interface AppClickAnimationHook {
  handleClick: (element: HTMLElement | null) => void;
}

/**
 * Contexte d'application principal
 * Centralise la gestion d'état globale et évite le props drilling
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Provider du contexte d'application
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Hooks de gestion d'état
  const scrollState = useScroll();
  const mouseState = useMouse();
  const themeState = useTheme(scrollState.isDarkTheme);
  const clickAnimationState = useClickAnimation();

  // Valeur du contexte
  const contextValue: AppContextType = {
    // État du scroll
    scrollProgress: scrollState.scrollProgress,
    activeSection: scrollState.activeSection,
    isDarkTheme: scrollState.isDarkTheme,
    scrollToSection: scrollState.scrollToSection,
    scrollManagerRef: scrollState.scrollManagerRef,
    lenisRef: scrollState.lenisRef,

    // État de la souris
    mousePosition: mouseState.mousePosition,
    screenPosition: mouseState.screenPosition,

    // État du thème
    themeClass: themeState.themeClass,

    // Animations
    handleClick: clickAnimationState.handleClick,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte d'application
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};

/**
 * Hooks spécialisés pour accéder à des parties spécifiques du state
 */

// Hook pour l'état du scroll uniquement
export const useAppScroll = (): AppScrollHook => {
  const { 
    scrollProgress, 
    activeSection, 
    isDarkTheme, 
    scrollToSection,
    scrollManagerRef 
  } = useAppContext();
  
  return {
    scrollProgress,
    activeSection,
    isDarkTheme,
    scrollToSection,
    scrollManagerRef,
  };
};

// Hook pour l'état de la souris uniquement
export const useAppMouse = (): AppMouseHook => {
  const { mousePosition, screenPosition } = useAppContext();
  return { mousePosition, screenPosition };
};

// Hook pour l'état du thème uniquement
export const useAppTheme = (): AppThemeHook => {
  const { isDarkTheme, themeClass } = useAppContext();
  return { isDarkTheme, themeClass };
};

// Hook pour les animations de clic
export const useAppClickAnimation = (): AppClickAnimationHook => {
  const { handleClick } = useAppContext();
  return { handleClick };
};

// Export des types pour utilisation dans d'autres fichiers
export type {
  AppContextType,
  AppProviderProps,
  AppScrollHook,
  AppMouseHook,
  AppThemeHook,
  AppClickAnimationHook,
  MousePosition,
  ScrollState,
  MouseState,
  ThemeState,
  ClickAnimationState,
};