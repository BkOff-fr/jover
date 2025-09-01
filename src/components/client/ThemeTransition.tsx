'use client'

import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';

interface ThemeTransitionProps {
  isDarkTheme: boolean;
  onTransitionComplete?: () => void;
}

const ThemeTransition: React.FC<ThemeTransitionProps> = ({ 
  isDarkTheme, 
  onTransitionComplete 
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline>();

  // Hook useGSAP pour les bonnes pratiques Next.js
  useGSAP(async () => {
    // Import dynamique de gsap
    const { gsap } = await import('gsap');
    gsap.registerPlugin();
    
    if (!overlayRef.current) return;

    // Créer la timeline une seule fois
    tlRef.current = gsap.timeline({ 
      paused: true,
      onComplete: () => {
        onTransitionComplete?.();
      }
    });

    // Configuration de l'animation subtile et élégante
    tlRef.current
      .set(overlayRef.current, {
        opacity: 0,
        visibility: 'visible'
      })
      .to(overlayRef.current, {
        opacity: 0.25, // Visible mais élégant
        duration: 0.6,
        ease: "power2.inOut"
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut"
      });

  }, { scope: containerRef }); // Importante: scope pour Next.js

  // Effet pour déclencher l'animation quand le thème change
  useEffect(() => {
    if (tlRef.current) {
      tlRef.current.restart();
    }
  }, [isDarkTheme]);

  return (
    <div ref={containerRef}>
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle at center, rgba(30, 185, 0, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 999999,
          visibility: 'hidden',
          opacity: 0,
        }}
      />
    </div>
  );
};

export default ThemeTransition;