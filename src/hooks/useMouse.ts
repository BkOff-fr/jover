import { useState, useEffect } from 'react';

// Types for mouse position
interface MousePosition {
  x: number;
  y: number;
}

// Return type for useMouse hook
interface MouseHookReturn {
  mousePosition: MousePosition;
  screenPosition: MousePosition;
}

/**
 * Hook personnalisé pour le tracking de la souris
 * Gère la position de la souris et les propriétés CSS custom
 */
export const useMouse = (): MouseHookReturn => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      setMousePosition({ x, y });
      
      // Mise à jour des propriétés CSS custom pour les effets d'éclairage
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return {
    mousePosition,
    screenPosition: {
      x: (mousePosition.x / 100) * window.innerWidth,
      y: (mousePosition.y / 100) * window.innerHeight,
    }
  };
};

// Export types for use in other files
export type { MousePosition, MouseHookReturn };