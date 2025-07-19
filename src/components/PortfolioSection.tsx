import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonSectionProps, PortfolioProject, PortfolioFilter } from '../types/components';
import image2 from '../assets/parallaxe/2.jpg';
import image3 from '../assets/parallaxe/3.jpg';
import image4 from '../assets/parallaxe/4.jpg';

gsap.registerPlugin(ScrollTrigger);

const PortfolioSection: React.FC<CommonSectionProps> = ({ id, scrollManagerRef }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const portfolioRef = useRef<HTMLDivElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [activeFilter, setActiveFilter] = useState<PortfolioFilter>('all');
  const animationRefs = useRef<gsap.core.Timeline[]>([]);

  // Images importées et prêtes

  // Données des projets portfolio (memoized)
  const projectsData = useMemo<PortfolioProject[]>(() => [
    {
      id: 1,
      image: image2,
      title: "Série Portrait Intimiste",
      category: "portrait",
      year: 2024,
      client: "Magazine Elle",
      description: "Série de portraits explorant la vulnérabilité et l'authenticité féminine à travers un jeu subtil d'ombres et de lumières.",
      tags: ["Portrait", "Editorial", "Magazine"]
    },
    {
      id: 2,
      image: image3,
      title: "Campagne Mode Avant-Garde",
      category: "mode",
      year: 2024,
      client: "Maison Margiela",
      description: "Campagne publicitaire mêlant mode et art conceptuel, questionnant les codes de beauté contemporains.",
      tags: ["Mode", "Conceptuel", "Luxe"]
    },
    {
      id: 3,
      image: image4,
      title: "Art Digital & NFT",
      category: "produit",
      year: 2023,
      client: "Galerie Numérique",
      description: "Collection d'œuvres numériques explorant l'intersection entre photographie traditionnelle et art digital.",
      tags: ["Digital", "NFT", "Innovation"]
    }
  ], []);

  // Filtres disponibles
  const filters = useMemo(() => [
    { id: 'all' as PortfolioFilter, label: 'Tous', count: projectsData.length },
    { id: 'portrait' as PortfolioFilter, label: 'Portrait', count: projectsData.filter(p => p.category === 'portrait').length },
    { id: 'mode' as PortfolioFilter, label: 'Mode', count: projectsData.filter(p => p.category === 'mode').length },
    { id: 'produit' as PortfolioFilter, label: 'Produit', count: projectsData.filter(p => p.category === 'produit').length }
  ], [projectsData]);

  // Projets filtrés
  const filteredProjects = useMemo(() => {
    return activeFilter === 'all' 
      ? projectsData 
      : projectsData.filter(project => project.category === activeFilter);
  }, [projectsData, activeFilter]);

  // Animation des projets avec GSAP
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Nettoyer les anciennes animations
    animationRefs.current.forEach(animation => animation.kill());
    animationRefs.current = [];

    // Animation d'entrée de la section
    const sectionTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const projects = section.querySelectorAll('.portfolio-project');
        
        projects.forEach((project, index) => {
          const delay = index * 0.1;
          const elementProgress = Math.max(0, Math.min(1, progress - delay));
          
          gsap.set(project, {
            opacity: elementProgress,
            y: (1 - elementProgress) * 50,
            scale: 0.9 + (elementProgress * 0.1)
          });
        });
      }
    });

    animationRefs.current.push(sectionTrigger as any);

    return () => {
      animationRefs.current.forEach(animation => animation.kill());
      animationRefs.current = [];
    };
  }, [filteredProjects]);

  // Cleanup général
  useEffect(() => {
    const section = sectionRef.current;
    
    return () => {
      // Nettoyer toutes les animations GSAP
      animationRefs.current.forEach(animation => {
        if (animation && typeof animation.kill === 'function') {
          animation.kill();
        }
      });
      
      // Nettoyer tous les ScrollTriggers de cette section
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section || 
            (trigger.trigger && section?.contains(trigger.trigger as Node))) {
          trigger.kill();
        }
      });
    };
  }, []);

  const handleFilterClick = (filter: PortfolioFilter): void => {
    setActiveFilter(filter);
  };

  const handleProjectClick = (project: PortfolioProject): void => {
    setSelectedProject(project);
  };

  const handleCloseModal = (): void => {
    setSelectedProject(null);
  };

  return (
    <section id={id} className="portfolio-section" ref={sectionRef}>
      <div className="portfolio-interface">
        
        {/* Header */}
        <div className="portfolio-header">
          <div className="portfolio-title">
            <h2>Portfolio</h2>
            <p className="portfolio-subtitle">
              Découvrez une sélection de mes travaux les plus récents
            </p>
          </div>
          
          {/* Filtres */}
          <div className="portfolio-filters">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => handleFilterClick(filter.id)}
              >
                {filter.label}
                <span className="filter-count">({filter.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grille des projets */}
        <div className="portfolio-grid" ref={portfolioRef}>
          {filteredProjects.map(project => (
            <div 
              key={project.id}
              className="portfolio-project"
              onClick={() => handleProjectClick(project)}
            >
              <div 
                className="project-image"
                style={{ 
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="project-overlay">
                  <div className="project-info">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-category">{project.category}</p>
                    <span className="project-year">{project.year}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      
      {/* Modal du projet */}
      {selectedProject && (
        <div className="project-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>
            
            <div
              className="modal-image"
              style={{
                backgroundImage: `url(${selectedProject.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            <div className="modal-info">
              <h3 className="modal-title">{selectedProject.title}</h3>
              <p className="modal-client">{selectedProject.client}</p>
              <span className="modal-year">{selectedProject.year}</span>
              
              <div className="modal-description">
                <p>{selectedProject.description}</p>
              </div>
              
              <div className="modal-tags">
                {selectedProject.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioSection;