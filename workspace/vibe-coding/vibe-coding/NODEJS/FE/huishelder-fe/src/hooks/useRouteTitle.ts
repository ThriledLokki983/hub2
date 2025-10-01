import { useEffect } from 'react';
import { useLocation, RouteObject, matchPath } from 'react-router-dom';
import { SITE_TITLE } from 'configs/constants';
import ROUTES from 'configs/routes';
import { CustomRouteObject } from 'configs/interfaces';

// Define a type for routes that may have title
type RouteWithTitle = RouteObject & { title?: string };

/**
 * A hook that updates document title based on the current route
 * Handles nested routes and sets appropriate page titles
 */
const useRouteTitle = (): void => {
  const location = useLocation();

  useEffect(() => {
    let pageTitle = '';

    // Function to flatten the route structure for easier searching
    const flattenRoutes = (routes: RouteObject[]): Array<RouteObject & { fullPath?: string }> => {
      return routes.flatMap(route => {
        const path = route.path || '';
        const fullPath = path.startsWith('/') ? path : `/${path}`;

        const routeWithFullPath = { ...route, fullPath };

        if (route.children) {
          // Include current route and all children
          return [
            routeWithFullPath,
            ...flattenRoutes(route.children).map(childRoute => {
              // Handle index routes specially
              if (childRoute.index) {
                return { ...childRoute, fullPath };
              }

              // Handle relative paths in nested routes
              const childPath = childRoute.path || '';
              const combinedPath = childPath.startsWith('/')
                ? childPath
                : fullPath === '/'
                  ? `/${childPath}`
                  : `${fullPath}/${childPath}`;

              return { ...childRoute, fullPath: combinedPath };
            }),
          ];
        }

        return [routeWithFullPath];
      });
    };

    // Flatten all routes
    const allRoutes = flattenRoutes(ROUTES);

    // First try exact match on full path
    const exactMatch = allRoutes.find(route => {
      const checkPath = route.fullPath || route.path;
      if (!checkPath) return false;
      return matchPath({ path: checkPath, end: true }, location.pathname);
    }) as RouteWithTitle;

    // If we found an exact match with a title, use it
    if (exactMatch?.title) {
      pageTitle = `${exactMatch.title} | ${SITE_TITLE}`;
    }
    // Otherwise, check for partial matches (for nested routes)
    else {
      const partialMatch = allRoutes.find(route => {
        const checkPath = route.fullPath || route.path;
        if (!checkPath || checkPath === '/') return false;
        return location.pathname.startsWith(checkPath);
      }) as RouteWithTitle;

      if (partialMatch?.title) {
        pageTitle = `${partialMatch.title} | ${SITE_TITLE}`;
      }
      // If no match found, try to find the "Not Found" route
      else {
        const notFoundRoute = allRoutes.find(
          r => r.path === '404' || r.path === '*',
        ) as CustomRouteObject;

        if (notFoundRoute?.title) {
          pageTitle = `${notFoundRoute.title} | ${SITE_TITLE}`;
        } else {
          pageTitle = SITE_TITLE;
        }
      }
    }

    // Update the document title immediately
    document.title = pageTitle;
  }, [location.pathname]);
};

export default useRouteTitle;
