'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { useScroll } from '../hooks/useScroll';
import { useMouse } from '../hooks/useMouse';
import { useClickAnimation } from '../hooks/useClickAnimation';

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
export interface AppScrollHook {
  scrollProgress: number;
  activeSection: string;
  isDarkTheme: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollManagerRef: React.RefObject<any>;
}

export interface AppMouseHook {
  mousePosition: MousePosition;
  screenPosition: MousePosition;
}

export interface AppThemeHook {
  isDarkTheme: boolean;
  themeClass: string;
}

export interface AppClickAnimationHook {
  handleClick: (element: HTMLElement | null) => void;
}

/**
 * Contexte d'application principal optimisé
 * Utilise un seul contexte pour éviter les re-renders multiples
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Provider du contexte d'application optimisé
 * Utilise useMemo pour éviter les re-renders inutiles
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const scrollState = useScroll();
  const mouseState = useMouse();
  const clickAnimationState = useClickAnimation();

  // Memoize la valeur du contexte pour éviter les re-renders
  const contextValue = React.useMemo(() => ({
    // Scroll state
    scrollProgress: scrollState.scrollProgress,
    activeSection: scrollState.activeSection,
    isDarkTheme: scrollState.isDarkTheme,
    scrollToSection: scrollState.scrollToSection,
    scrollManagerRef: scrollState.scrollManagerRef,
    
    // Mouse state
    mousePosition: mouseState.mousePosition,
    screenPosition: mouseState.screenPosition,
    
    // Theme state
    themeClass: scrollState.isDarkTheme ? 'dark-theme' : 'light-theme',
    
    // Click animations
    handleClick: clickAnimationState.handleClick,
  }), [scrollState, mouseState, clickAnimationState]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Hooks personnalisés optimisés pour accéder au contexte global
 * Utilise des sélecteurs spécialisés pour éviter les re-renders inutiles
 */
export const useAppScroll = (): AppScrollHook => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppScroll must be used within AppProvider');
  
  return React.useMemo(() => ({
    scrollProgress: ctx.scrollProgress,
    activeSection: ctx.activeSection,
    isDarkTheme: ctx.isDarkTheme,
    scrollToSection: ctx.scrollToSection,
    scrollManagerRef: ctx.scrollManagerRef,
  }), [ctx.scrollProgress, ctx.activeSection, ctx.isDarkTheme, ctx.scrollToSection, ctx.scrollManagerRef]);
};

export const useAppMouse = (): AppMouseHook => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppMouse must be used within AppProvider');
  
  return React.useMemo(() => ({
    mousePosition: ctx.mousePosition,
    screenPosition: ctx.screenPosition,
  }), [ctx.mousePosition, ctx.screenPosition]);
};

export const useAppTheme = (): AppThemeHook => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppTheme must be used within AppProvider');
  
  return React.useMemo(() => ({
    isDarkTheme: ctx.isDarkTheme,
    themeClass: ctx.themeClass,
  }), [ctx.isDarkTheme, ctx.themeClass]);
};

export const useAppClick = (): AppClickAnimationHook => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppClick must be used within AppProvider');
  
  return React.useMemo(() => ({
    handleClick: ctx.handleClick,
  }), [ctx.handleClick]);
};