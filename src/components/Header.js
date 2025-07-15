import React from 'react';
import logo from '../logo.svg';

const Header = () => (
  <header>
    <img src={logo} className="logo" alt="logo" />
    <nav>
      <a href="#accueil">ACCUEIL</a>
      <a href="#experience">L'EXPÉRIENCE</a>
      <a href="#portfolio">PORTFOLIO</a>
      <a href="#contact">CONTACT</a>
    </nav>
  </header>
);

export default Header;
