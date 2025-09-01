'use client'

import Image from 'next/image';
import { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  aspectRatio?: string;
}

/**
 * Component d'image optimisé pour réduire les Layout Shifts
 * Inclut des placeholders et dimensions fixes
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  loading = 'lazy',
  className = '',
  style = {},
  sizes,
  aspectRatio,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Générer un placeholder blur basé sur les dimensions
  const generateBlurDataURL = (w = 24, h = 24) => {
    return `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIABgAGAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQSITEFQVFhEyJxgQYUkbFCobHB0fAjM+EV4f/aAAwDAQACEQMRAD8A9/ooooAKKKKAP//Z`;
  };

  const containerStyle: React.CSSProperties = {
    ...style,
    position: fill ? 'relative' : style.position,
    ...(aspectRatio && { aspectRatio }),
    ...(width && height && !fill && { width, height }),
  };

  return (
    <div 
      className={`optimized-image-container ${className}`}
      style={containerStyle}
    >
      {isLoading && (
        <div 
          className="image-skeleton"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#f3f4f6',
            backgroundImage: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        loading={loading}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={generateBlurDataURL(width, height)}
        onLoadingComplete={handleLoadingComplete}
        style={{
          objectFit: 'cover',
          transition: 'opacity 0.3s ease',
          opacity: isLoading ? 0 : 1,
        }}
      />
      
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .optimized-image-container {
          overflow: hidden;
          contain: layout style paint;
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;