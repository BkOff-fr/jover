'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppScroll, useAppClick } from '@/context/AppContext';
import '../styles/header.css';

const Header: React.FC = () => {
  const { activeSection, scrollToSection } = useAppScroll();
  const { handleClick } = useAppClick();
  const [menuOpen, setMenuOpen] = useState(false);
  // Header logic handled via activeSection from useScroll context



  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string): void => {
    e.preventDefault();
    handleClick(e.currentTarget);
    scrollToSection(sectionId);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <h1 className="visually-hidden">Jover - Photographe Professionnel</h1>
        <Image 
          src="/images/logo.svg" 
          className="logo" 
          alt="Jover logo"
          width={120}
          height={40}
          priority
        />
      </div>
      <button className={`menu-burger${menuOpen ? ' open' : ''}`} aria-label="Ouvrir le menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="burger-bar" />
        <span className="burger-bar" />
        <span className="burger-bar" />
      </button>
      <nav className={`nav${menuOpen ? ' open' : ''}`}>
        <a 
          href="#accueil" 
          className={activeSection === 'accueil' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'accueil')}
        >
          ACCUEIL
        </a>
        <a 
          href="#presentation" 
          className={activeSection === 'presentation' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'presentation')}
        >
          PRÉSENTATION
        </a>
        <a 
          href="#portfolio" 
          className={activeSection === 'portfolio' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'portfolio')}
        >
          PORTFOLIO
        </a>
        <a 
          href="#contact" 
          className={activeSection === 'contact' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'contact')}
        >
          CONTACT
        </a>
      </nav>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--header-padding);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--color-border);
          z-index: var(--z-header);
          height: var(--header-height);
          transition: all var(--duration-normal) var(--easing-ease);
        }

        body.dark-theme .header {
          background: rgba(26, 26, 26, 0.95);
          border-bottom-color: var(--color-gray-700);
        }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--color-gray-200);
          z-index: var(--z-progress);
        }

        body.dark-theme .progress-bar {
          background: var(--color-gray-700);
        }

        .progress-fill {
          height: 100%;
          background: var(--color-accent-primary);
          transition: width var(--duration-fast) ease-out;
        }

        .logo-container {
          flex: 1;
        }

        .logo {
          height: 40px;
          width: auto;
          transition: all var(--duration-slower) var(--easing-ease);
          /* Filter géré par globals.css avec !important pour éviter les conflits */
        }

        .nav {
          display: flex;
          gap: var(--spacing-xl);
          align-items: center;
        }

        .nav-link {
          font-size: var(--type-small);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-tight);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: 0;
          transition: all var(--duration-normal) var(--easing-ease);
          position: relative;
        }

        .nav-link:hover {
          color: var(--color-accent-primary);
        }

        .nav-link.active {
          color: var(--color-accent-primary);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: var(--color-accent-primary);
          border-radius: 0;
        }

        @media (max-width: 768px) {
          .header {
            padding: var(--spacing-md) var(--spacing-lg);
          }

          .nav {
            gap: var(--spacing-md);
          }

          .nav-link {
            font-size: var(--type-caption);
            padding: var(--spacing-xs) var(--spacing-sm);
          }

          .logo {
            height: 30px;
          }
        }

        @media (max-width: 480px) {
          .nav {
            gap: var(--spacing-sm);
          }

          .nav-link {
            font-size: 10px;
            padding: var(--spacing-xs);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;