'use client'

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { initGSAP, createSafeScrollTrigger, cleanupGSAP, safeGsapSet } from '../utils/gsapConfig';
import { isBuildMode } from '../utils/buildSafeAnimations';
import '../styles/hero-presentation.css';

interface PresentationSectionProps {
  id?: string;
  scrollManagerRef?: React.RefObject<HTMLElement>;
}

const PresentationSection: React.FC<PresentationSectionProps> = ({ id = "presentation", scrollManagerRef }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const additionalImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const animationRefs = useRef<gsap.core.Timeline[]>([]);

  // Images for parallax effect
  const parallaxImages = useMemo(() => [
    '/images/parallax/1.jpg',
    '/images/parallax/2.jpg',
    '/images/portfolio/project-2.jpg'
  ], []);

  // Animation with GSAP
  const animatePresentation = useCallback(async () => {
    if (isBuildMode()) return;

    // Import dynamique de gsap et ScrollTrigger
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);

    const gsapReady = initGSAP();
    if (!gsapReady) return;
    
    const section = sectionRef.current;
    const mainImage = mainImageRef.current;
    const textContent = textContentRef.current;
    
    if (!section || !mainImage || !textContent) return;

    // Clear previous animations
    animationRefs.current.forEach(animation => animation.kill());
    animationRefs.current = [];

    // Main image parallax animation
    const mainImageTrigger = createSafeScrollTrigger({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const parallaxY = -30 + (progress * 60);
        
        safeGsapSet(mainImage, {
          yPercent: parallaxY,
          scale: 1.1 - (progress * 0.1),
          filter: `brightness(${0.8 + progress * 0.2})`
        });
      }
    });

    // Text reveal animation
    const textTrigger = createSafeScrollTrigger({
      trigger: textContent,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Create letter spans if needed
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
          
          safeGsapSet(letterElement, {
            opacity: isActive ? 1 : 0.3
          });
        });
      }
    });

    // Additional images parallax
    additionalImagesRef.current.forEach((image, index) => {
      if (!image) return;

      const parallaxSpeeds = [0.1, 0.2, 0.3];
      const parallaxSpeed = parallaxSpeeds[index] || 0.1;

      const imageTrigger = createSafeScrollTrigger({
        trigger: image,
        start: "top bottom",
        end: "bottom top", 
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const parallaxY = -progress * 100 * parallaxSpeed;

          safeGsapSet(image, {
            yPercent: parallaxY,
            opacity: 1,
            scale: 1 + (progress * 0.05)
          });
        }
      });

      animationRefs.current.push(imageTrigger as any);
    });

    if (mainImageTrigger) animationRefs.current.push(mainImageTrigger as any);
    if (textTrigger) animationRefs.current.push(textTrigger as any);
  }, []);

  // Setup animations
  useEffect(() => {
    if (isBuildMode()) return;
    
    const timeoutId = setTimeout(() => {
      animatePresentation();
    }, 100);

    const section = sectionRef.current;

    return () => {
      clearTimeout(timeoutId);
      
      // Clean up animations
      animationRefs.current.forEach(animation => {
        if (animation && typeof animation.kill === 'function') {
          animation.kill();
        }
      });
      animationRefs.current = [];

      // Clean up GSAP
      cleanupGSAP();
    };
  }, [animatePresentation]);

  return (
    <section id={id} ref={scrollManagerRef || sectionRef} className="presentation-section">
      <div className="presentation-content">
        <div className="main-image" ref={mainImageRef}>
          <Image
            src="/images/presentation-main.jpg"
            alt="Jover - Photographe Professionnel"
            fill
            style={{ objectFit: 'cover', objectPosition: 'bottom' }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIABgAGAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQSITEFQVFhEyJxgQYUkbFCobHB0fAjM+EV4f/aAAwDAQACEQMRAD8A9/ooooAKKKKAP//Z"
          />
        </div>
        
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

      {/* Additional parallax images */}
      <div className="additional-images">
        {parallaxImages.map((imageSrc, index) => (
          <div
            key={index}
            className="additional-image"
            ref={el => { additionalImagesRef.current[index] = el; }}
            style={{
              position: 'relative',
              width: '300px',
              height: '400px',
              margin: '50px 0',
              overflow: 'hidden',
              float: index === 0 ? 'left' : index === 2 ? 'right' : 'none',
              marginLeft: index === 1 ? 'auto' : undefined,
              marginRight: index === 1 ? 'auto' : undefined,
              clear: 'both',
            }}
          >
            <Image
              src={imageSrc}
              alt={`Additional image ${index + 1}`}
              width={300}
              height={400}
              style={{ objectFit: 'cover' }}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIABgAGAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQSITEFQVFhEyJxgQYUkbFCobHB0fAjM+EV4f/aAAwDAQACEQMRAD8A9/ooooAKKKKAP//Z"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .presentation-section {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--section-padding);
        }

        .presentation-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--spacing-xl);
          gap: var(--spacing-xxxl);
        }

        .main-image {
          flex: 1;
          height: 80vh;
          position: relative;
          aspect-ratio: 9/10;
          overflow: hidden;
          border-radius: 0;
          contain: layout style paint;
        }

        .text-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
        }

        .text-wrapper {
          max-width: 600px;
          text-align: left;
        }

        .presentation-title {
          color: var(--h2-color);
          margin-bottom: var(--spacing-lg);
          line-height: 1.2;
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        .presentation-location {
          margin-bottom: var(--spacing-xxl);
        }

        .location-text {
          color: var(--color-text-secondary);
          font-size: var(--type-small);
          font-weight: var(--font-weight-normal);
          letter-spacing: var(--letter-spacing-normal);
          text-transform: uppercase;
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        .text-content {
          color: var(--p-color);
          font-size: var(--type-body);
          line-height: 1.6;
          letter-spacing: 0.1em;
          font-weight: var(--font-weight-normal);
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        .text-content p {
          margin-bottom: var(--spacing-lg);
        }

        @media (max-width: 1024px) {
          .presentation-content {
            flex-direction: column;
            gap: var(--spacing-xxl);
          }
          
          .main-image {
            height: 60vh;
            width: 100%;
          }
          
          .text-section {
            min-height: auto;
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .presentation-section {
            padding: var(--section-padding-mobile);
          }
          
          .presentation-content {
            padding: 0;
          }
          
          .text-wrapper {
            max-width: 100%;
          }
          
          .main-image {
            height: 50vh;
          }
        }

        @media (max-width: 480px) {
          .presentation-section {
            padding: var(--section-padding-small);
          }
          
          .presentation-content {
            padding: 0 var(--spacing-md);
          }
          
          .main-image {
            height: 40vh;
          }
        }
      `}</style>
    </section>
  );
};

export default PresentationSection;