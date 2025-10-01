import { useContext, createContext } from "react";
import { useParams } from "react-router-dom";

import { useNavigator } from 'hooks';
import { NavigatorState } from "hooks/interfaces/navigator.interface";
import { ContextProps } from "hooks/interfaces";

const NavigatorContext = createContext<NavigatorState>({} as NavigatorState);

const NavigatorContextProvider = ({ children }: ContextProps) => {
  const navigator = useNavigator();

  const updatedNavigator = {
    ...navigator,
    stateDispatch: navigator.dispatch,
    stateActions: navigator.actions,
    refetch: navigator.refetchLegislations,
  };

  return (
    <NavigatorContext.Provider value={updatedNavigator}>
      {children}
    </NavigatorContext.Provider>
  );
};

const useNavigatorContext = () => useContext(NavigatorContext);

export { NavigatorContextProvider };
export default useNavigatorContext;

function withNavigatorHOC<T>(Component: React.ComponentType<T>) {
  return (props: React.PropsWithChildren<T>) => (
    <NavigatorContextProvider>
      <Component {...props} />
    </NavigatorContextProvider>
  );
}

export function withNavigatorHocs<T>(ChildComponent: React.ComponentType<T>) {
  const ComponentWithHocs = withNavigatorHOC(ChildComponent);

  return (props: T) => {
    const params = useParams();

    return <ComponentWithHocs {...props} {...params} />;
  };
}
