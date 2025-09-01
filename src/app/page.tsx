'use client'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import dynamic from 'next/dynamic';
import GlobalBackground from '@/components/client/GlobalBackground'
import { useAppScroll } from '@/context/AppContext'

const PresentationSection = dynamic(() => import('@/components/PresentationSection'), { loading: () => <div style={{minHeight: 300}}>Chargement Présentation...</div> });
const PortfolioSection = dynamic(() => import('@/components/PortfolioSection'), { loading: () => <div style={{minHeight: 300}}>Chargement Portfolio...</div> });
const ContactSection = dynamic(() => import('@/components/ContactSection'), { loading: () => <div style={{minHeight: 300}}>Chargement Contact...</div> });

export default function Home() {
  const { scrollManagerRef } = useAppScroll();
  return (
    <main>
      <GlobalBackground />
      <Header />
      <HeroSection id="accueil" />
      <PresentationSection id="presentation" scrollManagerRef={scrollManagerRef} />
      <PortfolioSection id="portfolio" scrollManagerRef={scrollManagerRef} />
      <ContactSection id="contact" scrollManagerRef={scrollManagerRef} />
    </main>
  )
}