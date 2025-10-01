import { createContext, useContext } from 'react';
import { useUser } from 'hooks';
import { UserDataInterface, ContextProps } from 'hooks/interfaces';
import { USER_DEFAULTS } from 'data/user';

const UserContext = createContext<UserDataInterface>(USER_DEFAULTS);

const UserContextProvider = ({ children }: ContextProps) => {
  const userData = useUser();

  // Validate user data before providing it to the context
  const isValidUserData = (data: UserDataInterface): boolean => {
    if (!data || typeof data !== 'object') return false;
    
    // Check for required methods
    if (typeof data.login !== 'function' || typeof data.logout !== 'function') {
      return false;
    }

    // Check if user object has valid structure when present
    if (data.user && typeof data.user.authenticated !== 'boolean') {
      return false;
    }

    if (data.user?.profile && typeof data.user.profile.id !== 'string') {
      return false;
    }

    return true;
  };

  // If data is invalid, use defaults
  const safeUserData = isValidUserData(userData) ? userData : USER_DEFAULTS;

  return <UserContext.Provider value={safeUserData}>{children}</UserContext.Provider>;
};

const useUserContext = () => useContext(UserContext);

export { UserContextProvider };
export default useUserContext;
