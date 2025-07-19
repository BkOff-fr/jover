import React, { useRef, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface ContactSectionProps {
  id: string;
  scrollManagerRef?: React.RefObject<any>;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  budget: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ id, scrollManagerRef }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const { scrollProgress, activeSection } = useAppContext();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Animation du formulaire basée sur activeSection (intégré au système Lenis)
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    // Si la section contact est active ou proche, animer le formulaire
    if (activeSection === 'contact' || scrollProgress > 0.8) {
      form.classList.add('visible');
    }
  }, [activeSection, scrollProgress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulation d'envoi - remplacer par votre logique d'envoi réelle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: '',
        budget: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id={id} className="contact-section" ref={sectionRef}>
      <div className="contact-container">
        
        {/* En-tête de section */}
        <div className="contact-header">
          <h2 className="contact-title">Travaillons Ensemble</h2>
          <p className="contact-subtitle">
            Prêt à capturer vos moments précieux ? Contactez-moi pour discuter de votre projet photographique.
          </p>
        </div>

        <div className="contact-content">
          
          {/* Informations de contact */}
          <div className="contact-info">
            <div className="contact-card">
              <h3 className="contact-card-title">Informations de Contact</h3>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <span className="contact-label">Téléphone</span>
                  <a href="tel:+33123456789" className="contact-value">+33 1 23 45 67 89</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <a href="mailto:contact@jover-photo.com" className="contact-value">contact@jover-photo.com</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <span className="contact-label">Localisation</span>
                  <span className="contact-value">Lille, France</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <span className="contact-label">Disponibilité</span>
                  <span className="contact-value">7j/7 - Interventions France entière</span>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="social-links">
              <h4 className="social-title">Suivez-moi</h4>
              <div className="social-grid">
                <a href="https://instagram.com/jover.photo" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  <span>Instagram</span>
                </a>
                <a href="https://linkedin.com/in/jover-photo" className="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
                <a href="https://facebook.com/jover.photo" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
            <h3 className="form-title">Décrivez votre projet</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="Votre nom et prénom"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="votre@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectType" className="form-label">
                  Type de projet *
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="portrait">Portrait</option>
                  <option value="mariage">Mariage</option>
                  <option value="evenement">Événement</option>
                  <option value="corporate">Corporate</option>
                  <option value="mode">Mode</option>
                  <option value="produit">Produit</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budget" className="form-label">
                  Budget estimé
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Budget non défini</option>
                  <option value="500-1000">500€ - 1000€</option>
                  <option value="1000-2500">1000€ - 2500€</option>
                  <option value="2500-5000">2500€ - 5000€</option>
                  <option value="5000+">5000€+</option>
                </select>
              </div>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="message" className="form-label">
                Décrivez votre projet *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="form-textarea"
                rows={6}
                required
                placeholder="Décrivez votre projet en détail : date, lieu, nombre de personnes, style souhaité, etc."
              />
            </div>

            <div className="form-footer">
              <button
                type="submit"
                className="form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="submit-spinner" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                    Envoyer la demande
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="form-message form-message-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                  </svg>
                  Merci ! Votre message a été envoyé avec succès.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="form-message form-message-error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  Une erreur s'est produite. Veuillez réessayer.
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;