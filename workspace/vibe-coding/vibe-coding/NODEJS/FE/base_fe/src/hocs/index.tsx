import React, { ComponentType } from 'react';
import { useParams } from 'react-router-dom';

import {
  UserContextProvider,
  AppStateContextProvider,
} from 'contexts/providers';


function withAppHocs<T>(ChildComponent: React.ComponentType<T>) {
  return (props: React.PropsWithChildren<T>) => (
    <AppStateContextProvider>
      <UserContextProvider>
        <ChildComponent {...props} />
      </UserContextProvider>
    </AppStateContextProvider>
  );
}

export default function withMainAppHocs<T>(ChildComponent: ComponentType<T>) {
  const ComponentWithHocs = withAppHocs(ChildComponent);

  return (props: T) => {
    const params = useParams();
    return <ComponentWithHocs {...props} {...params} />;
  };
}
