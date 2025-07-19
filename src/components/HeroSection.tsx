import React, { useState, useEffect, useRef, useCallback } from 'react';
import logo from '../logo.svg';
import { SCROLL_CONFIG } from '../utils/constants';

interface HeroSectionProps {
  id: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ id }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = useCallback((): void => {
    const scrollTop = window.pageYOffset;
    const indicator = scrollIndicatorRef.current;
    if (!indicator) return;
    const isVisible = scrollTop <= SCROLL_CONFIG.INDICATOR_THRESHOLD;
    indicator.classList.toggle('hidden', !isVisible);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <div className={`loader ${!isLoading ? 'hidden' : ''}`} id="loader">
        <img src={logo} className="loader-logo" alt="Jover logo" />
      </div>
      <section id={id} className="hero-section">
        <h1 className="visually-hidden">Jover Portfolio</h1>
        
        
        <img src={logo} className="main-logo" alt="Jover logo" />
        <div className="scroll-indicator" ref={scrollIndicatorRef}>
          <div className="scroll-text">SCROLL</div>
          <div className="scroll-arrow"></div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;