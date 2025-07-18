import React from 'react';
import logo from '../logo.svg';
import { useAppScroll, useAppClickAnimation } from '../context/AppContext';

const Header = () => {
  const { scrollProgress, activeSection, scrollToSection } = useAppScroll();
  const { handleClick } = useAppClickAnimation();

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    handleClick(e.currentTarget);
    scrollToSection(sectionId);
  };

  return (
    <header>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div className="logo-container">
        <h1 className="visually-hidden">Jover - Photographe Professionnel</h1>
        <img src={logo} className="logo" alt="Jover logo" />
      </div>
      <nav>
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
          href="#experience" 
          className={activeSection === 'experience' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'experience')}
        >
          L'EXPÉRIENCE
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
    </header>
  );
};

export default Header;
