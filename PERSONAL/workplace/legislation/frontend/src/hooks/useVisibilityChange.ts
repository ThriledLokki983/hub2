import { useCallback, useEffect, useRef } from 'react';
const CACHE_DURATION = 5 * 60 * 1000;

const useVisibilityChange = (refetchLegislations: () => void, cacheDuration = CACHE_DURATION) => {
  const lastFetchRef = useRef(Date.now());

  const refetchIfNeeded = useCallback(() => {
    const now = Date.now();
    if (now - lastFetchRef.current > cacheDuration) {
      refetchLegislations();
      lastFetchRef.current = now;
    }
  }, [refetchLegislations, cacheDuration]);

  useEffect(() => {
    const visibilityHandler = () => {
      if (!document.hidden) {
        refetchIfNeeded();
      }
    };

    document.addEventListener('visibilitychange', visibilityHandler);
    return () => document.removeEventListener('visibilitychange', visibilityHandler);
  }, [refetchIfNeeded]);

  return refetchIfNeeded;
};

export default useVisibilityChange;
