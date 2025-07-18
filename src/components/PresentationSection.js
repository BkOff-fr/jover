import React, { useRef, useEffect, useCallback } from 'react';
import image1 from '../assets/parallaxe/1.jpg';
import image2 from '../assets/parallaxe/2.jpg';
import image3 from '../assets/parallaxe/3.jpg';
import image4 from '../assets/parallaxe/4.jpg';

const PresentationSection = ({ id, scrollManagerRef }) => {
  const mainImageRef = useRef(null);
  const additionalImagesRef = useRef([]);
  const textContentRef = useRef(null);
  const sectionRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollVelocity = useRef(0);



  const animatePresentation = useCallback((scrollTop, windowHeight) => {
    const section = sectionRef.current;
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const textContent = textContentRef.current;
    
    // Calculer la vélocité de scroll
    scrollVelocity.current = scrollTop - lastScrollTop.current;
    lastScrollTop.current = scrollTop;
    
    // Calculer la position de référence basée sur le texte
    const textRect = textContent ? textContent.getBoundingClientRect() : null;
    const textOffset = textRect ? textRect.top : sectionTop;
    
    // Animate main image parallax - mouvement pendant scroll
    const mainImage = mainImageRef.current;
    if (mainImage) {
      const parallaxSpeed = 0.03;
      const baseOffset = scrollTop * parallaxSpeed;
      const textAlignment = (textOffset - windowHeight * 0.5) * -0.02;
      const currentTransform = 30 + (-baseOffset + textAlignment);
      
      // Pendant le scroll - pas de transition
      mainImage.style.transition = 'none';
      mainImage.style.transform = `translateY(${currentTransform}vh)`;
      
      // Stocker la position actuelle et vélocité
      mainImage.setAttribute('data-current-y', currentTransform);
      mainImage.setAttribute('data-velocity', scrollVelocity.current * parallaxSpeed);
    }

    // Animate text reveal - fade in/out lettre par lettre avec easing polynomial - timing optimal
    if (textContent && sectionTop < windowHeight * 0.5) {
      let letters = textContent.querySelectorAll('.letter');
      if (letters.length === 0) {
        const text = textContent.textContent;
        const lettersArray = text.split('');
        textContent.innerHTML = lettersArray
          .map((char, index) => {
            if (char === ' ') {
              return ' ';
            } else {
              return `<span class="letter">${char}</span>`;
            }
          })
          .join('');
        letters = textContent.querySelectorAll('.letter');
      }

      const linearProgress = Math.max(0, Math.min(1, 
        (windowHeight * 0.5 - sectionTop) / (windowHeight * 1.5)
      ));
      
      // Easing polynomial pour fadeout naturel (ease-out cubic)
      const textProgress = linearProgress < 0.5 
        ? 4 * linearProgress * linearProgress * linearProgress
        : 1 - Math.pow(-2 * linearProgress + 2, 3) / 2;
      
      const lettersToReveal = Math.floor(textProgress * letters.length);
      
      // Stocker la progression actuelle
      textContent.setAttribute('data-current-progress', textProgress);
      textContent.setAttribute('data-letters-count', letters.length);
      
      letters.forEach((letter, index) => {
        const isActive = index < lettersToReveal;
        letter.classList.toggle('active', isActive);
        
        // Transition de couleur rapide par lettre (50ms)
        letter.style.transition = 'color 50ms ease, opacity 50ms ease';
      });
      
      // Stocker la vélocité de révélation des lettres
      textContent.setAttribute('data-text-velocity', (textProgress - (parseFloat(textContent.getAttribute('data-last-progress')) || 0)) * letters.length);
      textContent.setAttribute('data-last-progress', textProgress);
    }

    // Animate additional images - SEULEMENT parallax, PAS de fade
    additionalImagesRef.current.forEach((image, index) => {
      if (!image) return;
      
      // Toujours visible - pas de fade in/out
      image.classList.add('visible');
      
      // Parallax effect avec transition sur arrêt de scroll
      const parallaxSpeed = 0.1 + (index * 0.02);
      const baseOffset = scrollTop * parallaxSpeed;
      const textAlignment = textRect ? (textRect.top - windowHeight * 0.5) * 0.05 : 0;
      
      // Pendant le scroll - pas de transition
      image.style.transition = 'none';
      const currentTransform = -baseOffset + textAlignment;
      image.style.transform = `translateY(${currentTransform}px)`;
      
      // Stocker la position actuelle et vélocité
      image.setAttribute('data-current-y', currentTransform);
      image.setAttribute('data-velocity', scrollVelocity.current * parallaxSpeed);
    });
    
    // Quand le scroll s'arrête - continuer le mouvement avec ralentissement
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      // Continuer le mouvement de l'image principale
      const mainImage = mainImageRef.current;
      if (mainImage) {
        const currentY = parseFloat(mainImage.getAttribute('data-current-y')) || 0;
        const velocity = parseFloat(mainImage.getAttribute('data-velocity')) || 0;
        const targetY = currentY + velocity * 20; // Amplifier la continuation
        
        mainImage.style.transition = 'transform 1s cubic-bezier(0.02, 0.4, 0.05, 1)';
        mainImage.style.transform = `translateY(${targetY}vh)`;
      }
      
      // Continuer le mouvement des images additionnelles
      additionalImagesRef.current.forEach(image => {
        if (!image) return;
        
        const currentY = parseFloat(image.getAttribute('data-current-y')) || 0;
        const velocity = parseFloat(image.getAttribute('data-velocity')) || 0;
        const targetY = currentY + velocity * 20;
        
        image.style.transition = 'transform 1s cubic-bezier(0.02, 0.4, 0.05, 1)';
        image.style.transform = `translateY(${targetY}px)`;
      });
      
      // Continuer la révélation du texte
      const textContent = textContentRef.current;
      if (textContent) {
        const textVelocity = parseFloat(textContent.getAttribute('data-text-velocity')) || 0;
        const currentProgress = parseFloat(textContent.getAttribute('data-current-progress')) || 0;
        const letters = textContent.querySelectorAll('.letter');
        
        if (textVelocity > 0 && currentProgress < 1) {
          const additionalLetters = Math.min(Math.floor(textVelocity * 5), letters.length - Math.floor(currentProgress * letters.length));
          
          for (let i = 0; i < additionalLetters; i++) {
            const letterIndex = Math.floor(currentProgress * letters.length) + i;
            if (letterIndex < letters.length) {
              setTimeout(() => {
                letters[letterIndex].style.transition = 'color 1s cubic-bezier(0.02, 0.4, 0.05, 1), opacity 1s cubic-bezier(0.02, 0.4, 0.05, 1)';
                letters[letterIndex].classList.add('active');
              }, i * 200); // Délai progressif
            }
          }
        }
      }
    }, 100);
  }, []);

  useEffect(() => {
    // Sauvegarder les références au début du useEffect
    const additionalImages = additionalImagesRef.current;
    const textContent = textContentRef.current;
    
    // Appeler directement la fonction au scroll
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      animatePresentation(scrollTop, windowHeight);
    };
    
    // Ajouter le listener de scroll
    window.addEventListener('scroll', handleScroll);
    
    // Appel initial
    handleScroll();

    return () => {
      // Nettoyer les timeouts
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      additionalImages.forEach(image => {
        if (image && image.scrollTimeout) {
          clearTimeout(image.scrollTimeout);
        }
      });
      
      // Nettoyer timeout texte
      if (textContent && textContent.scrollTimeout) {
        clearTimeout(textContent.scrollTimeout);
      }
      
      // Nettoyer le listener
      window.removeEventListener('scroll', handleScroll);
    };
  }, [animatePresentation]);

  return (
    <section id={id} className="presentation-section" ref={sectionRef}>
      {/* Contenu principal : image + texte */}
      <div className="presentation-content">
        <div 
          className="main-image"
          ref={mainImageRef}
          style={{ backgroundImage: `url(${image1})` }}
        />
        
        <div className="text-section">
          <div className="text-wrapper">
            <h2 className="presentation-title">Photographe Professionnel à Lille</h2>
            <div className="presentation-location">
              <span className="location-text">Interventions dans toute la France</span>
            </div>
            <div className="text-content" ref={textContentRef}>
              I'M AN ARTIST KNOWN FOR MY SURREAL AND SENSUAL ARTWORKS. COMBINING PHOTOGRAPHY AND OIL PAINTING, I CREATE PIECES THAT CAPTURE THE BEAUTY AND COMPLEXITY OF THE FEMALE FORM. USING BOTH TRADITIONAL AND DIGITAL TECHNIQUES TO CREATE TIMELESS PIECES THAT EXPLORE THEMES OF PERFECTION AND DESIRE.
            </div>
          </div>
        </div>
      </div>

      {/* Images additionnelles en dessous */}
      <div className="additional-images">
        <div 
          className="additional-image"
          ref={el => additionalImagesRef.current[0] = el}
          style={{ backgroundImage: `url(${image2})` }}
        />
        <div 
          className="additional-image"
          ref={el => additionalImagesRef.current[1] = el}
          style={{ backgroundImage: `url(${image3})` }}
        />
        <div 
          className="additional-image"
          ref={el => additionalImagesRef.current[2] = el}
          style={{ backgroundImage: `url(${image4})` }}
        />
      </div>
    </section>
  );
};

export default PresentationSection;