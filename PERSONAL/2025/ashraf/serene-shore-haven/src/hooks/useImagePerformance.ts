import { useEffect } from 'react';

interface PerformanceMetrics {
  imageLoadTime?: number;
  totalLoadTime?: number;
  imageSize?: number;
}

export const useImagePerformance = (imageSrc: string) => {
  useEffect(() => {
    const startTime = performance.now();

    const img = new Image();

    img.onload = () => {
      const loadTime = performance.now() - startTime;

      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Image Performance: ${imageSrc}`, {
          loadTime: `${loadTime.toFixed(2)}ms`,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(2)
        });
      }

      // You could send this data to analytics
      // analytics.track('image_loaded', { src: imageSrc, loadTime });
    };

    img.onerror = () => {
      console.warn(`Failed to load image: ${imageSrc}`);
    };

    img.src = imageSrc;
  }, [imageSrc]);
};

export default useImagePerformance;
