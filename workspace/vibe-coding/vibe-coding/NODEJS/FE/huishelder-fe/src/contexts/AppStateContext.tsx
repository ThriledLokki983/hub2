import { useContext, createContext } from 'react';

import { useAppState } from 'hooks';
import { AppState, ContextProps } from 'hooks/interfaces';

const AppStateContext = createContext<AppState>({} as AppState);

const AppStateContextProvider = ({ children }: ContextProps) => {
  const appState = useAppState();

  return <AppStateContext.Provider value={appState}>{children}</AppStateContext.Provider>;
};

const useAppStateContext = () => useContext(AppStateContext);

export { AppStateContextProvider };
export default useAppStateContext;
