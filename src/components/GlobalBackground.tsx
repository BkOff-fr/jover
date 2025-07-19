import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppScroll, useAppMouse } from '../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

interface BackgroundState {
  background: string;
  effects: {
    ambient: string;
    overlay: string;
    studio?: string;
    grid?: string;
  };
}

interface BackgroundStates {
  accueil: BackgroundState;
  presentation: BackgroundState;
  experience: BackgroundState;
  portfolio: BackgroundState;
  contact: BackgroundState;
  [key: string]: BackgroundState;
}

const GlobalBackground: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const { activeSection, scrollProgress } = useAppScroll();
  const { mousePosition } = useAppMouse();
  const lastUpdateRef = useRef<number>(0);

  // Fonction de debounce pour éviter les animations trop fréquentes
  const debounceUpdate = useCallback((callback: () => void, delay: number = 100) => {
    const now = Date.now();
    if (now - lastUpdateRef.current > delay) {
      callback();
      lastUpdateRef.current = now;
    }
  }, []);

  // Définition des états de background par section (memoized)
  const backgroundStates: BackgroundStates = useMemo(() => ({
    accueil: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      effects: {
        ambient: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(30, 185, 0, 0.02) 0%, transparent 50%)',
        overlay: 'none'
      }
    },
    presentation: {
      background: 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)',
      effects: {
        ambient: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(30, 185, 0, 0.04) 0%, transparent 60%)',
        overlay: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%)'
      }
    },
    experience: {
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
      effects: {
        ambient: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(30, 185, 0, 0.05) 0%, transparent 40%)',
        overlay: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%)',
        studio: 'radial-gradient(ellipse 40% 60% at 30% 40%, rgba(30, 185, 0, 0.03) 0%, transparent 70%)'
      }
    },
    portfolio: {
      background: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
      effects: {
        ambient: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(30, 185, 0, 0.08) 0%, transparent 50%)',
        overlay: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
        grid: 'radial-gradient(ellipse 60% 80% at 50% 30%, rgba(30, 185, 0, 0.02) 0%, transparent 80%)'
      }
    },
    contact: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      effects: {
        ambient: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(30, 185, 0, 0.02) 0%, transparent 70%)',
        overlay: 'linear-gradient(180deg, transparent 0%, rgba(248, 249, 250, 0.5) 100%)',
        studio: 'radial-gradient(ellipse 60% 80% at 30% 20%, rgba(30, 185, 0, 0.01) 0%, transparent 90%)'
      }
    }
  }), []);

  // Effet de mise à jour du background selon la section active
  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    const currentState = backgroundStates[activeSection] || backgroundStates.accueil;
    
    // Mise à jour des effets CSS custom properties
    const effectsString = Object.values(currentState.effects).join(', ');
    
    // Animation unifiée du background avec tous les effets
    gsap.to(background, {
      backgroundImage: `${currentState.background}, ${effectsString}`,
      duration: 1.2,
      ease: "power2.out"
    });

    // Synchroniser les changements de couleur des textes avec le background
    const isDark = activeSection !== 'accueil';
    document.body.classList.toggle('dark-theme', isDark);

  }, [activeSection, backgroundStates]);

  // Effet de parallaxe et effets dynamiques selon la souris (optimisé)
  useEffect(() => {
    const background = backgroundRef.current;
    if (!background || !mousePosition) return;
    
    // Mise à jour des positions pour les effets ambient avec intensité réduite
    const intensity = activeSection === 'experience' ? 0.4 : 0.15;
    const parallaxX = (mousePosition.x - 50) * intensity;
    const parallaxY = (mousePosition.y - 50) * intensity;

    // Animation plus douce et plus lente pour éviter les flashs
    gsap.to(background, {
      '--ambient-x': `${50 + parallaxX}%`,
      '--ambient-y': `${50 + parallaxY}%`,
      duration: 3,
      ease: "power3.out"
    });

  }, [mousePosition, activeSection]);

  // Effet de transition fluide basé sur la section active (unifié et optimisé)
  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    debounceUpdate(() => {
      // Appliquer des effets visuels selon la section active
      switch (activeSection) {
        case 'presentation':
          gsap.to(background, {
            filter: 'brightness(0.95) contrast(1.05)',
            duration: 1.2,
            ease: "power2.out"
          });
          break;
        case 'experience':
          // Effet de grain léger pour l'expérience avec scroll progress
          const grainIntensity = Math.min(0.05, scrollProgress * 0.0001);
          gsap.to(background, {
            filter: `brightness(0.9) contrast(1.1) saturate(1.1) sepia(${grainIntensity})`,
            duration: 1.2,
            ease: "power2.out"
          });
          break;
        case 'portfolio':
          gsap.to(background, {
            filter: 'brightness(0.85) contrast(1.2) saturate(0.9)',
            duration: 1.2,
            ease: "power2.out"
          });
          break;
        default:
          gsap.to(background, {
            filter: 'none',
            duration: 1.2,
            ease: "power2.out"
          });
          break;
      }
    }, 50); // Debounce de 50ms pour les filtres
  }, [activeSection, scrollProgress, debounceUpdate]);

  return (
    <div 
      ref={backgroundRef}
      className="global-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: backgroundStates.accueil.background,
        '--ambient-x': '50%',
        '--ambient-y': '50%',
        willChange: 'background, filter, transform'
      } as React.CSSProperties}
    />
  );
};

export default GlobalBackground;