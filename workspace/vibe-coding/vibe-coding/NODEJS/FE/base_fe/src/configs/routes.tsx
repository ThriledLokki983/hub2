import { RouteObject } from 'react-router-dom';

import { DEVELOPMENT } from './constants';
import {
  PATH_HOME,
  PATH_LOGOUT,
  PATH_PATTERNS,
  PATH_NOT_FOUND,
} from './paths';

import Layout from 'components/Layout/Layout';
import * as Pages from 'pages';
import { CustomRouteObject } from './interfaces';


/**
 * Core routes.
 */
const ROUTES = [
  {
    path: PATH_HOME,
    element: <Pages.Home />,
    isIndex: true,
    label: 'Home',
    isNav: true,
    isEnd: true,
  },
  {
    path: PATH_LOGOUT,
    title: 'Logged oout',
    element: <Pages.Logout />,
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
            element: <Pages.Patterns />,
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
        element: <Pages.NotFound />,
        title: 'Page not found',
      } as CustomRouteObject,
    ]
  },
];

export default ROUTES_ALL;
