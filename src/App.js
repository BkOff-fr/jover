import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ParallaxGallery from './components/ParallaxGallery';
import ExperienceSection from './components/ExperienceSection';
import { SCROLL_CONSTANTS } from './utils/constants';

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const transitionImageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const themeChangePoint = window.innerHeight * SCROLL_CONSTANTS.THEME_CHANGE_POINT;
      const isDark = scrollTop > themeChangePoint;
      setIsDarkTheme(current => (current !== isDark ? isDark : current));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDarkTheme);
    return () => document.body.classList.remove('dark-theme');
  }, [isDarkTheme]);

  return (
    <div className={`App ${isDarkTheme ? 'dark-theme' : ''}`}>
      <Header />
      <main className="main-content">
        <HeroSection />
        <ParallaxGallery transitionImageRef={transitionImageRef} />
        <ExperienceSection transitionImageRef={transitionImageRef} />
        <section id="contact" className="contact-section">
          <h2>Contact</h2>
        </section>
      </main>
    </div>
  );
}

export default App;
