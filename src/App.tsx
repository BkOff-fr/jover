import React from 'react';
import './App.css';
import './styles/index.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PresentationSection from './components/PresentationSection';
import ExperienceSection from './components/ExperienceSection';
import PortfolioSection from './components/PortfolioSection';
import ContactSection from './components/ContactSection';
import CustomCursor from './components/CustomCursor';
import GlobalBackground from './components/GlobalBackground';
import { AppProvider, useAppContext } from './context/AppContext';

/**
 * Composant App principal avec la nouvelle architecture
 */
function AppContent(): React.JSX.Element {
  const {
    isDarkTheme,
    scrollManagerRef
  } = useAppContext();

  return (
    <div className={`App ${isDarkTheme ? 'dark-theme' : ''}`}>
      <GlobalBackground />
      <CustomCursor />
      <Header />
      <main id="main-content" className="main-content">
        <HeroSection id="accueil" />
        <PresentationSection id="presentation" scrollManagerRef={scrollManagerRef} />
        <ExperienceSection id="experience" scrollManagerRef={scrollManagerRef} />
        <PortfolioSection id="portfolio" scrollManagerRef={scrollManagerRef} />
        <ContactSection id="contact" scrollManagerRef={scrollManagerRef} />
      </main>
    </div>
  );
}

/**
 * Composant App wrapper avec le provider de contexte
 */
function App(): React.JSX.Element {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;