'use client'

import { useState, useEffect, useCallback, useRef } from 'react';

// Types
interface MousePosition {
  x: number;
  y: number;
}

interface MouseHookReturn {
  mousePosition: MousePosition;
  screenPosition: MousePosition;
}

/**
 * Hook personnalisé pour le tracking de la souris
 * Gère la position de la souris et les propriétés CSS custom
 * Adapté pour Next.js avec vérifications SSR
 */
export const useMouse = (): MouseHookReturn => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 50, y: 50 });
  const throttleRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setMounted(true);

    // Fonction throttlée pour optimiser les performances
    const handleMouseMove = (e: MouseEvent): void => {
      if (throttleRef.current) return;

      throttleRef.current = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        setMousePosition({ x, y });
        
        // Mise à jour des propriétés CSS custom pour les effets d'éclairage
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        
        throttleRef.current = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current);
        throttleRef.current = null;
      }
    };
  }, []);

  // Valeurs par défaut pour SSR
  if (!mounted) {
    return {
      mousePosition: { x: 50, y: 50 },
      screenPosition: { x: 50, y: 50 }
    };
  }

  return {
    mousePosition,
    screenPosition: {
      x: (mousePosition.x / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      y: (mousePosition.y / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1080),
    }
  };
};

export default useMouse;