'use client'

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-title">Une erreur s'est produite</h1>
        <p className="error-message">
          Désolé, une erreur inattendue s'est produite lors du chargement de la page.
        </p>
        <button
          className="error-button"
          onClick={() => reset()}
        >
          Réessayer
        </button>
      </div>

      <style jsx>{`
        .error-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-background-primary);
          padding: var(--spacing-xl);
        }

        .error-content {
          text-align: center;
          max-width: 500px;
        }

        .error-title {
          font-size: var(--h1-font-size);
          font-weight: var(--h1-font-weight);
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-lg);
        }

        .error-message {
          font-size: var(--type-body);
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-xl);
        }

        .error-button {
          padding: var(--spacing-md) var(--spacing-lg);
          background: var(--color-accent-primary);
          color: var(--color-black);
          border: none;
          border-radius: 0;
          font-size: var(--type-body);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--duration-normal) var(--easing-ease);
        }

        .error-button:hover {
          background: var(--color-accent-light);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}