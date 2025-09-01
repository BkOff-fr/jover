/**
 * Configuration GSAP pour Next.js
 * Gestion sécurisée des animations pour éviter les problèmes de build
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isBuildMode, isClientMode } from './buildSafeAnimations';

// Enregistrement des plugins seulement côté client
let isRegistered = false;

export const initGSAP = (): boolean => {
  if (isBuildMode() || isRegistered) return isRegistered;
  
  try {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
    
    // Configuration globale pour éviter les problèmes de performance
    gsap.config({
      autoSleep: 60,
      force3D: false,
      nullTargetWarn: false,
    });

    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true,
    });

    return true;
  } catch (error) {
    console.warn('GSAP initialization failed:', error);
    return false;
  }
};

export const cleanupGSAP = (): void => {
  if (isBuildMode()) return;
  
  try {
    ScrollTrigger.killAll();
    gsap.killTweensOf("*");
  } catch (error) {
    console.warn('GSAP cleanup failed:', error);
  }
};

export const createSafeScrollTrigger = (config: ScrollTrigger.Vars): ScrollTrigger | null => {
  if (isBuildMode() || !isRegistered) return null;
  
  try {
    return ScrollTrigger.create(config);
  } catch (error) {
    console.warn('ScrollTrigger creation failed:', error);
    return null;
  }
};

export const safeGsapSet = (target: any, vars: any): void => {
  if (isBuildMode()) return;
  
  try {
    gsap.set(target, vars);
  } catch (error) {
    console.warn('GSAP set failed:', error);
  }
};

export const safeGsapTimeline = (config?: any): gsap.core.Timeline | null => {
  if (isBuildMode()) return null;
  
  try {
    return gsap.timeline(config);
  } catch (error) {
    console.warn('GSAP timeline creation failed:', error);
    return null;
  }
};

export { gsap, ScrollTrigger };