import { createContext, useContext } from 'react';

import { useUser } from 'hooks';
import { UserDataInterface, ContextProps } from 'hooks/interfaces';


const UserContext = createContext<UserDataInterface>({} as UserDataInterface);

const UserContextProvider = ({ children }: ContextProps) => {
  const userData = useUser();

  return (
    <UserContext.Provider value={userData}>
      { children }
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export { UserContextProvider };
export default useUserContext;
