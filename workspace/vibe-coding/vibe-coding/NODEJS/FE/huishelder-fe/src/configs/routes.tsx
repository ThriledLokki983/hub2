import { RouteObject } from 'react-router-dom';

import { DEVELOPMENT } from './constants';
import {
  PATH_PATTERNS,
  PATH_NOT_FOUND,
  PATH_PROFILE,
  PATH_SETTINGS,
  PATH_MY_PROPERTIES,
  PATH_TIMELINE,
  PATH_ENHANCED_TIMELINE,
  PATH_JOURNEY_DASHBOARD,
  PATH_FINANCIAL_DASHBOARD,
} from './paths';

import Layout from 'components/Layout/Layout';
import { ProtectedRoute, AuthGuard } from 'components';
import * as Pages from 'pages';
import { CustomRouteObject } from './interfaces';

/**
 * All routes.
 */
const ROUTES_ALL: RouteObject[] = [
  // Public Auth routes with nested structure, protected by AuthGuard
  // AuthGuard prevents authenticated users from accessing these pages
  {
    path: 'auth',
    element: <AuthGuard />,
    children: [
      {
        path: 'login',
        element: <Pages.Login />,
        title: 'Login',
      } as CustomRouteObject,
      {
        path: 'signup',
        element: <Pages.Signup />,
        title: 'Create Account',
      } as CustomRouteObject,
      {
        path: 'reset-password',
        element: <Pages.ResetPassword />,
        title: 'Reset Password',
      } as CustomRouteObject,
      {
        path: 'logout',
        element: <Pages.Logout />,
        title: 'Successfully Logged Out',
      } as CustomRouteObject,
    ],
  },

  // Main application routes with Layout
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Pages.Home />,
            title: 'Home',
          } as CustomRouteObject,
        ],
      },

      {
        path: PATH_PROFILE,
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Pages.Profile />,
            title: 'My Profile',
          } as CustomRouteObject,
        ],
      },

      {
        path: PATH_SETTINGS,
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Pages.Settings />,
            title: 'Settings',
          } as CustomRouteObject,
        ],
      },

      {
        path: PATH_MY_PROPERTIES,
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Pages.Properties />,
            title: 'My Properties',
          } as CustomRouteObject,
        ],
      },

      {
        path: PATH_TIMELINE,
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Pages.Timeline />,
            title: 'Timeline',
          } as CustomRouteObject,
          {
            path: 'enhanced',
            element: <Pages.EnhancedTimelineContainer />,
            title: 'Enhanced Timeline',
          } as CustomRouteObject,
        ],
      },

      {
        path: PATH_FINANCIAL_DASHBOARD,
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Pages.FinancialDashboard />,
            title: 'Financieel Dashboard',
          } as CustomRouteObject,
        ],
      },

      {
        path: PATH_JOURNEY_DASHBOARD,
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Pages.Journey.JourneyDashboard />,
            title: 'Uw woningreis',
          } as CustomRouteObject,
        ],
      },

      // Legal routes with nested structure - similar to auth
      {
        path: 'legal',
        element: <Pages.Legal />,
        children: [
          {
            path: 'privacy-policy',
            element: <Pages.PrivacyPolicy />,
            title: 'Privacy Policy',
          } as CustomRouteObject,
          {
            path: 'terms-of-service',
            element: <Pages.TermsOfService />,
            title: 'Terms of Service',
          } as CustomRouteObject,
          {
            path: 'cookie-policy',
            element: <Pages.CookiePolicy />,
            title: 'Cookie Policy',
          } as CustomRouteObject,
        ],
      },

      // Company pages with nested structure
      {
        path: 'company',
        element: <Pages.Company />,
        children: [
          {
            path: 'about',
            element: <Pages.About />,
            title: 'About Us',
          } as CustomRouteObject,
          {
            path: 'contact',
            element: <Pages.Contact />,
            title: 'Contact Us',
          } as CustomRouteObject,
          {
            path: 'careers',
            element: <Pages.Careers />,
            title: 'Careers',
          } as CustomRouteObject,
          {
            path: 'blog',
            element: <Pages.Blog />,
            title: 'Blog',
          } as CustomRouteObject,
        ],
      },

      // Protected Patterns Routes (Development only)
      ...(DEVELOPMENT
        ? [
            {
              path: PATH_PATTERNS,
              element: <ProtectedRoute />,
              children: [
                {
                  index: true,
                  element: <Pages.Patterns />,
                  title: 'Patterns',
                } as CustomRouteObject,
              ],
            },
          ]
        : []),

      // Not Found Route
      {
        path: PATH_NOT_FOUND,
        element: <Pages.NotFound />,
        title: 'Page not found',
      } as CustomRouteObject,

      // Catch All - Redirect to Not Found
      {
        path: '*',
        element: <Pages.NotFound />,
        title: 'Page not found',
      } as CustomRouteObject,
    ],
  },
];

export default ROUTES_ALL;
