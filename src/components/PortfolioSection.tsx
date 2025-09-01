'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { initGSAP, createSafeScrollTrigger, safeGsapTimeline, cleanupGSAP, safeGsapSet } from '../utils/gsapConfig';
import { isBuildMode } from '../utils/buildSafeAnimations';
import '../styles/portfolio.css';

interface PortfolioProject {
  id: number;
  image: string;
  images: string[];
  title: string;
  category: 'portrait' | 'mode' | 'produit';
  year: number;
  client: string;
  description: string;
  tags: string[];
}

type PortfolioFilter = 'all' | 'portrait' | 'mode' | 'produit';

interface PortfolioSectionProps {
  id?: string;
  scrollManagerRef?: React.RefObject<HTMLElement>;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ id = "portfolio", scrollManagerRef }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [cardImageIndices, setCardImageIndices] = useState<{[key: number]: number}>({});
  const [activeFilter, setActiveFilter] = useState<PortfolioFilter>('all');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [itemsPerSlide, setItemsPerSlide] = useState<number>(3);
  const [isCarouselMode, setIsCarouselMode] = useState<boolean>(false);
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const animationRefs = useRef<any[]>([]);
  const scrollPositionRef = useRef<number>(0);

  // Portfolio projects data
  const projectsData = useMemo<PortfolioProject[]>(() => [
    {
      id: 1,
      image: "/images/portfolio/project-2.jpg",
      images: ["/images/portfolio/project-2.jpg", "/images/portfolio/project-3.jpg", "/images/portfolio/project-4.jpg"],
      title: "Instants Bruts",
      category: "portrait",
      year: 2024,
      client: "Série personnelle",
      description: "Capturer l'instant sans artifices, révéler la sincérité d'un geste spontané. Chaque portrait raconte une histoire authentique, loin des conventions, dans la pure tradition de la photographie humaniste.",
      tags: ["Authenticité", "Spontané", "Humaniste"]
    },
    {
      id: 2,
      image: "/images/portfolio/project-3.jpg",
      images: ["/images/portfolio/project-3.jpg"],
      title: "Visions Graphiques",
      category: "mode",
      year: 2024,
      client: "Création artistique",
      description: "Composer comme un tableau cinématographique. Lignes, textures, contrastes se mêlent pour créer une imagerie qui brise les codes, explore la symétrie et l'asymétrie avec audace.",
      tags: ["Cinématographique", "Composition", "Graphique"]
    },
    {
      id: 3,
      image: "/images/portfolio/project-4.jpg",
      images: ["/images/portfolio/project-4.jpg", "/images/portfolio/project-2.jpg"],
      title: "Expérimentations Créatives",
      category: "produit",
      year: 2023,
      client: "Recherche personnelle",
      description: "Flous artistiques, reflets inattendus, surimpressions poétiques. Cette série explore les limites de la photographie traditionnelle pour proposer une imagerie audacieuse qui transcende les conventions.",
      tags: ["Expérimental", "Créatif", "Avant-garde"]
    },
    {
      id: 4,
      image: "/images/portfolio/project-1.jpg",
      images: ["/images/portfolio/project-1.jpg"],
      title: "Portraits Intimes",
      category: "portrait",
      year: 2024,
      client: "Collection privée",
      description: "Une série de portraits capturés dans l'intimité, révélant la vulnérabilité et la force de caractère de chaque sujet.",
      tags: ["Intimité", "Émotion", "Caractère"]
    },
    {
      id: 5,
      image: "/images/portfolio/project-3.jpg",
      images: ["/images/portfolio/project-3.jpg"],
      title: "Mode Urbaine",
      category: "mode",
      year: 2023,
      client: "Studio créatif",
      description: "La mode rencontre l'architecture urbaine dans cette série qui explore les contrastes entre le humain et la ville.",
      tags: ["Urbain", "Architecture", "Style"]
    },
    {
      id: 6,
      image: "/images/portfolio/project-4.jpg",
      images: ["/images/portfolio/project-4.jpg"],
      title: "Objets d'Art",
      category: "produit",
      year: 2024,
      client: "Galerie moderne",
      description: "Mise en valeur d'objets d'art contemporain avec un éclairage sculpté et des angles novateurs.",
      tags: ["Art", "Lumière", "Sculpture"]
    }
  ], []);

  // Available filters
  const filters = useMemo(() => [
    { id: 'all' as PortfolioFilter, label: 'Tous', count: projectsData.length },
    { id: 'portrait' as PortfolioFilter, label: 'Portrait', count: projectsData.filter(p => p.category === 'portrait').length },
    { id: 'mode' as PortfolioFilter, label: 'Mode', count: projectsData.filter(p => p.category === 'mode').length },
    { id: 'produit' as PortfolioFilter, label: 'Produit', count: projectsData.filter(p => p.category === 'produit').length }
  ], [projectsData]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    const filtered = activeFilter === 'all' 
      ? projectsData 
      : projectsData.filter(project => project.category === activeFilter);
    
    setIsCarouselMode(filtered.length > 3);
    return filtered;
  }, [projectsData, activeFilter]);

  // Visible projects for carousel
  const visibleProjects = useMemo(() => {
    if (!isCarouselMode) {
      return filteredProjects;
    }
    
    const startIndex = currentSlide * itemsPerSlide;
    return filteredProjects.slice(startIndex, startIndex + itemsPerSlide);
  }, [filteredProjects, currentSlide, itemsPerSlide, isCarouselMode]);

  // Carousel navigation
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

  // Reset slide on filter change
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeFilter]);

  // Responsive items per slide
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

  // GSAP Animation for projects
  useEffect(() => {
    if (isBuildMode()) return;

    (async () => {
      // Import dynamique de gsap et ScrollTrigger
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const gsapReady = initGSAP();
      if (!gsapReady) return;
      const section = sectionRef.current;
      if (!section) return;

      // Clear previous animations
      animationRefs.current.forEach(animation => animation.kill());
      animationRefs.current = [];

      // Section entrance animation
      const sectionTrigger = createSafeScrollTrigger({
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
            safeGsapSet(project, {
              opacity: Math.max(0.1, elementProgress),
              y: (1 - elementProgress) * 50,
              scale: 0.9 + (elementProgress * 0.1)
            });
          });
        }
      });
      if (sectionTrigger) {
        animationRefs.current.push(sectionTrigger);
      }
    })();

    return () => {
      cleanupGSAP();
      animationRefs.current = [];
    };
  }, [visibleProjects]);

  // Block scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  const handleFilterClick = (filter: PortfolioFilter): void => {
    setActiveFilter(filter);
  };

  const handleProjectClick = (project: PortfolioProject): void => {
    scrollPositionRef.current = window.scrollY;
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const handleCloseModal = (): void => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
    setTimeout(() => {
      window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' });
    }, 10);
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
    <section id={id} ref={sectionRef} className="portfolio-section">
      <div className="portfolio-interface">
        
        {/* Header with contact sheet style */}
        <div className="portfolio-header">
          <div className="portfolio-title">
            <h2>Portfolio Photographique</h2>
            <p className="portfolio-subtitle">
              Visions artistiques, instants décisifs, expérimentations créatives
            </p>
          </div>
          
          {/* Camera-style filters */}
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

        {/* Carousel navigation */}
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

        {/* Contact sheet style grid */}
        <div className={`portfolio-grid ${isCarouselMode ? 'carousel-mode' : ''} ${isChanging ? 'changing' : ''}`} ref={portfolioRef}>
          {visibleProjects.map((project, index) => (
            <div 
              key={project.id}
              className="portfolio-project"
              onClick={() => handleProjectClick(project)}
            >
              <div className="frame-number">{`${String(index + 1).padStart(2, '0')}/24`}</div>
              <div className="project-image-container">
                <div className="project-image">
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    priority={project.title === 'Instants Bruts'}
                    className="portfolio-image"
                    loading={project.title === 'Instants Bruts' ? undefined : 'lazy'}
                  />
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
                
                {/* Image selector for multiple images */}
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
      
      {/* Professional lightbox modal */}
      {selectedProject && (
        <div className="project-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-image">
              <Image 
                src={selectedProject.images[currentImageIndex]} 
                alt={selectedProject.title}
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                className="modal-image-content"
                loading="lazy"
              />
              
              {/* Image navigation for multiple images */}
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
              
              {/* EXIF data */}
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

      <style jsx>{`
        .portfolio-section {
          min-height: 100vh;
          padding: var(--section-padding);
          background: transparent;
        }

        .portfolio-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--spacing-xl);
        }

        .portfolio-header {
          text-align: center;
          margin-bottom: var(--spacing-xxxl);
        }

        .section-title {
          font-size: var(--h2-font-size);
          font-weight: var(--h2-font-weight);
          color: var(--h2-color);
          margin-bottom: var(--h2-margin-bottom);
          text-transform: var(--h2-text-transform);
          letter-spacing: var(--h2-letter-spacing);
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        .section-subtitle {
          font-size: var(--p-font-size);
          font-weight: var(--p-font-weight);
          color: var(--p-color);
          line-height: var(--p-line-height);
          max-width: 600px;
          margin: 0 auto;
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        .filter-buttons {
          display: flex;
          justify-content: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xxxl);
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: var(--spacing-sm) var(--spacing-lg);
          background: transparent;
          border: 2px solid var(--color-border);
          border-radius: 0;
          color: var(--color-text-secondary);
          font-size: var(--type-small);
          font-weight: var(--font-weight-medium);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-tight);
          cursor: pointer;
          transition: all var(--duration-normal) var(--easing-ease);
        }

        .filter-btn:hover,
        .filter-btn.active {
          background: var(--color-accent-primary);
          border-color: var(--color-accent-primary);
          color: var(--color-black);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--spacing-xl);
        }

        .project-card {
          background: var(--color-background-secondary);
          border: 2px solid var(--color-border);
          border-radius: 0;
          overflow: hidden;
          transition: all var(--duration-normal) var(--easing-ease);
          backdrop-filter: blur(10px);
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-accent-primary);
        }

        .project-image {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
        }

        .project-info {
          padding: var(--spacing-lg);
        }

        .project-title {
          font-size: var(--h4-font-size);
          font-weight: var(--h4-font-weight);
          color: var(--h4-color);
          margin-bottom: var(--spacing-sm);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-tight);
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        .project-description {
          font-size: var(--type-small);
          color: var(--color-text-muted);
          line-height: 1.5;
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        @media (max-width: 768px) {
          .portfolio-section {
            padding: var(--section-padding-mobile);
          }

          .portfolio-content {
            padding: 0 var(--spacing-lg);
          }

          .projects-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }

          .filter-buttons {
            gap: var(--spacing-sm);
          }

          .filter-btn {
            padding: var(--spacing-xs) var(--spacing-md);
            font-size: var(--type-caption);
          }
        }

        @media (max-width: 480px) {
          .portfolio-section {
            padding: var(--section-padding-small);
          }

          .portfolio-content {
            padding: 0 var(--spacing-md);
          }

          .project-info {
            padding: var(--spacing-md);
          }
        }
      `}</style>
    </section>
  );
};

export default PortfolioSection;