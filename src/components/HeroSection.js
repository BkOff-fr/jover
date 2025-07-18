import React, { useState, useEffect, useRef, useCallback } from 'react';
import logo from '../logo.svg';
import { SCROLL_CONFIG } from '../utils/constants';

const HeroSection = ({ id }) => {
  const [isLoading, setIsLoading] = useState(true);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = useCallback(() => {
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
