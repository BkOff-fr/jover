'use client'

import React, { useRef, useState } from 'react';
import '../styles/contact.css';

interface ContactSectionProps {
  id?: string;
  scrollManagerRef?: React.RefObject<HTMLElement>;
}

const ContactSection: React.FC<ContactSectionProps> = ({ id = "contact", scrollManagerRef }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const ref = scrollManagerRef || sectionRef;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    // Form submission handling
  };

  return (
    <section id={id} ref={ref} className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">CONTACT</h2>
          <p className="contact-subtitle">
            Prêt à donner vie à votre projet ? Contactez-moi pour en discuter.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <h3 className="contact-card-title">Informations</h3>
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <a href="mailto:contact@jover-photo.com" className="contact-value">
                    contact@jover-photo.com
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div className="contact-details">
                  <span className="contact-label">Téléphone</span>
                  <a href="tel:+33123456789" className="contact-value">
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <span className="contact-label">Localisation</span>
                  <span className="contact-value">Paris, France</span>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h3 className="social-title">Suivez-moi</h3>
              <div className="social-grid">
                <a href="#" className="social-link">
                  📷 Instagram
                </a>
                <a href="#" className="social-link">
                  💼 LinkedIn
                </a>
                <a href="#" className="social-link">
                  🎨 Behance
                </a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h3 className="form-title">Envoyez-moi un message</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nom</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="subject" className="form-label">Type de projet</label>
              <select
                id="subject"
                name="subject"
                className="form-select"
                value={formData.subject}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="portrait">Portrait</option>
                <option value="corporate">Corporate</option>
                <option value="event">Événement</option>
                <option value="fashion">Mode</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                className="form-textarea"
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Décrivez votre projet, vos besoins et vos attentes..."
                required
              />
            </div>

            <div className="form-footer">
              <button type="submit" className="form-submit btn-primary">
                Envoyer le message
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .contact-section {
          min-height: 100vh;
          padding: var(--section-padding);
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .contact-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--spacing-xl);
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .contact-header {
          text-align: center;
          margin-bottom: var(--spacing-xxxl);
          position: relative;
        }

        .contact-title {
          font-size: var(--h2-font-size);
          font-weight: var(--h2-font-weight);
          letter-spacing: var(--h2-letter-spacing);
          text-transform: var(--h2-text-transform);
          color: var(--color-text-dark);
          margin-bottom: var(--spacing-lg);
          line-height: 1.2;
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        body.dark-theme .contact-title {
          color: var(--color-text-light);
        }

        .contact-subtitle {
          font-size: var(--type-body);
          color: var(--color-text-dark);
          line-height: var(--p-line-height);
          max-width: 600px;
          margin: 0 auto;
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        body.dark-theme .contact-subtitle {
          color: var(--color-text-light);
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: var(--spacing-xxxl);
          align-items: start;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xxl);
        }

        .contact-card,
        .social-links {
          background: var(--color-background-secondary);
          border: 2px solid var(--color-border);
          border-radius: 0;
          padding: var(--spacing-xl);
          backdrop-filter: blur(10px);
          transition: all var(--duration-slowest) var(--easing-ease);
          box-shadow: 
            0 8px 25px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }

        .contact-card:hover,
        .social-links:hover {
          border-color: var(--color-accent-primary);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .contact-card-title,
        .social-title {
          font-size: var(--type-subheading);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-dark);
          margin-bottom: var(--spacing-lg);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-tight);
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        body.dark-theme .contact-card-title,
        body.dark-theme .social-title {
          color: var(--color-text-light);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .contact-item:last-child {
          margin-bottom: 0;
        }

        .contact-icon {
          width: 48px;
          height: 48px;
          background: 
            linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-light)),
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%);
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--btn-primary-color);
          flex-shrink: 0;
          transition: all var(--duration-normal) var(--easing-ease);
          box-shadow: 
            0 4px 12px rgba(30,185,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative;
          z-index: 1;
        }

        .contact-icon:hover {
          transform: scale(1.1);
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .contact-label {
          font-size: var(--type-small);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-dark);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-wide);
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        body.dark-theme .contact-label {
          color: var(--color-text-light);
        }

        .contact-value {
          font-size: var(--type-body);
          font-weight: var(--font-weight-normal);
          color: var(--color-text-dark);
          text-decoration: none;
          transition: all var(--duration-normal) var(--easing-ease);
        }

        body.dark-theme .contact-value {
          color: var(--color-text-light);
        }

        .contact-value:hover {
          color: var(--color-accent-primary);
          text-decoration: underline;
        }

        .social-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-md);
          color: var(--color-text-dark);
          text-decoration: none;
          border-radius: 0;
          transition: all var(--duration-normal) var(--easing-ease);
          font-weight: var(--font-weight-medium);
        }

        body.dark-theme .social-link {
          color: var(--color-text-light);
        }

        .social-link:hover {
          background: var(--color-hover);
          color: var(--color-accent-primary);
          transform: translateX(8px);
        }

        .contact-form {
          background: var(--color-background-secondary);
          border: 3px solid var(--color-border);
          border-radius: 0;
          padding: var(--spacing-xl);
          backdrop-filter: blur(20px);
          transition: all var(--duration-slower) var(--easing-ease);
          box-shadow: 
            0 15px 40px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }

        .form-title {
          font-size: var(--type-subheading);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-dark);
          margin-bottom: var(--spacing-lg);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-tight);
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        body.dark-theme .form-title {
          color: var(--color-text-light);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .form-group-full {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: var(--type-small);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-dark);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-wide);
          transition: color var(--duration-slowest) var(--easing-ease);
        }

        body.dark-theme .form-label {
          color: var(--color-text-light);
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: var(--spacing-md);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.3);
          color: var(--color-text-dark);
          font-size: var(--type-body);
          font-family: var(--font-family);
          font-weight: var(--font-weight-light);
          transition: all var(--duration-normal) var(--easing-ease);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
          letter-spacing: 0.5px;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 3px var(--color-hover);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: var(--color-gray-500);
        }

        body.dark-theme .form-input::placeholder,
        body.dark-theme .form-textarea::placeholder {
          color: var(--color-gray-400);
        }

        body.dark-theme .form-input,
        body.dark-theme .form-select,
        body.dark-theme .form-textarea {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          color: var(--color-text-light);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-footer {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          align-items: center;
        }

        .form-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          min-height: var(--btn-min-height);
          padding: var(--btn-padding-md);
          border: var(--btn-border-width) solid var(--btn-primary-border);
          border-radius: var(--btn-border-radius);
          font-family: var(--btn-font-family);
          font-size: var(--btn-font-size);
          font-weight: var(--btn-font-weight);
          text-transform: var(--btn-text-transform);
          letter-spacing: var(--btn-letter-spacing);
          cursor: pointer;
          transition: var(--btn-transition);
          position: relative;
          overflow: hidden;
          min-width: 200px;
          background: var(--btn-primary-bg);
          color: var(--btn-primary-color);
          box-shadow: var(--shadow-md);
        }

        .form-submit:hover:not(:disabled) {
          background: var(--color-accent-light);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .form-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        body.dark-theme .form-submit {
          color: var(--color-text-light);
        }

        @media (max-width: 1024px) {
          .contact-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-xxl);
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .contact-section {
            padding: var(--section-padding-mobile);
          }
          
          .contact-container {
            padding: 0 var(--spacing-lg);
          }
          
          .contact-header {
            margin-bottom: var(--spacing-xxl);
          }
          
          .contact-content {
            gap: var(--spacing-xl);
          }
          
          .contact-card,
          .social-links,
          .contact-form {
            padding: var(--spacing-lg);
          }
          
          .form-grid {
            gap: var(--spacing-md);
          }
          
          .contact-icon {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .contact-section {
            padding: var(--section-padding-small);
          }
          
          .contact-container {
            padding: 0 var(--spacing-md);
          }
          
          .contact-card,
          .social-links,
          .contact-form {
            padding: var(--spacing-md);
          }
          
          .form-submit {
            padding: var(--btn-padding-sm);
            min-width: 180px;
            min-height: 40px;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactSection;