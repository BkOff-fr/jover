import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonSectionProps } from '../types/components';
import BackgroundImage from './BackgroundImage';
import image1 from '../assets/parallaxe/1.jpg';
import image2 from '../assets/parallaxe/2.jpg';
import image3 from '../assets/parallaxe/3.jpg';
import image4 from '../assets/parallaxe/4.jpg';

gsap.registerPlugin(ScrollTrigger);

const PresentationSection: React.FC<CommonSectionProps> = ({ id, scrollManagerRef }) => {
  const mainImageRef = useRef<HTMLDivElement | null>(null);
  const additionalImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textContentRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const animationRefs = useRef<gsap.core.Timeline[]>([]);

  // Memoized images array
  const images = useMemo(() => [image1, image2, image3, image4], []);
  
  // Images importées et prêtes
  
  // Direct image for main background
  const mainBackgroundImage = `url(${images[0] || image1})`;

  // Animation avec GSAP au lieu de DOM manipulation directe
  const animatePresentation = useCallback(() => {
    const section = sectionRef.current;
    const mainImage = mainImageRef.current;
    const textContent = textContentRef.current;
    
    if (!section || !mainImage || !textContent) return;

    // Nettoyer les anciennes animations
    animationRefs.current.forEach(animation => animation.kill());
    animationRefs.current = [];

    // Animation de l'image principale avec parallaxe
    const mainImageTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const parallaxY = -30 + (progress * 60);
        
        gsap.set(mainImage, {
          yPercent: parallaxY,
          scale: 1.1 - (progress * 0.1),
          filter: `brightness(${0.8 + progress * 0.2})`
        });
      }
    });

    // Animation du texte révélation lettre par lettre
    const textTrigger = ScrollTrigger.create({
      trigger: textContent,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Créer les spans pour les lettres si nécessaire
        if (!textContent.querySelector('.letter')) {
          const text = textContent.textContent || '';
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
        }

        const letters = textContent.querySelectorAll('.letter');
        const lettersToReveal = Math.floor(progress * letters.length);
        
        letters.forEach((letter, index) => {
          const isActive = index < lettersToReveal;
          const letterElement = letter as HTMLElement;
          
          if (isActive) {
            letterElement.classList.add('active');
          } else {
            letterElement.classList.remove('active');
          }
          
          gsap.set(letterElement, {
            opacity: isActive ? 1 : 0.3
          });
        });
      }
    });

    // Animation des images additionnelles
    additionalImagesRef.current.forEach((image, index) => {
      if (!image) return;

      const imageTrigger = ScrollTrigger.create({
        trigger: image,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const parallaxSpeed = 0.1 + (index * 0.02);
          const parallaxY = -progress * 100 * parallaxSpeed;
          
          gsap.set(image, {
            yPercent: parallaxY,
            opacity: 1,
            scale: 1 + (progress * 0.05)
          });
        }
      });

      animationRefs.current.push(imageTrigger as any);
    });

    // Stocker les triggers pour cleanup
    animationRefs.current.push(mainImageTrigger as any, textTrigger as any);

  }, []);

  // Setup initial et cleanup
  useEffect(() => {
    // Délai pour s'assurer que les refs sont disponibles
    const timeoutId = setTimeout(() => {
      animatePresentation();
    }, 100);

    // Capturer la référence pour le cleanup
    const section = sectionRef.current;

    return () => {
      clearTimeout(timeoutId);
      
      // Nettoyer toutes les animations GSAP
      animationRefs.current.forEach(animation => {
        if (animation && typeof animation.kill === 'function') {
          animation.kill();
        }
      });
      animationRefs.current = [];

      // Nettoyer tous les ScrollTriggers de cette section
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section || 
            (trigger.trigger && section?.contains(trigger.trigger as Node))) {
          trigger.kill();
        }
      });
    };
  }, [animatePresentation]);

  return (
    <section id={id} className="presentation-section" ref={sectionRef}>
      {/* Contenu principal : image + texte */}
      <div className="presentation-content">
        <div 
          className="main-image optimized-image-container background-image"
          ref={mainImageRef}
          style={{ backgroundImage: mainBackgroundImage }}
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
        {images.slice(1).map((image, index) => (
          <BackgroundImage
            key={index}
            src={image}
            alt={`Image ${index + 2} - Portfolio photographique`}
            className="additional-image"
            ref={el => { additionalImagesRef.current[index] = el; }}
          />
        ))}
      </div>
    </section>
  );
};

export default PresentationSection;