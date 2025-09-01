'use client'
import React, { useEffect, useRef, useState } from 'react';
import '../../styles/cursor.css';

/**
 * CustomCursor - Curseur Sony Camera style
 * Adapté de l'original pour Next.js avec optimisations performance
 */
const CustomCursor: React.FC = () => {
  const crosshairRef = useRef<HTMLDivElement | null>(null);
  const rectangleRef = useRef<HTMLDivElement | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Mount check pour SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation principale - identique à l'original
  useEffect(() => {
    if (!mounted) return;
    
    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;
    let rectX = 0;
    let rectY = 0;
    const smoothness = 0.1;

    const updateCursorPosition = (e: MouseEvent): void => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Initialiser la position du rectangle au premier mouvement
      if (rectX === 0 && rectY === 0) {
        rectX = mouseX;
        rectY = mouseY;
      }
    };

    const animateCursor = (): void => {
      // Rectangle principal - suit avec délai (toujours visible)
      if (rectangleRef.current) {
        rectX += (mouseX - rectX) * smoothness;
        rectY += (mouseY - rectY) * smoothness;
        
        rectangleRef.current.style.left = `${rectX}px`;
        rectangleRef.current.style.top = `${rectY}px`;
        rectangleRef.current.style.opacity = '1';
      }
      
      // Petite croix - suit exactement la souris mais MASQUÉE par défaut
      if (crosshairRef.current) {
        crosshairRef.current.style.left = `${mouseX}px`;
        crosshairRef.current.style.top = `${mouseY}px`;
        // Masquée par défaut, visible seulement au clic
        if (!isFlashing) {
          crosshairRef.current.style.opacity = '0';
        }
      }
      
      animationId = requestAnimationFrame(animateCursor);
    };

    const hideCursor = (): void => {
      if (crosshairRef.current) {
        crosshairRef.current.style.opacity = '0';
      }
      if (rectangleRef.current) {
        rectangleRef.current.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseleave', hideCursor);
    
    animationId = requestAnimationFrame(animateCursor);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseleave', hideCursor);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mounted]);

  // Gestion des interactions - identique à l'original
  useEffect(() => {
    if (!mounted) return;
    
    const handleMouseEnter = (): void => {
      crosshairRef.current?.classList.add('hover');
      rectangleRef.current?.classList.add('hover');
    };

    const handleMouseLeave = (): void => {
      crosshairRef.current?.classList.remove('hover');
      rectangleRef.current?.classList.remove('hover');
    };

    const handleClick = (): void => {
      // Afficher la petite croix au clic avec flash
      setIsFlashing(true);
      
      if (crosshairRef.current) {
        crosshairRef.current.style.opacity = '1';
        crosshairRef.current.classList.add('flashing');
        
        setTimeout(() => {
          if (crosshairRef.current) {
            crosshairRef.current.classList.remove('flashing');
          }
          setIsFlashing(false);
        }, 150);
      }
    };

    const interactiveElements = document.querySelectorAll<HTMLElement>('a, button, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('click', handleClick);

    return () => {
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      document.removeEventListener('click', handleClick);
    };
  }, [mounted]);

  // Masquer sur appareils tactiles
  useEffect(() => {
    if (!mounted) return;
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      console.log('🚫 Touch device detected - hiding custom cursor');
      return;
    }
    console.log('✅ Desktop detected - custom cursor enabled');
  }, [mounted]);

  if (!mounted) return null;

  // Vérification pour touch devices
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isTouchDevice) return null;

  return (
    <>
      {/* Petite croix - suit exactement la souris, visible seulement au clic */}
      <div 
        ref={crosshairRef}
        className={`cursor-crosshair ${isFlashing ? 'flashing' : ''}`}
        style={{
          position: 'fixed',
          width: '12px',
          height: '12px',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          willChange: 'left, top, opacity',
        }}
      />
      
      {/* Rectangle principal - suit avec délai, toujours visible */}
      <div 
        ref={rectangleRef}
        className="cursor-rectangle"
        style={{
          position: 'fixed',
          width: '50px',
          height: '30px',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          willChange: 'left, top, opacity',
        }}
      />
    </>
  );
};

export default CustomCursor;