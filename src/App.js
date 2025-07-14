import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

// Import parallax images - reduced set
import image1 from './assets/parallaxe/1.jpg';
import image2 from './assets/parallaxe/2.jpg';
import image3 from './assets/parallaxe/3.jpg';
import image4 from './assets/parallaxe/4.jpg';
import image11 from './assets/parallaxe/11.png';

// Constants for better maintainability
const SCROLL_CONSTANTS = {
  SCROLL_INDICATOR_THRESHOLD: 50,
  THEME_CHANGE_POINT: 0.5,
  GALLERY_PARALLAX_MULTIPLIER: 0.3,
  TRANSITION_MIN_PROGRESS: 0.05,
  TRANSITION_Z_INDEX: {
    DEFAULT: 15,
    ACTIVE_LOW: 50,
    ACTIVE_HIGH: 200
  }
};

// Parallax images configuration
const PARALLAX_CONFIG = [
  { image: image1, speed: 0.5 },
  { image: image2, speed: 0.8 },
  { image: image3, speed: 0.3 },
  { image: image4, speed: 0.6 }
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // Refs for DOM elements to avoid repeated querySelector calls
  const domElementsRef = useRef({});

  // Cache DOM elements on first access
  const getDOMElement = useCallback((id, selector) => {
    if (!domElementsRef.current[id]) {
      domElementsRef.current[id] = document.getElementById(id) || document.querySelector(selector);
    }
    return domElementsRef.current[id];
  }, []);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll indicator management
  const updateScrollIndicator = useCallback((scrollTop) => {
    const scrollIndicator = getDOMElement('scrollIndicator');
    if (scrollIndicator) {
      const isVisible = scrollTop <= SCROLL_CONSTANTS.SCROLL_INDICATOR_THRESHOLD;
      scrollIndicator.classList.toggle('hidden', !isVisible);
    }
  }, [getDOMElement]);

  // Parallax effect for images
  const updateParallaxImages = useCallback((scrollTop) => {
    const parallaxImages = document.querySelectorAll('.parallax-image');
    parallaxImages.forEach(image => {
      const speed = parseFloat(image.getAttribute('data-speed'));
      const yPos = -(scrollTop * speed);
      image.style.transform = `translateY(${yPos}px)`;
    });

    const galleryImages = document.querySelectorAll('.parallax-gallery-image');
    galleryImages.forEach(image => {
      const speed = parseFloat(image.getAttribute('data-speed'));
      const yPos = -(scrollTop * speed * SCROLL_CONSTANTS.GALLERY_PARALLAX_MULTIPLIER);
      image.style.transform = `translateY(${yPos}px)`;
    });
  }, []);

  // Text reveal effect
  const updateTextReveal = useCallback(() => {
    const textSection = getDOMElement('textSection', '.text-section');
    const textContent = getDOMElement('textContent');
    
    if (!textSection || !textContent) return;

    // Initialize words if not already done
    let words = textContent.querySelectorAll('.word');
    if (words.length === 0) {
      const text = textContent.textContent;
      const wordsArray = text.split(' ');
      textContent.innerHTML = wordsArray.map(word => 
        `<span class="word">${word}</span>`
      ).join(' ');
      words = textContent.querySelectorAll('.word');
    }
    
    const textRect = textSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (textRect.top < windowHeight && textRect.bottom > 0) {
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight - textRect.top) / (windowHeight + textRect.height)
      ));
      
      const wordsToReveal = Math.floor(scrollProgress * words.length);
      
      words.forEach((word, index) => {
        word.classList.toggle('active', index < wordsToReveal);
      });
    }
  }, [getDOMElement]);

  // Letters reset helper
  const resetLetters = useCallback((letters) => {
    letters.forEach(letter => {
      letter.style.transform = 'translateY(100px)';
      letter.style.opacity = '0';
    });
  }, []);

  // Transition overlay management
  const updateTransitionOverlay = useCallback((overlay, progress) => {
    if (!overlay) return;
    
    if (progress > 0.9) {
      const overlayOpacity = (progress - 0.9) / 0.1;
      overlay.style.opacity = overlayOpacity;
      overlay.style.display = 'block';
    } else {
      overlay.style.opacity = '0';
      overlay.style.display = 'none';
    }
  }, []);

  // Experience section animation
  const updateExperienceSection = useCallback((scrollTop) => {
    const experienceSection = getDOMElement('experienceSection', '.experience-section');
    const transitionImage = getDOMElement('transitionImage');
    const experienceTitle = getDOMElement('experienceTitle');
    const transitionOverlay = getDOMElement('transitionOverlay');
    
    if (!experienceSection || !transitionImage || !experienceTitle) return;

    const sectionRect = experienceSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const startPoint = windowHeight;
    
    let progress = 0;
    if (sectionRect.top <= startPoint) {
      progress = Math.max(0, Math.min(1, 
        (startPoint - sectionRect.top) / (startPoint - windowHeight * 0.2)
      ));
    }
    
    const letters = experienceTitle.querySelectorAll('.letter');
    
    if (progress > SCROLL_CONSTANTS.TRANSITION_MIN_PROGRESS) {
      // Image animation calculations
      const scale = 1 + (progress * 15);
      const rotation = progress * 45;
      const moveX = progress * window.innerWidth * 0.45;
      const moveY = progress * window.innerHeight * 0.6;
      
      const scaleX = progress > 0.8 ? scale + ((progress - 0.8) * 20) : scale;
      const scaleY = progress > 0.8 ? scale * (1 - (progress - 0.8) * 0.3) : scale;
      
      // Apply transforms
      transitionImage.style.transform = `
        translateY(${-(scrollTop * 0.1) - moveY}px) 
        translateX(${-moveX}px) 
        scaleX(${scaleX}) 
        scaleY(${scaleY})
        rotate(${rotation}deg)
      `;
      
      // Z-index and border radius
      const zIndex = progress > 0.7 ? 
        SCROLL_CONSTANTS.TRANSITION_Z_INDEX.ACTIVE_HIGH : 
        SCROLL_CONSTANTS.TRANSITION_Z_INDEX.ACTIVE_LOW;
      transitionImage.style.zIndex = zIndex;
      transitionImage.style.borderRadius = `${20 - (progress * 20)}px`;
      
      // Overlay management
      updateTransitionOverlay(transitionOverlay, progress);
      
      // Title animation
      if (progress > 0.6) {
        const titleProgress = Math.max(0, Math.min(1, (progress - 0.6) / 0.4));
        
        letters.forEach((letter, index) => {
          const letterIndex = parseInt(letter.getAttribute('data-index'));
          const totalLetters = letters.length;
          
          // Calculate delay based on position
          let delay = 0;
          if (letterIndex === 0 || letterIndex === totalLetters - 1) {
            delay = 0.8; // L and E come last
          } else if (letterIndex === 1 || letterIndex === totalLetters - 2) {
            delay = 0.6; // Second letters
          } else {
            delay = letterIndex / totalLetters * 0.4; // Center letters first
          }
          
          const letterProgress = Math.max(0, Math.min(1, (titleProgress - delay) / (1 - delay)));
          
          if (letterProgress > 0) {
            letter.style.transform = `translateY(${(1 - letterProgress) * 100}px)`;
            letter.style.opacity = letterProgress;
          } else {
            letter.style.transform = 'translateY(100px)';
            letter.style.opacity = '0';
          }
        });
      } else {
        resetLetters(letters);
      }
    } else {
      // Reset state
      transitionImage.style.zIndex = SCROLL_CONSTANTS.TRANSITION_Z_INDEX.DEFAULT;
      transitionImage.style.borderRadius = '0px';
      
      if (transitionOverlay) {
        transitionOverlay.style.opacity = '0';
        transitionOverlay.style.display = 'none';
      }
      
      resetLetters(letters);
    }
  }, [getDOMElement, updateTransitionOverlay, resetLetters]);

  // Main scroll handler
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset;
    
    // Theme change
    const themeChangePoint = window.innerHeight * SCROLL_CONSTANTS.THEME_CHANGE_POINT;
    const isDark = scrollTop > themeChangePoint;
    setIsDarkTheme(current => current !== isDark ? isDark : current);
    
    // Update all scroll-based effects
    updateScrollIndicator(scrollTop);
    updateParallaxImages(scrollTop);
    updateTextReveal();
    updateExperienceSection(scrollTop);
  }, [updateScrollIndicator, updateParallaxImages, updateTextReveal, updateExperienceSection]);

  // Scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Theme management
  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDarkTheme);
    return () => document.body.classList.remove('dark-theme');
  }, [isDarkTheme]);

  // Common image style to avoid repetition
  const imageStyle = { backgroundSize: 'cover', backgroundPosition: 'center' };

  return (
    <div className={`App ${isDarkTheme ? 'dark-theme' : ''}`}>
      {/* Loading Screen */}
      <div className={`loader ${!isLoading ? 'hidden' : ''}`} id="loader">
        <img src={logo} className="loader-logo" alt="logo" />
      </div>

      {/* Header */}
      <header>
        <img src={logo} className="logo" alt="logo" />
        <nav>
          <a href="#accueil">ACCUEIL</a>
          <a href="#experience">L'EXPÉRIENCE</a>
          <a href="#portfolio">PORTFOLIO</a>
          <a href="#contact">CONTACT</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <img src={logo} className="main-logo" alt="logo" />
          
          {/* Scroll Indicator */}
          <div className="scroll-indicator" id="scrollIndicator">
            <div className="scroll-text">SCROLL</div>
            <div className="scroll-arrow"></div>
          </div>
        </section>

        {/* Parallax Images */}
        <div className="parallax-container">
          {PARALLAX_CONFIG.map((config, index) => (
            <div
              key={index}
              className="parallax-image"
              data-speed={config.speed}
              style={{ backgroundImage: `url(${config.image})`, ...imageStyle }}
            />
          ))}
        </div>

        {/* Text Section */}
        <section className="text-section">
          <div className="text-content" id="textContent">
            I'M AN ARTIST KNOWN FOR MY SURREAL AND SENSUAL ARTWORKS. COMBINING PHOTOGRAPHY AND OIL PAINTING, I CREATE PIECES THAT CAPTURE THE BEAUTY AND COMPLEXITY OF THE FEMALE FORM. USING BOTH TRADITIONAL AND DIGITAL TECHNIQUES TO CREATE TIMELESS PIECES THAT EXPLORE THEMES OF PERFECTION AND DESIRE.
          </div>
        </section>

        {/* Images Gallery Section */}
        <section className="images-gallery">
          <div 
            className="parallax-image transition-image" 
            data-speed="0.3" 
            id="transitionImage" 
            style={{ backgroundImage: `url(${image11})`, ...imageStyle }}
          />
        </section>

        {/* Experience Transition Section */}
        <section className="experience-section">
          <div className="transition-overlay" id="transitionOverlay"></div>
          
          <div className="experience-title-container">
            <div className="experience-title" id="experienceTitle">
              {['L', "'", 'E', 'X', 'P', 'É', 'R', 'I', 'E', 'N', 'C', 'E'].map((letter, index) => (
                <span key={index} className="letter" data-index={index}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;