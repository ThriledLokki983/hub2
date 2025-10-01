import { useContext, createContext, ComponentType } from 'react';
import { useParams } from 'react-router-dom';


import { useLegislation } from 'hooks';
import { LegislationState, ContextProps } from 'hooks/interfaces';

const LegislationContext = createContext<LegislationState>({} as LegislationState);

const LegislationContextProvider = ({ children }: ContextProps) => {
  const legislation = useLegislation();

  const updatedLegislation = {
    ...legislation,
    stateDispatch: legislation.dispatch,
    stateActions: legislation.actions,
    refetch: legislation.refetchLegislations,
    isLoading: legislation.loading,
  };

  return (
    <LegislationContext.Provider value={updatedLegislation}>
      {children}
    </LegislationContext.Provider>
  );
};

const useLegislationContext = () => useContext(LegislationContext);

export { LegislationContextProvider };
export default useLegislationContext;

function withLegislationsHOC<T>(Component: React.ComponentType<T>) {
  return (props: React.PropsWithChildren<T>) => (
    <LegislationContextProvider>
      <Component {...props} />
    </LegislationContextProvider>
  );
}

export  function withLegislationHocs<T>(ChildComponent: ComponentType<T>) {
  const ComponentWithHocs = withLegislationsHOC(ChildComponent);

  return (props: T) => {
    const params = useParams();

    return <ComponentWithHocs {...props} {...params} />;
  };
}
