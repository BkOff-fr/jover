/**
 * Build-Safe Animation System
 * Prevents infinite loops during Next.js build process
 */

// Detection du mode build
export const isBuildMode = (): boolean => {
  // Simple SSR detection for Next.js
  return typeof window === 'undefined';
};

// Detection du mode client
export const isClientMode = (): boolean => {
  return !isBuildMode() && 
         typeof window !== 'undefined' && 
         typeof document !== 'undefined' &&
         document.readyState !== 'loading';
};

// Wrapper sécurisé pour requestAnimationFrame
export const safeRequestAnimationFrame = (callback: FrameRequestCallback): number | null => {
  if (isBuildMode()) return null;
  
  try {
    return requestAnimationFrame(callback);
  } catch (error) {
    console.warn('RequestAnimationFrame failed:', error);
    return null;
  }
};

// Wrapper sécurisé pour cancelAnimationFrame
export const safeCancelAnimationFrame = (id: number | null): void => {
  if (isBuildMode() || id === null) return;
  
  try {
    cancelAnimationFrame(id);
  } catch (error) {
    console.warn('CancelAnimationFrame failed:', error);
  }
};

// Gestionnaire de boucles d'animation sécurisé
export class SafeAnimationLoop {
  private animationId: number | null = null;
  private isRunning: boolean = false;
  private callback: FrameRequestCallback;

  constructor(callback: FrameRequestCallback) {
    this.callback = callback;
  }

  start(): void {
    if (isBuildMode() || this.isRunning) return;

    this.isRunning = true;
    const loop = (time: number) => {
      if (!this.isRunning || isBuildMode()) return;

      this.callback(time);
      this.animationId = safeRequestAnimationFrame(loop);
    };

    this.animationId = safeRequestAnimationFrame(loop);
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      safeCancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  isActive(): boolean {
    return this.isRunning && !isBuildMode();
  }
}

// Hook React pour les animations sécurisées
export const useSafeAnimation = () => {
  return {
    isBuildMode: isBuildMode(),
    isClientMode: isClientMode(),
    requestAnimationFrame: safeRequestAnimationFrame,
    cancelAnimationFrame: safeCancelAnimationFrame,
    SafeAnimationLoop,
  };
};