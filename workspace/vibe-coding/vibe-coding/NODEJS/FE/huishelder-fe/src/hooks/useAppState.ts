import { useState, useEffect, useMemo } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { RouteObject } from 'react-router-dom';
import { debounce } from '@grrr/utils';

import { CSS_BREAKPOINTS } from 'configs/constants';
import { TOAST_DEFAULTS } from 'components/defaults';
import ROUTES from 'configs/routes';

import { getBreakpointValues, scrollToTop } from 'helpers/utils';
import useAppStateReducer from 'hooks/reducers/appStateReducer';

import {
  AppState,
  InitialState,
  ToastInterface,
  ErrorToastOptions,
  MessageToastOptions,
} from 'hooks/interfaces';

const STATE_DEFAULTS: InitialState = {
  route: {},
  title: '',
  isLoading: true,
  isFetching: false,
  matchingBreakpoints: [],
};

const useAppState = (): AppState => {
  const location = useLocation();
  const [toast, setToast] = useState<ToastInterface>(TOAST_DEFAULTS);
  const [state, stateDispatch, stateActions] = useAppStateReducer(STATE_DEFAULTS);

  /**
   * Update state title (but don't directly modify document.title)
   * This helps maintain state consistency while avoiding conflicts with useRouteTitle
   */
  useEffect(() => {
    const routeTitle =
      state.route && typeof state.route === 'object'
        ? (state.route as Record<string, string>).title
        : undefined;
    stateDispatch(stateActions.updatePageTitle(routeTitle || ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.route]);

  /**
   * Handle route changes.
   */
  useEffect(() => {
    // Find the matching route object based on the current URL
    const findMatchingRoute = (routes: RouteObject[]): Record<string, unknown> => {
      // Flatten all routes into a single array for easier searching
      const flattenRoutes = (routeList: RouteObject[]): RouteObject[] => {
        return routeList.flatMap(route => {
          return [route, ...(route.children ? flattenRoutes(route.children) : [])];
        });
      };

      const allRoutes = flattenRoutes(routes);

      // Find exact match based on the current path
      for (const route of allRoutes) {
        if (route.path && matchPath({ path: route.path, end: true }, location.pathname)) {
          return route as Record<string, unknown>;
        }
      }

      // If no match, check for wildcard routes
      const wildcardRoute = allRoutes.find(route => route.path === '*');
      if (wildcardRoute) {
        return wildcardRoute as Record<string, unknown>;
      }

      // As a last resort, return an empty object
      return {};
    };

    // Get the matching route
    const matchedRoute = findMatchingRoute(ROUTES);

    // Update route in state
    stateDispatch(stateActions.updateRoute(matchedRoute));

    // Reset scroll position.
    scrollToTop();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /**
   * Set matching breakpoints for responsive layout and listen for updates.
   */
  useEffect(() => {
    // Get breakpoints sizes provided by CSS.
    const breakpoints = getBreakpointValues(CSS_BREAKPOINTS);

    // Resize listeners.
    const listener = () => stateDispatch(stateActions.updateBreakPoints(breakpoints));
    const debouncedListener = debounce(listener, 150);

    // Initial trigger.
    listener();

    // Attach/Detach listener.
    window.addEventListener('resize', debouncedListener);
    return () => window.removeEventListener('resize', debouncedListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Toast helper.
   */
  const showToast = (options: ToastInterface) =>
    setToast({ ...TOAST_DEFAULTS, ...options, active: true });
  const hideToast = () => setToast(prevToast => ({ ...prevToast, active: false }));
  const hasToast = toast.active;

  /**
   * Error toast helpers.
   */
  const showError = (options: ErrorToastOptions) => showToast({ ...options, type: 'error' });
  const hideError = hideToast; // Alias for hideToast.
  const hasError = hasToast && toast.type === 'error'; // Verify we have an error.

  /**
   * Message toast helpers.
   */
  const showMessage = (options: MessageToastOptions) =>
    showToast({ ...options, type: 'message', persistent: true });
  const hideMessage = hideToast; // Alias for hideToast.
  const hasMessage = hasToast && toast.type === 'message'; // Verify we have a message.

  /*
   * Memoize the context, and only update when certain properties change.
   * Including all dependencies to avoid exhaustive-deps warning
   */
  return useMemo(
    () => ({
      state,
      stateDispatch,
      stateActions,

      toast,
      showToast,
      hideToast,
      hasToast,

      showError,
      hideError,
      hasError,

      showMessage,
      hideMessage,
      hasMessage,
    }),
    [
      state,
      toast,
      hasToast,
      hasError,
      hasMessage,
      stateDispatch,
      stateActions,
      showToast,
      hideToast,
      showError,
      hideError,
      showMessage,
      hideMessage,
    ],
  );
};

export default useAppState;
