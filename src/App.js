import React, { useEffect, useState, useCallback, useMemo } from 'react';
import logo from './logo.svg';
import './App.css';

// Import parallax images with numbered filenames
import image1 from './assets/parallaxe/1.jpg';
import image2 from './assets/parallaxe/2.jpg';
import image3 from './assets/parallaxe/3.jpg';
import image4 from './assets/parallaxe/4.jpg';
import image5 from './assets/parallaxe/5.jpg';
import image6 from './assets/parallaxe/6.jpg';
import image7 from './assets/parallaxe/7.jpg';
import image8 from './assets/parallaxe/8.jpg';
import image9 from './assets/parallaxe/9.jpg';
import image10 from './assets/parallaxe/10.png';
import image11 from './assets/parallaxe/11.png';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Array of parallax images
  const parallaxImages = useMemo(() => [
    image1,    // Image 1
    image2,    // Image 2
    image3,    // Image 3
    image4,    // Image 4
    image5,    // Image 5
    image6,    // Image 6
    image7,    // Image 7
    image8,    // Image 8
    image9,    // Image 9
    image10,   // Image 10
    image11    // Image 11 (image de transition)
  ], []);

  useEffect(() => {
    // Loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Debug: log images to console to verify they're loaded
  useEffect(() => {
    console.log('Parallax images loaded:', parallaxImages);
  }, [parallaxImages]);

  const updateOnScroll = useCallback(() => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // Hide scroll indicator when scrolling
      const scrollIndicator = document.getElementById('scrollIndicator');
      if (scrollIndicator) {
        if (scrollTop > 50) {
          scrollIndicator.classList.add('hidden');
        } else {
          scrollIndicator.classList.remove('hidden');
        }
      }

      // Parallax effect for original images
      const parallaxImages = document.querySelectorAll('.parallax-image');
      parallaxImages.forEach(image => {
        const speed = parseFloat(image.getAttribute('data-speed'));
        const yPos = -(scrollTop * speed);
        image.style.transform = `translateY(${yPos}px)`;
      });

      // Parallax effect for gallery images
      const galleryImages = document.querySelectorAll('.parallax-gallery-image');
      galleryImages.forEach(image => {
        const speed = parseFloat(image.getAttribute('data-speed'));
        const yPos = -(scrollTop * speed * 0.3);
        image.style.transform = `translateY(${yPos}px)`;
      });

      // Text reveal effect
      const textSection = document.querySelector('.text-section');
      const textContent = document.getElementById('textContent');
      if (textSection && textContent) {
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
        
        // Calculate scroll progress more accurately
        if (textRect.top < windowHeight && textRect.bottom > 0) {
          const elementTop = textRect.top;
          const elementHeight = textRect.height;
          
          // Progress from when element enters viewport to when it leaves
          let scrollProgress = 0;
          if (elementTop <= windowHeight && elementTop + elementHeight >= 0) {
            scrollProgress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight)));
          }
          
          const wordsToReveal = Math.floor(scrollProgress * words.length);
          
          words.forEach((word, index) => {
            if (index < wordsToReveal) {
              word.classList.add('active');
            } else {
              word.classList.remove('active');
            }
          });
        }
      }

      // Experience section - progressive scroll-based animation
      const experienceSection = document.querySelector('.experience-section');
      const transitionImage = document.getElementById('transitionImage');
      const experienceTitle = document.getElementById('experienceTitle');
      const transitionOverlay = document.getElementById('transitionOverlay');
      
      if (experienceSection && transitionImage && experienceTitle) {
        const sectionRect = experienceSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        
        // Start animation when section is 800px below viewport
        const triggerPoint = windowHeight + 800;
        let progress = 0;
        
        if (sectionTop <= triggerPoint) {
          // Progress from 0 when section is 800px below to 1 when section reaches viewport center
          progress = Math.max(0, Math.min(1, (triggerPoint - sectionTop) / (triggerPoint + windowHeight * 0.2)));
        }
        
        // Apply scroll-based transforms
        if (progress > 0) {
          // Image animation: scale and move to center, then expand horizontally
          const scale = 1 + (progress * 15); // Scale from 1 to 16
          const rotation = progress * 45; // Rotate from 0 to 45 degrees
          const moveX = progress * window.innerWidth * 0.45; // Move towards center
          const moveY = progress * window.innerHeight * 0.6; // Move towards center
          
          // At the end, make it horizontal fullscreen
          const scaleX = progress > 0.8 ? scale + ((progress - 0.8) * 20) : scale;
          const scaleY = progress > 0.8 ? scale * (1 - (progress - 0.8) * 0.3) : scale;
          
          transitionImage.style.transform = `
            translateY(${-(scrollTop * 0.1) - moveY}px) 
            translateX(${-moveX}px) 
            scaleX(${scaleX}) 
            scaleY(${scaleY})
            rotate(${rotation}deg)
          `;
          
          transitionImage.style.zIndex = progress > 0.7 ? '200' : '50';
          transitionImage.style.borderRadius = `${20 - (progress * 20)}px`;
          
          // Overlay for gradient transition
          if (transitionOverlay) {
            if (progress > 0.9) {
              const overlayOpacity = (progress - 0.9) / 0.1; // Fade in overlay at the end
              transitionOverlay.style.opacity = overlayOpacity;
              transitionOverlay.style.display = 'block';
            } else {
              transitionOverlay.style.opacity = '0';
              transitionOverlay.style.display = 'none';
            }
          }
          
          // Title animation
          const letters = experienceTitle.querySelectorAll('.letter');
          if (progress > 0.6) {
            const titleProgress = Math.max(0, Math.min(1, (progress - 0.6) / 0.4));
            
            letters.forEach((letter, index) => {
              const letterIndex = parseInt(letter.getAttribute('data-index'));
              const totalLetters = letters.length;
              
              // Letters at extremities (L and E) come last
              let delay = 0;
              if (letterIndex === 0 || letterIndex === totalLetters - 1) {
                delay = 0.8; // L and E come last
              } else if (letterIndex === 1 || letterIndex === totalLetters - 2) {
                delay = 0.6; // Second letters come second to last
              } else {
                delay = letterIndex / totalLetters * 0.4; // Center letters come first
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
            // Reset letters
            letters.forEach(letter => {
              letter.style.transform = 'translateY(100px)';
              letter.style.opacity = '0';
            });
          }
          
        } else {
          // Reset to normal state
          transitionImage.style.transform = `translateY(${-(scrollTop * 0.1)}px) scale(1) rotate(0deg)`;
          transitionImage.style.zIndex = '15';
          transitionImage.style.borderRadius = '20px';
          
          if (transitionOverlay) {
            transitionOverlay.style.opacity = '0';
            transitionOverlay.style.display = 'none';
          }
          
          // Reset letters
          const letters = experienceTitle.querySelectorAll('.letter');
          letters.forEach(letter => {
            letter.style.transform = 'translateY(100px)';
            letter.style.opacity = '0';
          });
        }
      }
  }, []);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset;
    
    // Theme change at 50% scroll
    const themeChangePoint = window.innerHeight * 0.5;
    const isDark = scrollTop > themeChangePoint;
    
    // Update theme state only if changed
    setIsDarkTheme(current => {
      if (current !== isDark) {
        return isDark;
      }
      return current;
    });
    
    updateOnScroll();
  }, [updateOnScroll]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Initial call to set up text and effects
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Separate effect to handle theme changes
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('dark-theme');
    };
  }, [isDarkTheme]);


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
          <div className="parallax-image" data-speed="0.5" style={{backgroundImage: `url(${image1})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          <div className="parallax-image" data-speed="0.8" style={{backgroundImage: `url(${image2})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          <div className="parallax-image" data-speed="0.3" style={{backgroundImage: `url(${image3})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          <div className="parallax-image" data-speed="0.6" style={{backgroundImage: `url(${image4})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          <div className="parallax-image" data-speed="0.4" style={{backgroundImage: `url(${image5})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          <div className="parallax-image" data-speed="0.7" style={{backgroundImage: `url(${image6})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          <div className="parallax-image" data-speed="0.2" style={{backgroundImage: `url(${image7})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
        </div>

        {/* Text Section */}
        <section className="text-section">
          <div className="text-content" id="textContent">
            I'M AN ARTIST KNOWN FOR MY SURREAL AND SENSUAL ARTWORKS. COMBINING PHOTOGRAPHY AND OIL PAINTING, I CREATE PIECES THAT CAPTURE THE BEAUTY AND COMPLEXITY OF THE FEMALE FORM. USING BOTH TRADITIONAL AND DIGITAL TECHNIQUES TO CREATE TIMELESS PIECES THAT EXPLORE THEMES OF PERFECTION AND DESIRE.
          </div>
        </section>

        {/* Images Gallery Section with Parallax */}
        <section className="images-gallery">
          <div className="parallax-gallery-image" data-speed="0.3" style={{backgroundImage: `url(${image8})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          <div className="parallax-gallery-image" data-speed="0.7" style={{backgroundImage: `url(${image9})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          <div className="parallax-gallery-image" data-speed="0.4" style={{backgroundImage: `url(${image10})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          {/* L'image de transition - maintenant plus tôt dans le flux */}
          <div className="parallax-gallery-image transition-image" data-speed="0.1" id="transitionImage" style={{backgroundImage: `url(${image11})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
        </section>

        {/* Experience Transition Section */}
        <section className="experience-section">
          {/* Overlay de transition avec dégradé */}
          <div className="transition-overlay" id="transitionOverlay"></div>
          
          <div className="experience-title-container">
            <div className="experience-title" id="experienceTitle">
              <span className="letter" data-index="0">L</span>
              <span className="letter" data-index="1">'</span>
              <span className="letter" data-index="2">E</span>
              <span className="letter" data-index="3">X</span>
              <span className="letter" data-index="4">P</span>
              <span className="letter" data-index="5">É</span>
              <span className="letter" data-index="6">R</span>
              <span className="letter" data-index="7">I</span>
              <span className="letter" data-index="8">E</span>
              <span className="letter" data-index="9">N</span>
              <span className="letter" data-index="10">C</span>
              <span className="letter" data-index="11">E</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
