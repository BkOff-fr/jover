import React, { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppMouse } from '../context/AppContext';
import { CommonSectionProps, StoryStep, ImageEffect } from '../types/components';
import image1 from '../assets/parallaxe/1.jpg';
import image2 from '../assets/parallaxe/2.jpg';
import image3 from '../assets/parallaxe/3.jpg';
import image4 from '../assets/parallaxe/4.jpg';

gsap.registerPlugin(ScrollTrigger);

const ExperienceSection: React.FC<CommonSectionProps> = ({ id, scrollManagerRef }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroImageRef = useRef<HTMLDivElement | null>(null);
  const storyElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { mousePosition } = useAppMouse();
  
  // Image héro optimisée avec le système BackgroundImage

  // Données de storytelling par étapes (memoized pour éviter les re-renders)
  const storySteps = useMemo<StoryStep[]>(() => [
    {
      id: 1,
      title: "LE PREMIER REGARD",
      subtitle: "Capturer l'émotion brute",
      description: "Chaque séance commence par ce moment magique où le regard révèle l'âme. C'est dans cette fraction de seconde que naît l'authenticité.",
      image: image1,
      position: "left",
      effect: "glitch"
    },
    {
      id: 2,
      title: "LA COMPOSITION",
      subtitle: "Sculpter la lumière",
      description: "L'art de la photographie réside dans l'équilibre parfait entre ombre et lumière, créant une harmonie visuelle qui transcende le réel.",
      image: image2,
      position: "right",
      effect: "distortion"
    },
    {
      id: 3,
      title: "L'INSTANT DÉCISIF",
      subtitle: "Saisir l'éphémère",
      description: "Ce moment unique où tous les éléments s'alignent. Technique, émotion et vision artistique fusionnent pour créer l'image parfaite.",
      image: image3,
      position: "center",
      effect: "chromatic"
    },
    {
      id: 4,
      title: "LA RÉVÉLATION",
      subtitle: "Donner vie à l'image",
      description: "Le post-traitement est un art à part entière. Chaque retouche révèle une nouvelle dimension, transformant la photographie en œuvre d'art.",
      image: image4,
      position: "left",
      effect: "prism"
    }
  ], []);

  // Effets visuels par type
  const applyImageEffect = (element: HTMLElement, effect: ImageEffect, progress: number): void => {
    const intensity = Math.sin(progress * Math.PI) * 0.5 + 0.5;
    
    switch (effect) {
      case 'glitch':
        gsap.set(element, {
          filter: `contrast(${1 + intensity * 0.5}) saturate(${1 + intensity}) hue-rotate(${intensity * 10}deg)`,
          x: intensity * 2 * Math.sin(Date.now() * 0.01),
        });
        break;
        
      case 'distortion':
        gsap.set(element, {
          filter: `blur(${intensity * 0.5}px) contrast(${1 + intensity * 0.3})`,
          scaleY: 1 + intensity * 0.1,
          skewX: intensity * 2
        });
        break;
        
      case 'chromatic':
        gsap.set(element, {
          filter: `sepia(${intensity * 0.3}) hue-rotate(${intensity * 45}deg) saturate(${1 + intensity})`,
        });
        break;
        
      case 'prism':
        gsap.set(element, {
          filter: `contrast(${1 + intensity * 0.4}) brightness(${1 + intensity * 0.2}) saturate(${1 + intensity * 0.5})`,
          background: `linear-gradient(${intensity * 180}deg, rgba(255,0,255,0.1), rgba(0,255,255,0.1))`
        });
        break;
        
      default:
        break;
    }
  };

  // Animation principale avec cleanup approprié
  useEffect(() => {
    const section = sectionRef.current;
    const heroImage = heroImageRef.current;
    
    if (!section || !heroImage) return;

    // Stocker les références pour cleanup
    const scrollTriggers: ScrollTrigger[] = [];
    const eventListeners: { element: Element; type: string; handler: EventListener }[] = [];

    // Animation de l'image héro avec distortion
    gsap.set(heroImage, { 
      scale: 1.2, 
      filter: "brightness(0.7) contrast(1.3)",
    });

    const heroScrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Effet de parallaxe et distortion sur l'image héro
        gsap.set(heroImage, {
          yPercent: -30 + (progress * 60),
          scale: 1.2 - (progress * 0.3),
          filter: `brightness(${0.7 + progress * 0.5}) contrast(${1.3 - progress * 0.3}) hue-rotate(${progress * 30}deg)`,
        });
      }
    });
    scrollTriggers.push(heroScrollTrigger);

    // Animation des éléments de story
    storyElementsRef.current.forEach((element, index) => {
      if (!element) return;

      const step = storySteps[index];
      const isEven = index % 2 === 0;
      
      gsap.set(element, {
        x: isEven ? -100 : 100,
        opacity: 0,
        scale: 0.8,
        rotationY: isEven ? -15 : 15
      });

      const storyScrollTrigger = ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          gsap.set(element, {
            x: (isEven ? -100 : 100) * (1 - progress),
            opacity: progress,
            scale: 0.8 + (progress * 0.2),
            rotationY: (isEven ? -15 : 15) * (1 - progress)
          });

          // Effets spéciaux par étape
          const imageElement = element.querySelector('.story-image') as HTMLElement;
          if (imageElement && step?.effect) {
            applyImageEffect(imageElement, step.effect, progress);
          }
        }
      });
      scrollTriggers.push(storyScrollTrigger);

      // Animation continue sur hover
      const handleMouseEnter = (): void => {
        gsap.to(element.querySelector('.story-image'), {
          scale: 1.05,
          rotationZ: index % 2 === 0 ? 2 : -2,
          duration: 0.6,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = (): void => {
        gsap.to(element.querySelector('.story-image'), {
          scale: 1,
          rotationZ: 0,
          duration: 0.4,
          ease: "power2.out"
        });
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      eventListeners.push(
        { element, type: 'mouseenter', handler: handleMouseEnter },
        { element, type: 'mouseleave', handler: handleMouseLeave }
      );
    });

    // Cleanup function
    return () => {
      // Nettoyer tous les ScrollTriggers
      scrollTriggers.forEach(trigger => trigger.kill());
      
      // Nettoyer tous les event listeners
      eventListeners.forEach(({ element, type, handler }) => {
        element.removeEventListener(type, handler);
      });
    };
  }, [storySteps]);

  // Effet de souris pour l'image héro
  useEffect(() => {
    const heroImage = heroImageRef.current;
    if (!heroImage || !mousePosition) return;
    
    const intensity = 0.02;
    const x = (mousePosition.x - 50) * intensity;
    const y = (mousePosition.y - 50) * intensity;
    
    const mouseAnimation = gsap.to(heroImage, {
      x: x,
      y: y,
      duration: 2,
      ease: "power2.out"
    });

    return () => {
      mouseAnimation.kill();
    };
  }, [mousePosition]);

  return (
    <section id={id} className="experience-section immersive-experience" ref={sectionRef}>
      
      {/* Image héro avec parallaxe */}
      <div className="experience-hero">
        <div 
          className="hero-image optimized-image-container background-image"
          ref={heroImageRef}
          style={{ backgroundImage: `url(${image1})` }}
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <h2 className="hero-title">L'EXPÉRIENCE</h2>
            <p className="hero-subtitle">Au-delà de la technique, l'art de capturer l'émotion</p>
          </div>
        </div>
      </div>

      {/* Storytelling par scroll */}
      <div className="story-container">
        {storySteps.map((step, index) => (
          <div 
            key={step.id}
            className={`story-step ${step.position}`}
            ref={el => { storyElementsRef.current[index] = el; }}
          >
            <div className="story-content">
              <div className="story-text">
                <span className="story-number">0{step.id}</span>
                <h3 className="story-title">{step.title}</h3>
                <h4 className="story-subtitle">{step.subtitle}</h4>
                <p className="story-description">{step.description}</p>
              </div>
              
              <div className="story-image-container">
                <div
                  className="story-image"
                  style={{ 
                    backgroundImage: `url(${step.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  data-effect={step.effect}
                />
                <div className="image-frame"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Effet de transition finale */}
      <div className="experience-outro">
        <div className="outro-content">
          <h3>CHAQUE IMAGE RACONTE UNE HISTOIRE</h3>
          <p>L'expérience photographique va au-delà de la simple capture. C'est un voyage émotionnel partagé entre l'artiste et son sujet.</p>
        </div>
      </div>
      
    </section>
  );
};

export default ExperienceSection;