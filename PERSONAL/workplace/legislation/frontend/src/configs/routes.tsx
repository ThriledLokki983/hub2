import { RouteObject } from 'react-router-dom';

import { DEVELOPMENT } from './constants';
import {
  PATH_ACCESS,
  PATH_HOME,
  PATH_LOGOUT,
  PATH_PATTERNS,
  PATH_NOT_FOUND,
  PATH_SETTINGS,
  PATH_NAVIGATOR,
  PATH_LEGISLATION,
  PATH_SERVER_ERROR,
  PATH_LEGISLATION_ALL,
  PATH_NAVIGATOR_LANDING,
  PATH_ROLE_BASED_NAVIGATOR,
  PATH_LEGISLATION_DETAILS,
  PATH_LEGISLATION_EDIT,
  PATH_PROJECTS,
  PATH_PROJECTS_ALL,
  PATH_PROJECT_DETAILS,
  PATH_PROJECT_EDIT,
  PATH_PROJECT_LOGS,
  PATH_LOGIN_FAIL,
  PATH_LEGISLATION_LOGS,
} from './paths';

import Layout from 'components/Layout/Layout';
import LegislationLayout from 'components/Layout/Legislation/LegislationLayout';
import NavigatorLayout from 'components/Layout/Navigator/NavigatorLayout';
import FullPageLayout from 'components/Layout/FullPageLayout/FullPageLayout';
import * as Pages from 'pages';
import { CustomRouteObject } from './interfaces';
import path from 'path';


/**
 * Core routes.
 */
const ROUTES = [
  {
    path: PATH_ACCESS,
    element: <Pages.Access />,
    isIndex: false,
    title: 'Access',
    isNav: false,
    isEnd: false,
  },
  {
    path: PATH_HOME,
    element: <Pages.Home />,
    isIndex: true,
    title: 'Home',
    label: 'Onboarding',
    isNav: false,
    isEnd: true,
  },
  {
    path: PATH_NAVIGATOR,
    element: <NavigatorLayout />,
    title: 'Navigator',
    label: 'Navigator',
    icon: 'CompassIcon',
    isNav: true,
    isEnd: false,
    children: [
      {
        path: PATH_NAVIGATOR_LANDING,
        element: <Pages.NavigatorLanding />,
        title: 'Filter Legislation',
      },
      {
        path: PATH_ROLE_BASED_NAVIGATOR,
        element: <Pages.NavigatorRoleBased />,
        title: 'Role based Navigator',
      },
    ]
  },
  {
    path: PATH_LEGISLATION,
    element: <LegislationLayout />,
    title: 'Legislation',
    label: 'Legislation',
    icon: 'NoteIcon',
    isNav: true,
    isEnd: false, // This is a parent route. It has children.
    children: [
      {
        path: PATH_LEGISLATION_ALL,
        element: <Pages.Legislation />,
        title: 'All Legislations',
      },
      {
        path: PATH_LEGISLATION_DETAILS,
        element: <Pages.LegislationDetails />,
        title: 'Legislation Details',
      },
      {
        path: PATH_LEGISLATION_EDIT,
        element: <Pages.Legislation />,
        title: 'Edit Legislation',
      },
      {
        path: PATH_LEGISLATION_LOGS,
        element: <Pages.LegislationLogs />,
        title: 'Legislation Logs',
      }
    ],
  },
  {
    path: PATH_PROJECTS,
    element: <FullPageLayout />,
    title: 'Projects',
    label: 'Projects',
    icon: 'Projects',
    isNav: true,
    isEnd: false,
    children: [
      {
        path: PATH_PROJECTS_ALL,
        element: <Pages.Projects />,
        title: 'All Projects',
      },
      {
        path: PATH_PROJECT_DETAILS,
        element: <Pages.ProjectDetails />,
        title: 'Project Details',
      },
      {
        path: PATH_PROJECT_EDIT,
        element: <Pages.ProjectEdit />,
        title: 'Project Details',
      },
      {
        path: PATH_PROJECT_LOGS,
        element: <Pages.ProjectLogs />,
        title: 'Project Logs',
      },
    ],

  },
  {
    path: PATH_SETTINGS,
    element: <Pages.ProfileSettings />,
    title: 'Settings',
    label: 'Settings',
  },
  {
    path: PATH_LOGOUT,
    title: 'Logged out',
    element: <Pages.Login />,
  },
  {
    path: PATH_LOGIN_FAIL,
    element: <Pages.FailedLogin />,
    title: 'Logged out Fail',
    isIndex: false,
    isNav: false,
    isEnd: false,
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
            icon: 'Legislation'
          } as CustomRouteObject,
        ]
        : []),
    ],
  },
  {
    element: <Layout />,
    children: [
      {
        path: PATH_SERVER_ERROR,
        element: <Pages.ServerError />,
        title: 'Server error',
      } as CustomRouteObject,
      {
        path: PATH_NOT_FOUND,
        element: <Pages.NotFound />,
        title: 'Page not found',
      } as CustomRouteObject,
    ]
  },
];

export default ROUTES_ALL;
