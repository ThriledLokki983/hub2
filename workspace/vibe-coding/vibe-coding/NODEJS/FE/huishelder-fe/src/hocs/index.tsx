import React, { ComponentType } from 'react';
import { useParams } from 'react-router-dom';

import { UserContextProvider, AppStateContextProvider } from 'contexts/providers';

function withAppHocs<T>(ChildComponent: React.ComponentType<T>) {
  const WithAppHocs = (props: React.PropsWithChildren<T>) => (
    <AppStateContextProvider>
      <UserContextProvider>
        <ChildComponent {...props} />
      </UserContextProvider>
    </AppStateContextProvider>
  );

  WithAppHocs.displayName = `WithAppHocs(${ChildComponent.displayName || ChildComponent.name || 'Component'})`;
  return WithAppHocs;
}

export default function withMainAppHocs<T>(ChildComponent: ComponentType<T>) {
  const ComponentWithHocs = withAppHocs(ChildComponent);

  const WithMainAppHocs = (props: T) => {
    const params = useParams();
    return <ComponentWithHocs {...props} {...params} />;
  };

  WithMainAppHocs.displayName = `WithMainAppHocs(${ChildComponent.displayName || ChildComponent.name || 'Component'})`;
  return WithMainAppHocs;
}
