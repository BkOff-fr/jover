import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '../context/AppContext';
import { CommonSectionProps } from '../types/components';
import image1 from '../assets/parallaxe/1.jpg';
import image2 from '../assets/parallaxe/2.jpg';
import image3 from '../assets/parallaxe/3.jpg';
import image4 from '../assets/parallaxe/4.jpg';

gsap.registerPlugin(ScrollTrigger);

interface EmotionalMoment {
  id: number;
  emotion: string;
  title: string;
  description: string;
  clientQuote: string;
  clientName: string;
  image: string;
  feeling: string;
}


const ExperienceSection: React.FC<CommonSectionProps> = ({ id, scrollManagerRef }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeEmotion, setActiveEmotion] = useState<number>(0);
  const { scrollProgress } = useAppContext();
  
  // Moments émotionnels d'une séance photo
  const emotionalMoments = useMemo<EmotionalMoment[]>(() => [
    {
      id: 0,
      emotion: "CONSULTATION",
      title: "\"Préparation personnalisée\"",
      description: "Discussion de vos objectifs et préparation de la séance selon vos besoins. Définition du style et de l'ambiance désirés.",
      clientQuote: "Jover a pris le temps de comprendre exactement ce que je recherchais pour mes photos professionnelles.",
      clientName: "Sarah, dirigeante d'entreprise",
      image: image1,
      feeling: "Préparation sur-mesure"
    },
    {
      id: 1,
      emotion: "SHOOTING",
      title: "\"Ambiance professionnelle et détendue\"",
      description: "Prise de vue dans un environnement professionnel avec un éclairage optimal. Direction artistique pour des poses naturelles et authentiques.",
      clientQuote: "L'atmosphère était détendue tout en restant très professionnelle. Les résultats dépassent mes attentes.",
      clientName: "Marie, artiste", 
      image: image2,
      feeling: "Professionnalisme et qualité"
    },
    {
      id: 2,
      emotion: "POST-PRODUCTION",
      title: "\"Finition professionnelle\"",
      description: "Retouche et post-production soignées pour optimiser chaque image. Sélection des meilleures photos selon vos besoins.",
      clientQuote: "Le travail de post-production est remarquable. Chaque détail est soigné sans perdre le naturel.",
      clientName: "Elena, consultante",
      image: image3,
      feeling: "Excellence technique"
    },
    {
      id: 3,
      emotion: "LIVRAISON",
      title: "\"Résultats qui dépassent les attentes\"",
      description: "Livraison de vos images en haute qualité, prêtes pour tous vos usages : réseaux sociaux, site web, supports print.",
      clientQuote: "J'utilise ces photos depuis des mois pour ma communication d'entreprise. Elles me représentent parfaitement.",
      clientName: "Carla, entrepreneuse",
      image: image4,
      feeling: "Satisfaction client"
    }
  ], []);


  // Animations GSAP
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const animations: gsap.core.Timeline[] = [];

    // Animation des moments émotionnels
    emotionalMoments.forEach((_, index) => {
      const momentElement = section.querySelector(`[data-emotion="${index}"]`);
      if (momentElement) {
        const emotionTl = gsap.timeline({
          scrollTrigger: {
            trigger: momentElement,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => setActiveEmotion(index),
            onEnterBack: () => setActiveEmotion(index)
          }
        });

        emotionTl.fromTo(momentElement,
          { opacity: 0, y: 80, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
        );

        animations.push(emotionTl);
      }
    });

    // Animation des quotes flottantes
    const quotes = section.querySelectorAll('.floating-quote');
    quotes.forEach((quote, index) => {
      gsap.set(quote, {
        y: -30 + (index * 20),
        opacity: 0.7,
        scale: 0.9 + (index * 0.05)
      });

      const quoteTl = gsap.timeline({
        scrollTrigger: {
          trigger: quote,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1
        }
      });

      quoteTl.to(quote, {
        y: 30 - (index * 15),
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: "none"
      });

      animations.push(quoteTl);
    });

    return () => {
      animations.forEach(animation => animation.kill());
    };
  }, [emotionalMoments]);

  return (
    <section id={id} className="experience-section-emotional" ref={sectionRef}>
      
      {/* Hero Émotionnel */}
      <div className="emotional-hero">
        <div className="hero-atmosphere">
          <div className="floating-emotions">
            <span className="emotion-word" style={{ "--delay": "0s" } as React.CSSProperties}>Révélation</span>
            <span className="emotion-word" style={{ "--delay": "2s" } as React.CSSProperties}>Confiance</span>
            <span className="emotion-word" style={{ "--delay": "4s" } as React.CSSProperties}>Beauté</span>
            <span className="emotion-word" style={{ "--delay": "6s" } as React.CSSProperties}>Authenticité</span>
            <span className="emotion-word" style={{ "--delay": "8s" } as React.CSSProperties}>Transformation</span>
          </div>
        </div>
        
        <div className="hero-content-emotional">
          <h2 className="emotional-title">
            L'EXPÉRIENCE 
            <span className="title-highlight">PHOTOGRAPHIQUE</span>
          </h2>
          <p className="emotional-subtitle">
            Créons ensemble des souvenirs uniques et professionnels. 
            Des images qui reflètent votre authenticité.
          </p>
          
        </div>
      </div>

      {/* Parcours Émotionnel */}
      <div className="emotional-journey">
        <div className="journey-header">
          <h3 className="section-title-emotional">DÉROULEMENT D'UNE SÉANCE</h3>
          <p className="section-subtitle-emotional">
            Découvrez comment se déroule une séance photo professionnelle
          </p>
        </div>

        <div className="emotions-timeline">
          {emotionalMoments.map((moment, index) => (
            <div 
              key={moment.id}
              className={`emotion-moment ${activeEmotion === index ? 'active' : ''}`}
              data-emotion={index}
            >
              <div className="moment-visual">
                <div 
                  className="moment-image"
                  style={{ backgroundImage: `url(${moment.image})` }}
                >
                  <div className="image-glow"></div>
                </div>
                <div className="emotion-badge">{moment.emotion}</div>
              </div>

              <div className="moment-content">
                <div className="feeling-tag">{moment.feeling}</div>
                <h4 className="moment-title">{moment.title}</h4>
                <p className="moment-description">{moment.description}</p>
                
                <blockquote className="client-testimonial">
                  <p className="testimonial-quote">"{moment.clientQuote}"</p>
                  <cite className="testimonial-author">— {moment.clientName}</cite>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>



    </section>
  );
};

export default ExperienceSection;