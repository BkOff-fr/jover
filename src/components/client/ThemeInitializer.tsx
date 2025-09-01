"use client";
import { useEffect } from 'react';

const ThemeInitializer = () => {
  useEffect(() => {
    // N'applique plus de thème initial - laisse useScroll gérer entièrement le thème
    // Le thème sera géré uniquement par la position de scroll
    // ThemeInitializer: Désactivé - useScroll gère le thème
  }, []);
  return null;
};

export default ThemeInitializer; 