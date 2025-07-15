import React, { useRef, useEffect, useCallback } from 'react';
import { SCROLL_CONSTANTS } from '../utils/constants';
import image1 from '../assets/parallaxe/1.jpg';
import image2 from '../assets/parallaxe/2.jpg';
import image3 from '../assets/parallaxe/3.jpg';
import image4 from '../assets/parallaxe/4.jpg';
import image11 from '../assets/parallaxe/11.png';

const PARALLAX_CONFIG = [
  { image: image1, speed: 0.5 },
  { image: image2, speed: 0.8 },
  { image: image3, speed: 0.3 },
  { image: image4, speed: 0.6 }
];

const ParallaxGallery = ({ transitionImageRef }) => {
  const parallaxRefs = useRef([]);
  const textSectionRef = useRef(null);
  const textContentRef = useRef(null);

  const handleParallax = useCallback(() => {
    const scrollTop = window.pageYOffset;
    parallaxRefs.current.forEach(image => {
      if (!image) return;
      const speed = parseFloat(image.getAttribute('data-speed'));
      const yPos = -(scrollTop * speed);
      image.style.transform = `translateY(${yPos}px)`;
    });

    const textSection = textSectionRef.current;
    const textContent = textContentRef.current;
    if (!textSection || !textContent) return;

    let words = textContent.querySelectorAll('.word');
    if (words.length === 0) {
      const text = textContent.textContent;
      const wordsArray = text.split(' ');
      textContent.innerHTML = wordsArray
        .map(word => `<span class="word">${word}</span>`)
        .join(' ');
      words = textContent.querySelectorAll('.word');
    }

    const textRect = textSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (textRect.top < windowHeight && textRect.bottom > 0) {
      const progress = Math.max(
        0,
        Math.min(1, (windowHeight - textRect.top) / (windowHeight + textRect.height))
      );
      const wordsToReveal = Math.floor(progress * words.length);
      words.forEach((word, index) => {
        word.classList.toggle('active', index < wordsToReveal);
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleParallax);
    handleParallax();
    return () => window.removeEventListener('scroll', handleParallax);
  }, [handleParallax]);

  const imageStyle = { backgroundSize: 'cover', backgroundPosition: 'center' };

  return (
    <>
      <div className="parallax-container">
        {PARALLAX_CONFIG.map((config, index) => (
          <div
            key={index}
            className="parallax-image"
            data-speed={config.speed}
            role="img"
            aria-label={`Artwork ${index + 1}`}
            ref={el => (parallaxRefs.current[index] = el)}
            style={{ backgroundImage: `url(${config.image})`, ...imageStyle }}
          />
        ))}
      </div>
      <section className="text-section" ref={textSectionRef}>
        <h2 className="visually-hidden">About the artist</h2>
        <div className="text-content" id="textContent" ref={textContentRef}>
          I'M AN ARTIST KNOWN FOR MY SURREAL AND SENSUAL ARTWORKS. COMBINING PHOTOGRAPHY AND OIL PAINTING, I CREATE PIECES THAT CAPTURE THE BEAUTY AND COMPLEXITY OF THE FEMALE FORM. USING BOTH TRADITIONAL AND DIGITAL TECHNIQUES TO CREATE TIMELESS PIECES THAT EXPLORE THEMES OF PERFECTION AND DESIRE.
        </div>
      </section>
      <section id="portfolio" className="images-gallery">
        <h2 className="visually-hidden">Portfolio gallery</h2>
        <div
          className="parallax-image transition-image"
          data-speed="0.3"
          id="transitionImage"
          role="img"
          aria-label="Featured artwork"
          ref={el => {
            transitionImageRef.current = el;
            parallaxRefs.current[PARALLAX_CONFIG.length] = el;
          }}
          style={{ backgroundImage: `url(${image11})`, ...imageStyle }}
        />
      </section>
    </>
  );
};

export default ParallaxGallery;
