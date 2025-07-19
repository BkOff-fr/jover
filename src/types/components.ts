import { RefObject } from 'react';

// Types communs pour les composants
export interface CommonSectionProps {
  id: string;
  scrollManagerRef?: RefObject<any>;
}

// Types pour les projets portfolio
export interface PortfolioProject {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  year: number;
  tags: string[];
  client?: string;
  location?: string;
  equipment?: string;
}

// Types pour les animations
export interface AnimationOptions {
  duration?: number;
  delay?: number;
  ease?: string;
}

// Types pour les effects d'image
export type ImageEffect = 'glitch' | 'distortion' | 'chromatic' | 'prism';

// Types pour les stories dans ExperienceSection
export interface StoryStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  position: 'left' | 'right' | 'center';
  effect: ImageEffect;
}

// Types pour les filtres portfolio
export type PortfolioFilter = 'all' | 'portrait' | 'mariage' | 'evenement' | 'corporate' | 'mode' | 'produit';

export interface FilterOption {
  id: PortfolioFilter;
  label: string;
  count: number;
}