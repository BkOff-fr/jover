import React, { forwardRef } from 'react';

interface BackgroundImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Composant d'image de fond optimisé pour site de photographe
 * Utilise background-image CSS pour un rendu optimal et des performances élevées
 */
const BackgroundImage = forwardRef<HTMLDivElement, BackgroundImageProps>(({
  src,
  alt,
  className = '',
  style = {},
  children
}, ref) => {
  return (
    <div
      ref={ref}
      className={`background-image ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        ...style
      }}
      role="img"
      aria-label={alt}
    >
      {children}
    </div>
  );
});

BackgroundImage.displayName = 'BackgroundImage';

export default BackgroundImage;