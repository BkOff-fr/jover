import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import image2 from '../assets/parallaxe/2.jpg';
import image3 from '../assets/parallaxe/3.jpg';
import image4 from '../assets/parallaxe/4.jpg';

gsap.registerPlugin(ScrollTrigger);

const PortfolioSection = ({ id, scrollManagerRef }) => {
  const sectionRef = useRef(null);
  const portfolioRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Données des projets portfolio
  const projectsData = [
    {
      id: 1,
      image: image2,
      title: "Série Portrait Intimiste",
      category: "portrait",
      year: "2024",
      client: "Magazine Elle",
      description: "Série de portraits explorant la vulnérabilité et l'authenticité féminine à travers un jeu subtil d'ombres et de lumières.",
      tags: ["Portrait", "Editorial", "Magazine"],
      filters: ["portrait", "editorial"]
    },
    {
      id: 2,
      image: image3,
      title: "Campagne Mode Avant-Garde",
      category: "fashion",
      year: "2024",
      client: "Maison Margiela",
      description: "Campagne publicitaire mêlant mode et art conceptuel, questionnant les codes de beauté contemporains.",
      tags: ["Mode", "Conceptuel", "Luxe"],
      filters: ["fashion", "commercial"]
    },
    {
      id: 3,
      image: image4,
      title: "Art Digital & NFT",
      category: "digital",
      year: "2023",
      client: "Galerie Numérique",
      description: "Collection d'œuvres numériques explorant l'intersection entre photographie traditionnelle et art digital.",
      tags: ["Digital", "NFT", "Innovation"],
      filters: ["digital", "art"]
    }
  ];

  const filterCategories = [
    { id: 'all', name: 'Tous les projets', count: projectsData.length },
    { id: 'portrait', name: 'Portraits', count: projectsData.filter(p => p.filters.includes('portrait')).length },
    { id: 'fashion', name: 'Mode', count: projectsData.filter(p => p.filters.includes('fashion')).length },
    { id: 'editorial', name: 'Editorial', count: projectsData.filter(p => p.filters.includes('editorial')).length },
    { id: 'digital', name: 'Digital Art', count: projectsData.filter(p => p.filters.includes('digital')).length }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projectsData 
    : projectsData.filter(project => project.filters.includes(activeFilter));

  useEffect(() => {
    const section = sectionRef.current;
    const portfolio = portfolioRef.current;
    
    if (!section || !portfolio) return;

    // Nettoyer les anciennes animations
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === section || 
          trigger.trigger?.closest('.portfolio-section')) {
        trigger.kill();
      }
    });

    // Approche alternative : utiliser IntersectionObserver au lieu de ScrollTrigger
    let hasAnimated = false;
    
    // Ajouter classes CSS pour l'état initial
    section.classList.add('portfolio-section-hidden');
    portfolio.querySelectorAll('.portfolio-project').forEach(project => {
      project.classList.add('portfolio-project-hidden');
    });

    // Observer pour déclencher l'animation une seule fois
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          
          // Animation de la section
          gsap.to(section, {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => section.classList.remove('portfolio-section-hidden')
          });
          
          // Animation des projets avec délai
          setTimeout(() => {
            const projects = portfolio.querySelectorAll('.portfolio-project');
            projects.forEach((project, index) => {
              setTimeout(() => {
                gsap.to(project, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.8,
                  ease: "back.out(1.7)",
                  onComplete: () => project.classList.remove('portfolio-project-hidden')
                });
              }, index * 100);
            });
          }, 200);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);

    return () => {
      // Nettoyer l'observer
      observer.disconnect();
      
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section || 
            trigger.trigger?.closest('.portfolio-section')) {
          trigger.kill();
        }
      });
    };
  }, [filteredProjects]);

  // Effet de filtre immersif au survol
  const handleProjectHover = (projectId, isEntering) => {
    const projectElement = document.querySelector(`[data-project-id="${projectId}"]`);
    if (!projectElement) return;

    if (isEntering) {
      gsap.to(projectElement.querySelector('.project-image'), {
        scale: 1.05,
        filter: 'brightness(1.1) contrast(1.2) saturate(1.3)',
        duration: 0.6,
        ease: "power2.out"
      });

      gsap.to(projectElement.querySelector('.project-overlay'), {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    } else {
      gsap.to(projectElement.querySelector('.project-image'), {
        scale: 1,
        filter: 'brightness(1) contrast(1) saturate(1)',
        duration: 0.4,
        ease: "power2.out"
      });

      gsap.to(projectElement.querySelector('.project-overlay'), {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    
    // Animation d'ouverture
    const modal = document.querySelector('.portfolio-modal');
    if (modal) {
      gsap.fromTo(modal,
        { 
          scale: 0,
          opacity: 0,
          rotationY: -180
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 0.8,
          ease: "back.out(1.7)"
        }
      );
    }
  };

  const closeModal = () => {
    const modal = document.querySelector('.portfolio-modal');
    if (modal) {
      gsap.to(modal, {
        scale: 0,
        opacity: 0,
        rotationY: 180,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => setSelectedProject(null)
      });
    }
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    
    // Animation de transition des filtres
    const projects = document.querySelectorAll('.portfolio-project');
    gsap.to(projects, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        // Re-animer après le changement de filtre
        setTimeout(() => {
          const newProjects = document.querySelectorAll('.portfolio-project');
          gsap.fromTo(newProjects, 
            { opacity: 0, y: 20 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.4, 
              stagger: 0.05,
              ease: "power2.out" 
            }
          );
        }, 100);
      }
    });
  };

  return (
    <section id={id} className="portfolio-section" ref={sectionRef}>
      {/* Interface Portfolio */}
      <div className="portfolio-interface" ref={portfolioRef}>
        
        {/* En-tête avec filtres */}
        <div className="portfolio-header">
          <div className="portfolio-title">
            <h2>PORTFOLIO</h2>
            <p className="portfolio-subtitle">Projets sélectionnés • {filteredProjects.length} œuvres</p>
          </div>
          
          <div className="portfolio-filters">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(category.id)}
              >
                {category.name}
                <span className="filter-count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grille des projets */}
        <div className="portfolio-grid">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="portfolio-project"
              data-project-id={project.id}
              onMouseEnter={() => handleProjectHover(project.id, true)}
              onMouseLeave={() => handleProjectHover(project.id, false)}
              onClick={() => handleProjectClick(project)}
            >
              <div className="project-image-container">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="project-image"
                />
                <div className="project-overlay">
                  <div className="overlay-content">
                    <span className="project-category">{project.category.toUpperCase()}</span>
                    <h4 className="project-title-overlay">{project.title}</h4>
                    <p className="project-client">{project.client}</p>
                  </div>
                </div>
              </div>
              
              <div className="project-metadata">
                <div className="project-header">
                  <h4 className="project-title">{project.title}</h4>
                  <span className="project-year">{project.year}</span>
                </div>
                <p className="project-client-name">{project.client}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal détail projet */}
      {selectedProject && (
        <div className="portfolio-modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-project-image">
              <img src={selectedProject.image} alt={selectedProject.title} />
            </div>
            
            <div className="modal-project-info">
              <div className="modal-header">
                <h3>{selectedProject.title}</h3>
                <span className="modal-year">{selectedProject.year}</span>
              </div>
              
              <div className="modal-client">
                <strong>Client:</strong> {selectedProject.client}
              </div>
              
              <p className="modal-description">{selectedProject.description}</p>
              
              <div className="modal-tags">
                {selectedProject.tags.map((tag) => (
                  <span key={tag} className="modal-tag">{tag}</span>
                ))}
              </div>
              
              <div className="modal-category">
                <span className="category-badge">{selectedProject.category}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioSection;