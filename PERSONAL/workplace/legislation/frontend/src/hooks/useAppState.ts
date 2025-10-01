import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { debounce } from '@grrr/utils';

import { CSS_BREAKPOINTS, CURRENT_TOUR_STEP_ID } from 'configs/constants';
import { TOAST_DEFAULTS } from 'components/defaults';
import ROUTES from 'configs/routes';

import { getBreakpointValues, restore, scrollToTop, findRoute } from 'helpers/utils';
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
  tourStep: 'initial',
  matchingBreakpoints: [],
};

const useAppState = (): AppState => {

  const location = useLocation();
  const currentTourStep = restore(CURRENT_TOUR_STEP_ID, { permanent: true })
  const [toast, setToast] = useState<ToastInterface>(TOAST_DEFAULTS);
  const [state, stateDispatch, stateActions] = useAppStateReducer(STATE_DEFAULTS);


  /**
   * Set document title.
   */
  useEffect(() => {
    document.title = state.title;
  }, [state.title]);


  /**
   * Update page title.
   */
  useEffect(() => {
    stateDispatch(stateActions.updatePageTitle(state?.route?.title));
    stateDispatch(stateActions.updateTourStep({ tour: currentTourStep || 'initial' }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.route]);


  /**
   * Handle route changes.
   */
  useEffect(() => {
    // Match route, or fall back to 404 | 'Not Found'.
    const route = ROUTES.reduce((acc: any, { children }) => {
      if (acc && Object.keys(acc).length) {
        return acc;
      }
      return findRoute(children ?? [], location.pathname) || acc;
    }, {});

    // Update route.
    stateDispatch(stateActions.updateRoute(route));
    scrollToTop();
  }, [location.pathname, stateActions, stateDispatch]);


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
  const showToast = (options: ToastInterface) => setToast({ ...TOAST_DEFAULTS, ...options, active: true });
  const hideToast = () => setToast((prevToast) => ({ ...prevToast, active: false }));
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
  const showMessage = (options: MessageToastOptions) => showToast({ ...options, type: 'message', persistent: true });
  const hideMessage = hideToast; // Alias for hideToast.
  const hasMessage = hasToast && toast.type === 'message'; // Verify we have a message.


  /**
   * Memoize the context, and only update when certain properties change.
   */
  return useMemo(() => ({

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state, toast, hasToast, hasError, hasMessage]);

};

export default useAppState;
