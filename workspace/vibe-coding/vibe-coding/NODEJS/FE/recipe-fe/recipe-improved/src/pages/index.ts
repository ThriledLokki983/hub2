import { lazy } from 'react';

// Use React.lazy for code splitting
const Home = lazy(() => import('./Home/Home'));
const Logout = lazy(() => import('./Logout/Logout'));
const NotFound = lazy(() => import('./NotFound/NotFound'));
const Patterns = lazy(() => import('./Patterns/Patterns'));

// Import Loading component eagerly as it's used for Suspense fallback
import Loading from './Loading/Loading';

export {
  Home,
  Logout,
  Loading,
  NotFound,
  Patterns,
};
