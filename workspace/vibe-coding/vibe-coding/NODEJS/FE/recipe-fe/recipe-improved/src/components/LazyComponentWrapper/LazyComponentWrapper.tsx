import React, { Suspense } from 'react';
import FetchLoader from '../FetchLoader/FetchLoader';
import { LazyComponentWrapperProps } from './LazyComponentWrapper.interface';

const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = ({
  children,
  fallback = <FetchLoader />
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyComponentWrapper;
