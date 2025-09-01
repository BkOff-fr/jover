'use client'

import { useEffect, useState, useMemo } from 'react';
import { useAppScroll } from '../../context/AppContext';
import '../../styles/global-background.css';

/**
 * Composant GlobalBackground optimisé pour Next.js
 * Gère les arrière-plans dynamiques selon la section active avec CSS pures
 */
const GlobalBackground: React.FC = () => {
  const { activeSection } = useAppScroll();
  const [mounted, setMounted] = useState(false);

  // Vérification du montage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mise à jour simple des classes CSS pour les transitions thématiques
  useEffect(() => {
    if (!mounted) return;
    
    // Utiliser les classes CSS existantes pour les transitions basiques
    const backgroundElement = document.querySelector('.global-background');
    if (backgroundElement) {
      // Supprimer toutes les classes de section précédentes
      backgroundElement.classList.remove('accueil', 'presentation', 'portfolio', 'contact');
      
      // Ajouter la classe de la section active
      backgroundElement.classList.add(activeSection);
    }
  }, [activeSection, mounted]);

  if (!mounted) return null;

  // Structure simple pour transitions thématiques
  return (
    <div
      className={`global-background ${activeSection}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        willChange: 'background',
      }}
      data-section={activeSection}
    />
  );
};

export default GlobalBackground;