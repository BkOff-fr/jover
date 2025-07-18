import React, { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppScroll, useAppMouse } from '../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

const GlobalBackground = () => {
  const backgroundRef = useRef(null);
  const { activeSection, scrollProgress } = useAppScroll();
  const { mousePosition } = useAppMouse();

  // Définition des états de background par section (memoized)
  const backgroundStates = useMemo(() => ({
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
    }
  }), []);

  // Effet de mise à jour du background selon la section active
  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    const currentState = backgroundStates[activeSection] || backgroundStates.accueil;
    
    // Animation de transition du background principal
    gsap.to(background, {
      background: currentState.background,
      duration: 1.2,
      ease: "power2.out"
    });

    // Mise à jour des effets CSS custom properties
    const effectsString = Object.values(currentState.effects).join(', ');
    gsap.to(background, {
      backgroundImage: `${currentState.background}, ${effectsString}`,
      duration: 1.2,
      ease: "power2.out"
    });

    // Synchroniser les changements de couleur des textes avec le background
    const isDark = activeSection !== 'accueil';
    document.body.classList.toggle('dark-theme', isDark);

  }, [activeSection, backgroundStates]);

  // Effet de parallaxe et effets dynamiques selon la souris
  useEffect(() => {
    const background = backgroundRef.current;
    if (!background || !mousePosition) return;
    
    // Mise à jour des positions pour les effets ambient
    const intensity = activeSection === 'experience' ? 0.8 : 0.3;
    const parallaxX = (mousePosition.x - 50) * intensity;
    const parallaxY = (mousePosition.y - 50) * intensity;

    gsap.to(background, {
      '--ambient-x': `${50 + parallaxX}%`,
      '--ambient-y': `${50 + parallaxY}%`,
      duration: 2,
      ease: "power2.out"
    });

  }, [mousePosition, activeSection, backgroundStates]);

  // Animations spéciales selon le scroll progress
  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    // Effet de grain selon le scroll pour la section experience
    if (activeSection === 'experience') {
      const grainIntensity = Math.min(0.1, scrollProgress * 0.001);
      gsap.to(background, {
        filter: `contrast(1.1) brightness(0.95) saturate(1.1) sepia(${grainIntensity})`,
        duration: 0.5,
        ease: "power2.out"
      });
    } else {
      gsap.to(background, {
        filter: 'none',
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }, [scrollProgress, activeSection]);

  // Setup des ScrollTriggers pour les transitions de sections
  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    // Transition vers la section présentation
    ScrollTrigger.create({
      trigger: "#presentation",
      start: "top 80%",
      end: "top 20%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const brightness = 1 - (progress * 0.05);
        gsap.set(background, {
          filter: `brightness(${brightness}) contrast(${1 + progress * 0.1})`
        });
      }
    });

    // Transition vers la section experience
    ScrollTrigger.create({
      trigger: "#experience",
      start: "top 90%",
      end: "top 10%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Transition graduelle vers le mode sombre
        const lightness = Math.max(10, 100 - (progress * 90));
        const saturation = Math.max(0.5, 1 - (progress * 0.5));
        
        gsap.set(background, {
          background: `hsl(0, 0%, ${lightness}%)`,
          filter: `saturate(${saturation}) contrast(${1 + progress * 0.2})`
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger && (
          trigger.trigger.id === 'presentation' ||
          trigger.trigger.id === 'experience'
        )) {
          trigger.kill();
        }
      });
    };
  }, []);

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
      }}
    />
  );
};

export default GlobalBackground;