'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useAppScroll } from '@/context/AppContext';
import '../styles/hero-presentation.css';

interface HeroSectionProps {
  id?: string;
  scrollManagerRef?: React.RefObject<HTMLElement>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ id = "accueil", scrollManagerRef }) => {
  const { activeSection } = useAppScroll();
  const sectionRef = useRef<HTMLElement>(null);
  const ref = scrollManagerRef || sectionRef;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Gestion du scroll indicator
    const handleScroll = (): void => {
      const scrollY = window.scrollY;
      const indicator = document.querySelector('.scroll-indicator') as HTMLElement;
      
      if (indicator) {
        indicator.classList.toggle('hidden', scrollY > 50);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      if (typeof window !== 'undefined') {
        setIsDark(document.body.classList.contains('dark-theme'));
      }
    };
    checkTheme();
    window.addEventListener('storage', checkTheme);
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('storage', checkTheme);
      observer.disconnect();
    };
  }, []);

  return (
    <section id={id} ref={ref} className="hero-section">
      <div className="hero-content">
        <div style={{ width: 300, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <Image
            src="/images/logo-main.svg"
            className="main-logo logo"
            alt="Jover - Photographe Professionnel"
            width={300}
            height={100}
            priority
          />
        </div>
      </div>

      <div className="scroll-indicator">
        <span className="scroll-text">Découvrir</span>
        <div className="scroll-arrow">
          <div className="scroll-dot"></div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .hero-content {
          z-index: var(--z-base);
        }

        .main-logo {
          width: 300px;
          height: auto;
          z-index: var(--z-base);
          animation: mainLogoEntrance 2s ease-out 2.5s both;
          transition: all var(--duration-slower) var(--easing-ease), 
                      filter var(--duration-slowest) var(--easing-ease);
          filter: brightness(1) invert(0);
        }

        body.dark-theme .main-logo {
          filter: brightness(0) invert(1);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
          opacity: 1;
          transition: opacity var(--duration-normal) var(--easing-ease);
          z-index: var(--z-base);
        }

        .scroll-indicator.hidden {
          opacity: 0;
        }

        .scroll-text {
          font-size: var(--type-caption);
          font-weight: var(--font-weight-medium);
          letter-spacing: var(--letter-spacing-wide);
          color: var(--color-gray-800);
          text-transform: uppercase;
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        body.dark-theme .scroll-text {
          color: var(--color-text-light);
        }

        .scroll-arrow {
          width: 20px;
          height: 30px;
          border: 2px solid var(--color-gray-800);
          border-radius: 15px;
          position: relative;
          transition: border-color var(--duration-slowest) var(--easing-ease);
        }

        body.dark-theme .scroll-arrow {
          border-color: var(--color-text-light);
        }

        .scroll-dot {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 8px;
          background: var(--color-gray-800);
          border-radius: 2px;
          animation: scrollDot 2s ease-in-out infinite;
          transition: background var(--duration-slowest) var(--easing-ease);
        }

        body.dark-theme .scroll-dot {
          background: var(--color-text-light);
        }

        @keyframes mainLogoEntrance {
          0% {
            transform: scale(0.8) translateY(50px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes scrollDot {
          0% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateX(-50%) translateY(8px);
            opacity: 0.5;
          }
          100% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .main-logo {
            animation: none;
          }
          
          .scroll-dot {
            animation: none;
          }
        }

        @media (max-width: 768px) {
          .main-logo {
            width: 150px;
          }
          
          .scroll-indicator {
            bottom: 20px;
          }
        }

        @media (max-width: 480px) {
          .main-logo {
            width: 120px;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;