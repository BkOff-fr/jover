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
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [cardImageIndices, setCardImageIndices] = useState<{[key: number]: number}>({});
  const [activeFilter, setActiveFilter] = useState<PortfolioFilter>('all');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [itemsPerSlide, setItemsPerSlide] = useState<number>(3);
  const [isCarouselMode, setIsCarouselMode] = useState<boolean>(false);
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const animationRefs = useRef<gsap.core.Timeline[]>([]);

  // Images importées et prêtes

  // Portfolio de Jover - approche photographique personnelle
  const projectsData = useMemo<PortfolioProject[]>(() => [
    {
      id: 1,
      image: image2,
      images: [image2, image3, image4], // Plusieurs images pour tester
      title: "Instants Bruts",
      category: "portrait",
      year: 2024,
      client: "Série personnelle",
      description: "Capturer l'instant sans artifices, révéler la sincérité d'un geste spontané. Chaque portrait raconte une histoire authentique, loin des conventions, dans la pure tradition de la photographie humaniste.",
      tags: ["Authenticité", "Spontané", "Humaniste"]
    },
    {
      id: 2,
      image: image3,
      images: [image3], // Une seule image
      title: "Visions Graphiques",
      category: "mode",
      year: 2024,
      client: "Création artistique",
      description: "Composer comme un tableau cinématographique. Lignes, textures, contrastes se mêlent pour créer une imagerie qui brise les codes, explore la symétrie et l'asymétrie avec audace.",
      tags: ["Cinématographique", "Composition", "Graphique"]
    },
    {
      id: 3,
      image: image4,
      images: [image4, image2], // Deux images
      title: "Expérimentations Créatives",
      category: "produit",
      year: 2023,
      client: "Recherche personnelle",
      description: "Flous artistiques, reflets inattendus, surimpressions poétiques. Cette série explore les limites de la photographie traditionnelle pour proposer une imagerie audacieuse qui transcende les conventions.",
      tags: ["Expérimental", "Créatif", "Avant-garde"]
    },
    {
      id: 4,
      image: image2,
      images: [image2],
      title: "Portraits Intimes",
      category: "portrait",
      year: 2024,
      client: "Collection privée",
      description: "Une série de portraits capturés dans l'intimité, révélant la vulnérabilité et la force de caractère de chaque sujet.",
      tags: ["Intimité", "Émotion", "Caractère"]
    },
    {
      id: 5,
      image: image3,
      images: [image3],
      title: "Mode Urbaine",
      category: "mode",
      year: 2023,
      client: "Studio créatif",
      description: "La mode rencontre l'architecture urbaine dans cette série qui explore les contrastes entre le humain et la ville.",
      tags: ["Urbain", "Architecture", "Style"]
    },
    {
      id: 6,
      image: image4,
      images: [image4],
      title: "Objets d'Art",
      category: "produit",
      year: 2024,
      client: "Galerie moderne",
      description: "Mise en valeur d'objets d'art contemporain avec un éclairage sculpté et des angles novateurs.",
      tags: ["Art", "Lumière", "Sculpture"]
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
    const filtered = activeFilter === 'all' 
      ? projectsData 
      : projectsData.filter(project => project.category === activeFilter);
    
    // Activer le carrousel si plus de 3 projets
    setIsCarouselMode(filtered.length > 3);
    
    return filtered;
  }, [projectsData, activeFilter]);

  // Projets visibles pour le carrousel
  const visibleProjects = useMemo(() => {
    if (!isCarouselMode) {
      return filteredProjects;
    }
    
    const startIndex = currentSlide * itemsPerSlide;
    return filteredProjects.slice(startIndex, startIndex + itemsPerSlide);
  }, [filteredProjects, currentSlide, itemsPerSlide, isCarouselMode]);

  // Navigation du carrousel
  const totalSlides = Math.ceil(filteredProjects.length / itemsPerSlide);
  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrev = currentSlide > 0;

  const nextSlide = () => {
    if (canGoNext && !isChanging) {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
        setIsChanging(false);
      }, 300);
    }
  };

  const prevSlide = () => {
    if (canGoPrev && !isChanging) {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev - 1);
        setIsChanging(false);
      }, 300);
    }
  };

  const goToSlide = (slideIndex: number) => {
    if (slideIndex !== currentSlide && !isChanging) {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentSlide(slideIndex);
        setIsChanging(false);
      }, 300);
    }
  };

  // Reset du slide lors du changement de filtre
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeFilter]);

  // Gestion responsive du nombre d'éléments par slide
  useEffect(() => {
    const updateItemsPerSlide = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerSlide(1);
      } else if (width < 1200) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };

    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);

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
            opacity: Math.max(0.1, elementProgress),
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
  }, [visibleProjects]);

  // Désactiver le scroll quand le modal est ouvert
  useEffect(() => {
    if (selectedProject) {
      // Bloquer le scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurer le scroll sans redirection visible
      document.body.style.overflow = '';
    }

    // Cleanup au démontage
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

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
    setCurrentImageIndex(0); // Reset à la première image
  };

  const handleCloseModal = (): void => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = (): void => {
    if (selectedProject && currentImageIndex < selectedProject.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = (): void => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const goToImage = (index: number): void => {
    setCurrentImageIndex(index);
  };

  const setCardImageIndex = (projectId: number, imageIndex: number): void => {
    setCardImageIndices(prev => ({
      ...prev,
      [projectId]: imageIndex
    }));
  };

  const getCardImageIndex = (projectId: number): number => {
    return cardImageIndices[projectId] || 0;
  };

  return (
    <section id={id} className="portfolio-section" ref={sectionRef}>
      <div className="portfolio-interface">
        
        {/* Header avec style contact sheet */}
        <div className="portfolio-header">
          <div className="portfolio-title">
            <h2>Portfolio Photographique</h2>
            <p className="portfolio-subtitle">
              Visions artistiques, instants décisifs, expérimentations créatives
            </p>
          </div>
          
          {/* Filtres style appareil photo */}
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

        {/* Navigation carrousel */}
        {isCarouselMode && (
          <div className="carousel-controls">
            <div className="carousel-navigation">
              <button 
                className={`carousel-btn carousel-prev ${!canGoPrev ? 'disabled' : ''}`}
                onClick={prevSlide}
                disabled={!canGoPrev}
              >
                <span>‹</span>
              </button>
              
              <div className="carousel-indicators">
                {Array.from({ length: totalSlides }, (_, index) => (
                  <div
                    key={index}
                    className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        goToSlide(index);
                      }
                    }}
                  />
                ))}
              </div>
              
              <button 
                className={`carousel-btn carousel-next ${!canGoNext ? 'disabled' : ''}`}
                onClick={nextSlide}
                disabled={!canGoNext}
              >
                <span>›</span>
              </button>
            </div>
            
            <div className="carousel-info">
              <span className="carousel-counter">
                {currentSlide + 1} / {totalSlides}
              </span>
              <span className="carousel-total">
                {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Grille style contact sheet */}
        <div className={`portfolio-grid ${isCarouselMode ? 'carousel-mode' : ''} ${isChanging ? 'changing' : ''}`} ref={portfolioRef}>
          {visibleProjects.map((project, index) => (
            <div 
              key={project.id}
              className="portfolio-project"
              onClick={() => handleProjectClick(project)}
            >
              <div className="frame-number">{`${String(index + 1).padStart(2, '0')}/24`}</div>
              <div className="project-image-container">
                <div 
                  className="project-image"
                  style={{ 
                    backgroundImage: `url(${project.images[getCardImageIndex(project.id)]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="category-badge-overlay">
                    {project.category.toUpperCase()}
                  </div>
                  <div className="project-exif">
                    f/2.8 • 1/250s • ISO 400
                  </div>
                </div>
                
                <div className="project-overlay">
                  <div className="overlay-content">
                    <h4 className="project-title-overlay">{project.title}</h4>
                    <p className="project-client">{project.client}</p>
                    <span className="project-year">{project.year}</span>
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
                  {project.tags.map(tag => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
                
                {/* Sélecteur d'images si plusieurs images */}
                {project.images.length > 1 && (
                  <div className="project-image-selector">
                    <span className="selector-label">Images:</span>
                    <div className="project-image-dots">
                      {project.images.map((_, imageIndex) => (
                        <div
                          key={imageIndex}
                          className={`project-image-dot ${getCardImageIndex(project.id) === imageIndex ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardImageIndex(project.id, imageIndex);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              setCardImageIndex(project.id, imageIndex);
                            }
                          }}
                        />
                      ))}
                    </div>
                    <span className="image-counter">
                      {getCardImageIndex(project.id) + 1}/{project.images.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
      
      {/* Modal lightbox professionnelle */}
      {selectedProject && (
        <div className="project-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-image">
              <img 
                src={selectedProject.images[currentImageIndex]} 
                alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                className="modal-image-content"
              />
              
              {/* Navigation images si plusieurs images */}
              {selectedProject.images.length > 1 && (
                <>
                  <button 
                    className={`modal-nav modal-nav-prev ${currentImageIndex === 0 ? 'disabled' : ''}`}
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                  >
                    ‹
                  </button>
                  
                  <button 
                    className={`modal-nav modal-nav-next ${currentImageIndex === selectedProject.images.length - 1 ? 'disabled' : ''}`}
                    onClick={nextImage}
                    disabled={currentImageIndex === selectedProject.images.length - 1}
                  >
                    ›
                  </button>
                  
                  <div className="modal-image-indicators">
                    {selectedProject.images.map((_, index) => (
                      <div
                        key={index}
                        className={`modal-image-dot ${currentImageIndex === index ? 'active' : ''}`}
                        onClick={() => goToImage(index)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            goToImage(index);
                          }
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="modal-image-counter">
                    {currentImageIndex + 1} / {selectedProject.images.length}
                  </div>
                </>
              )}
              {/* Données EXIF */}
              <div className="modal-exif">
                <div className="modal-exif-row">
                  <span>Camera:</span>
                  <span>Sony A7R IV</span>
                </div>
                <div className="modal-exif-row">
                  <span>Lens:</span>
                  <span>85mm f/1.4</span>
                </div>
                <div className="modal-exif-row">
                  <span>ISO:</span>
                  <span>400</span>
                </div>
                <div className="modal-exif-row">
                  <span>f/</span>
                  <span>2.8</span>
                </div>
                <div className="modal-exif-row">
                  <span>Speed:</span>
                  <span>1/250s</span>
                </div>
              </div>
            </div>
            
            <div className="modal-info">
              <div className="modal-header">
                <h3 className="modal-title">{selectedProject.title}</h3>
                <span className="modal-year">{selectedProject.year}</span>
              </div>
              
              <div className="modal-client">
                <strong>Client:</strong> {selectedProject.client}
              </div>
              
              <div className="modal-description">
                <p>{selectedProject.description}</p>
              </div>
              
              <div className="modal-tags">
                {selectedProject.tags.map(tag => (
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