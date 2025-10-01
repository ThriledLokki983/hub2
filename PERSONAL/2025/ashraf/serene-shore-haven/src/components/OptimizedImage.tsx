import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  sizes = '100vw',
  priority = false,
  placeholder = '/placeholder.svg',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${currentSrc}`);
    if (currentSrc !== placeholder) {
      setCurrentSrc(placeholder);
    } else {
      setHasError(true);
    }
    onError?.();
  };

  // Create srcSet for responsive images
  const createSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('/images/optimized/')) return '';

    const baseName = baseSrc.split('/').pop()?.replace('.jpg', '') || '';
    const thumbnailSrc = baseSrc.replace('/optimized/', '/thumbnails/');

    return `${thumbnailSrc} 400w, ${baseSrc} 1920w`;
  };

  const srcSet = createSrcSet(src);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <span className="text-xs text-gray-500">Loading...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full mb-2 mx-auto" />
            <span className="text-xs text-gray-500">Image unavailable</span>
          </div>
        </div>
      )}

      {/* Main image with responsive loading */}
      <img
        src={currentSrc}
        srcSet={srcSet || undefined}
        sizes={sizes}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        )}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
        style={{
          willChange: 'transform, opacity'
        }}
      />

      {/* Performance hint for critical images */}
      {priority && (
        <link rel="preload" as="image" href={src} />
      )}
    </div>
  );
};

export default OptimizedImage;