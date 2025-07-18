import { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import { SCROLL_CONFIG, SECTIONS_CONFIG } from '../utils/constants';

// Types for scroll hook
interface ScrollHookReturn {
  scrollProgress: number;
  activeSection: string;
  isDarkTheme: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollManagerRef: React.RefObject<ScrollManager | null>;
  lenisRef: React.RefObject<Lenis | null>;
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
 */
export const useScroll = (): ScrollHookReturn => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('accueil');
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollManagerRef = useRef<ScrollManager | null>(null);

  // Fonction de navigation vers une section
  const scrollToSection = useCallback((sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element && lenisRef.current) {
      lenisRef.current.scrollTo(element, {
        offset: 0,
        duration: SCROLL_CONFIG.SMOOTH_DURATION,
        easing: (t: number): number => {
          // Enhanced easing for smooth navigation
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
      });
    }
  }, []);

  // Calcul de la progression du scroll
  const calculateScrollProgress = useCallback((scrollTop: number, windowHeight: number, documentHeight: number): number => {
    const maxScroll = documentHeight - windowHeight;
    return Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
  }, []);

  // Détection du thème basé sur la position
  const calculateTheme = useCallback((scrollTop: number, windowHeight: number): boolean => {
    const presentationSection = document.getElementById('presentation');
    return presentationSection !== null && 
           scrollTop > presentationSection.offsetTop - windowHeight * SECTIONS_CONFIG.thresholds.theme;
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

  // Handler principal du scroll
  const handleScroll = useCallback((lenis: LenisScrollEvent): void => {
    const scrollTop = lenis.scroll;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Mise à jour de la progression
    const progress = calculateScrollProgress(scrollTop, windowHeight, documentHeight);
    setScrollProgress(progress);

    // Mise à jour du thème
    const isDark = calculateTheme(scrollTop, windowHeight);
    setIsDarkTheme(current => (current !== isDark ? isDark : current));

    // Mise à jour de la section active
    const currentSection = calculateActiveSection(scrollTop, windowHeight);
    setActiveSection(current => (current !== currentSection ? currentSection : current));

    // Notification aux gestionnaires externes
    if (scrollManagerRef.current) {
      scrollManagerRef.current.handleScroll(scrollTop, windowHeight);
    }
  }, [calculateScrollProgress, calculateTheme, calculateActiveSection]);

  // Initialisation de Lenis
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t: number): number => {
        // cubic-bezier(0.02, 0.4, 0.05, 1) implementation
        const c1 = 0.02, c2 = 0.4, c3 = 0.05, c4 = 1;
        const cx = 3 * c1;
        const bx = 3 * (c3 - c1) - cx;
        const ax = 1 - cx - bx;
        const cy = 3 * c2;
        const by = 3 * (c4 - c2) - cy;
        const ay = 1 - cy - by;
        const epsilon = 1e-6;
        
        function sampleCurveX(t: number): number {
          return ((ax * t + bx) * t + cx) * t;
        }
        
        function sampleCurveY(t: number): number {
          return ((ay * t + by) * t + cy) * t;
        }
        
        function sampleCurveDerivativeX(t: number): number {
          return (3 * ax * t + 2 * bx) * t + cx;
        }
        
        function solveCurveX(x: number): number {
          let t2 = x;
          for (let i = 0; i < 8; i++) {
            const x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < epsilon) return t2;
            const d2 = sampleCurveDerivativeX(t2);
            if (Math.abs(d2) < epsilon) break;
            t2 = t2 - x2 / d2;
          }
          return t2;
        }
        
        return sampleCurveY(solveCurveX(t));
      },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Configuration des listeners
    lenisRef.current.on('scroll', handleScroll);
    
    // Boucle d'animation
    function raf(time: number): void {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    // Appel initial
    handleScroll({ scroll: window.pageYOffset });
    
    return () => {
      lenisRef.current?.destroy();
    };
  }, [handleScroll]);

  return {
    scrollProgress,
    activeSection,
    isDarkTheme,
    scrollToSection,
    scrollManagerRef,
    lenisRef,
  };
};

// Export types for use in other files
export type { ScrollHookReturn, ScrollManager, LenisScrollEvent };