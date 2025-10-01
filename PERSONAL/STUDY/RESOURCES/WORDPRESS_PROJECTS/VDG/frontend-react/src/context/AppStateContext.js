import React, { useContext, createContext } from 'react';
import { useAppState } from '../hooks';

const AppStateContext = createContext();

const AppStateContextProvider = ({ children }) => {
    const appState = useAppState();

    return (
        <AppStateContext.Provider value={appState}>
            {children}
        </AppStateContext.Provider>
    );
};

const useAppStateContext = () => useContext(AppStateContext);

export { AppStateContextProvider };
export default useAppStateContext;
