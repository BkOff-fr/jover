'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import { SCROLL_CONFIG, SECTIONS_CONFIG } from '../utils/constants';
// Ajout pour synchronisation GSAP
let ScrollTrigger: any = null;
try {
  ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger;
} catch {}

// Types for scroll hook
interface ScrollHookReturn {
  scrollProgress: number;
  activeSection: string;
  isDarkTheme: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollManagerRef: React.RefObject<HTMLElement>;
}

// Type for scroll manager
interface ScrollManager {
  handleScroll: (scrollTop: number, windowHeight: number) => void;
}

// Type for lenis scroll event
interface LenisScrollEvent {
  scroll: number;
}

/**
 * Hook personnalisé pour la gestion du scroll
 * Centralise toute la logique de scroll, thème et détection de sections
 * Adapté pour Next.js avec vérifications SSR
 */
export const useScroll = (): ScrollHookReturn => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('accueil');
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const lenis = useLenis();
  const scrollManagerRef = useRef<HTMLElement>(null!);

  // Fonction de navigation vers une section
  const scrollToSection = useCallback((sectionId: string): void => {
    if (!mounted) return;
    
    const element = document.getElementById(sectionId);
    if (element && lenis) {
      lenis.scrollTo(element, {
        offset: 0,
        duration: SCROLL_CONFIG.SMOOTH_DURATION,
        easing: (t: number): number => {
          // Enhanced easing for smooth navigation
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
      });
    }
  }, [mounted, lenis]);

  // Calcul de la progression du scroll
  const calculateScrollProgress = useCallback((scrollTop: number, windowHeight: number, documentHeight: number): number => {
    const maxScroll = documentHeight - windowHeight;
    return Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
  }, []);

  // Application du thème avec CSS custom properties - optimisé
  const applyThemeChange = useCallback((isDark: boolean) => {
    if (typeof document === 'undefined') return;
    
    // Utilisation de CSS classes au lieu de manipulation DOM directe
    document.body.classList.toggle('dark-theme', isDark);
    
    // Utiliser CSS custom properties pour la cohérence avec GlobalBackground
    document.documentElement.style.setProperty('--is-dark-theme', isDark ? '1' : '0');
  }, []);

  // Détection du thème basé sur la section active
  const calculateTheme = useCallback((scrollTop: number, windowHeight: number): boolean => {
    const scrollPosition = scrollTop + windowHeight * SECTIONS_CONFIG.thresholds.detection;
    
    // Sections qui utilisent le thème sombre
    const darkSections = ['presentation', 'portfolio'];
    
    // Déterminer la section active
    for (let i = SECTIONS_CONFIG.ids.length - 1; i >= 0; i--) {
      const sectionId = SECTIONS_CONFIG.ids[i];
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element && scrollPosition >= element.offsetTop) {
          return darkSections.includes(sectionId);
        }
      }
    }
    
    // Par défaut, thème clair pour 'accueil' et 'contact'
    return false;
  }, []);

  // Détection de la section active
  const calculateActiveSection = useCallback((scrollTop: number, windowHeight: number): string => {
    const scrollPosition = scrollTop + windowHeight * SECTIONS_CONFIG.thresholds.detection;
    
    for (let i = SECTIONS_CONFIG.ids.length - 1; i >= 0; i--) {
      const sectionId = SECTIONS_CONFIG.ids[i];
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element && scrollPosition >= element.offsetTop) {
          return sectionId;
        }
      }
    }
    return 'accueil';
  }, []);

  // Handler principal du scroll utilisant useLenis - optimisé avec requestAnimationFrame
  const frameIdRef = useRef<number>(0);
  const handleScroll = useCallback((data: any): void => {
    if (typeof window === 'undefined') return;

    // Utiliser requestAnimationFrame pour une meilleure performance
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
    }

    frameIdRef.current = requestAnimationFrame(() => {
      const scrollTop = data.scroll;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Mise à jour de la progression
      const progress = calculateScrollProgress(scrollTop, windowHeight, documentHeight);
      setScrollProgress(progress);

      // Mise à jour du thème (seulement si changé)
      const isDark = calculateTheme(scrollTop, windowHeight);
      if (isDark !== isDarkTheme) {
        setIsDarkTheme(isDark);
        applyThemeChange(isDark);
      }

      // Mise à jour de la section active (seulement si changé)
      const currentSection = calculateActiveSection(scrollTop, windowHeight);
      setActiveSection(current => (current !== currentSection ? currentSection : current));
    });
  }, [calculateScrollProgress, calculateTheme, calculateActiveSection, isDarkTheme, applyThemeChange]);

  // Initialisation du montage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setMounted(true);
  }, []);

  // Écoute des événements Lenis séparément
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted || !lenis) return;

    // Wrapper stable pour éviter les re-renders
    const handleScrollEvent = (data: any) => {
      handleScroll(data);
    };

    // Écouter les événements de scroll de Lenis
    lenis.on('scroll', handleScrollEvent);
    // Synchronisation GSAP ScrollTrigger si présent
    if (ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }
    // Appel initial
    handleScrollEvent({ scroll: window.pageYOffset });
    
    return () => {
      // Cleanup des animations frame
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      lenis.off('scroll', handleScrollEvent);
      if (ScrollTrigger) {
        lenis.off('scroll', ScrollTrigger.update);
      }
    };
  }, [lenis, mounted, handleScroll]);


  // Gestion du mode accessibilité
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const checkAccessibilityMode = (): void => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hasTouch = 'ontouchstart' in window;
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      
      // Active le mode accessibilité si nécessaire, uniquement côté client après hydratation
      if (prefersReducedMotion || hasTouch || hasCoarsePointer) {
        requestAnimationFrame(() => {
          document.body.classList.add('accessibility-mode');
        });
      }
    };

    checkAccessibilityMode();
  }, [mounted]);

  // Valeurs par défaut pour SSR
  if (!mounted) {
    return {
      scrollProgress: 0,
      activeSection: 'accueil',
      isDarkTheme: false,
      scrollToSection: () => {},
      scrollManagerRef,
    };
  }

  return {
    scrollProgress,
    activeSection,
    isDarkTheme,
    scrollToSection,
    scrollManagerRef,
  };
};

export default useScroll;