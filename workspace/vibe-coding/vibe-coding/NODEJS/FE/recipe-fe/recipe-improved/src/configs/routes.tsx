import { RouteObject } from 'react-router-dom';
import { ComponentType } from 'react';

import { DEVELOPMENT } from './constants';
import {
  PATH_HOME,
  PATH_LOGOUT,
  PATH_PATTERNS,
  PATH_NOT_FOUND,
} from './paths';

import Layout from 'components/Layout/Layout';
import { LazyComponentWrapper } from 'components';
import * as Pages from 'pages';
import { CustomRouteObject } from './interfaces';

// Define props interface for LazyComponent
interface LazyComponentProps {
  component: ComponentType;
}

// Wrapper component for lazy-loaded routes
const LazyComponent = ({ component: Component }: LazyComponentProps) => (
  <LazyComponentWrapper fallback={<Pages.Loading />}>
    <Component />
  </LazyComponentWrapper>
);

/**
 * Core routes.
 */
const ROUTES = [
  {
    path: PATH_HOME,
    element: <LazyComponent component={Pages.Home} />,
    isIndex: true,
    label: 'Home',
    isNav: true,
    isEnd: true,
  },
  {
    path: PATH_LOGOUT,
    title: 'Logged out',
    element: <LazyComponent component={Pages.Logout} />,
  },
];


/**
 * All routes.
 */
const ROUTES_ALL: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      ...(ROUTES.map(route => route as CustomRouteObject)),
      ...(DEVELOPMENT
        ? [
          {
            path: PATH_PATTERNS,
            element: <LazyComponent component={Pages.Patterns} />,
            isNav: true,
            title: 'Patterns',
            label: 'Patterns',
          } as CustomRouteObject,
        ]
        : []),
    ],
  },
  {
    element: <Layout />,
    children: [
      {
        path: PATH_NOT_FOUND,
        element: <LazyComponent component={Pages.NotFound} />,
        title: 'Page not found',
      } as CustomRouteObject,
    ]
  },
];

export default ROUTES_ALL;
