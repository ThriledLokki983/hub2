import { useSyncExternalStore } from "react";

const useOnlineOffline = () => {
  const subscribe = (callback: () => void) => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);

    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  };

  const getSnapshot = () => window.navigator.onLine;

  return useSyncExternalStore(subscribe, getSnapshot);
};

export default useOnlineOffline;
