import React, { useRef, useEffect, useCallback } from 'react';
import { SCROLL_CONSTANTS } from '../utils/constants';

const ExperienceSection = ({ transitionImageRef }) => {
  const experienceSectionRef = useRef(null);
  const experienceTitleRef = useRef(null);
  const transitionOverlayRef = useRef(null);

  const resetLetters = useCallback(letters => {
    letters.forEach(letter => {
      letter.style.transform = 'translateY(100px)';
      letter.style.opacity = '0';
    });
  }, []);

  const updateOverlay = useCallback((overlay, progress) => {
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

  const handleScroll = useCallback(() => {
    const experienceSection = experienceSectionRef.current;
    const transitionImage = transitionImageRef.current;
    const experienceTitle = experienceTitleRef.current;
    const transitionOverlay = transitionOverlayRef.current;

    if (!experienceSection || !transitionImage || !experienceTitle) return;

    const sectionRect = experienceSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const startPoint = windowHeight;

    let progress = 0;
    if (sectionRect.top <= startPoint) {
      progress = Math.max(
        0,
        Math.min(1, (startPoint - sectionRect.top) / (startPoint - windowHeight * 0.2))
      );
    }

    const letters = experienceTitle.querySelectorAll('.letter');

    if (progress > SCROLL_CONSTANTS.TRANSITION_MIN_PROGRESS) {
      const scale = 1 + progress * 15;
      const rotation = progress * 45;
      const moveX = progress * window.innerWidth * 0.45;
      const moveY = progress * window.innerHeight * 0.6;

      const scaleX = progress > 0.8 ? scale + (progress - 0.8) * 20 : scale;
      const scaleY = progress > 0.8 ? scale * (1 - (progress - 0.8) * 0.3) : scale;

      transitionImage.style.transform = `
        translateY(${-(window.pageYOffset * 0.1) - moveY}px)
        translateX(${-moveX}px)
        scaleX(${scaleX})
        scaleY(${scaleY})
        rotate(${rotation}deg)
      `;

      const zIndex = progress > 0.7
        ? SCROLL_CONSTANTS.TRANSITION_Z_INDEX.ACTIVE_HIGH
        : SCROLL_CONSTANTS.TRANSITION_Z_INDEX.ACTIVE_LOW;
      transitionImage.style.zIndex = zIndex;
      transitionImage.style.borderRadius = `${20 - progress * 20}px`;

      updateOverlay(transitionOverlay, progress);

      if (progress > 0.6) {
        const titleProgress = Math.max(0, Math.min(1, (progress - 0.6) / 0.4));
        letters.forEach((letter, index) => {
          const letterIndex = parseInt(letter.getAttribute('data-index'));
          const totalLetters = letters.length;
          let delay = 0;
          if (letterIndex === 0 || letterIndex === totalLetters - 1) {
            delay = 0.8;
          } else if (letterIndex === 1 || letterIndex === totalLetters - 2) {
            delay = 0.6;
          } else {
            delay = (letterIndex / totalLetters) * 0.4;
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
      transitionImage.style.zIndex = SCROLL_CONSTANTS.TRANSITION_Z_INDEX.DEFAULT;
      transitionImage.style.borderRadius = '0px';
      if (transitionOverlay) {
        transitionOverlay.style.opacity = '0';
        transitionOverlay.style.display = 'none';
      }
      resetLetters(letters);
    }
  }, [resetLetters, updateOverlay, transitionImageRef]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section className="experience-section" ref={experienceSectionRef} id="experience">
      <div className="transition-overlay" id="transitionOverlay" ref={transitionOverlayRef}></div>
      <div className="experience-title-container">
        <h2 className="experience-title" id="experienceTitle" ref={experienceTitleRef}>
          {['L', "'", 'E', 'X', 'P', 'É', 'R', 'I', 'E', 'N', 'C', 'E'].map((letter, index) => (
            <span key={index} className="letter" data-index={index}>
              {letter}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
};

export default ExperienceSection;
