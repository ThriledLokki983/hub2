import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import { getCookie, setCookie } from 'react-use-cookie';
import { remove, restore } from 'helpers/utils';

import { GET_USER, GET_CLIENT_PROJECTS } from 'configs/api-endpoints';
import { CSRF_TOKEN_COOKIE_NAME, LOGIN_URL } from 'configs/constants';
import {
  PATH_ACCESS,
  PATH_HOME,
  PATH_LOGIN_FAIL,
  PATH_LOGOUT,
  PATH_NAVIGATOR_LANDING,
} from 'configs/paths';
import { USER_DEFAULTS } from 'data/user';
import { STORAGE_KEY_ONBOARDED } from 'configs/onboarding/onboarding';
import { GUIDED_TOUR_ID } from 'configs/legislation/legislation';

import { usePendo, useQueryApi } from 'hooks';
import { useAppStateContext } from 'contexts';
import { UserInterface, UserDataInterface } from './interfaces';


const useUser = (): UserDataInterface => {

  const location = useLocation();
  const navigate = useNavigate();

  const isGuidedTourCompleted = restore(GUIDED_TOUR_ID, { permanent: true });
  const [isAlreadyOnboarded, _] = useState(restore(STORAGE_KEY_ONBOARDED, { permanent: true }) as boolean ?? false);
  const [userData, setUserData] = useState<UserInterface>(USER_DEFAULTS);

  const { state: appState, stateDispatch, stateActions, showError } = useAppStateContext();
  const { get: getClientAccess } = useQueryApi(GET_CLIENT_PROJECTS);
  const { get: getQueryUser } = useQueryApi(GET_USER);
  const { init: initPendo } = usePendo();

  const { data, error, isLoading } = getQueryUser(null);
  const { data: accessData, isLoading: isAccessLoading } = getClientAccess(null);

  if (error && !isLoading && !matchPath(location.pathname, PATH_LOGOUT) && !matchPath(location.pathname, PATH_LOGIN_FAIL)) {
    navigate(PATH_LOGOUT);
    showError({
      active: true,
      title: 'Not authorized',
      message: 'Please login again later.'
    });
  }

  // set the value for the is_admin
  const updateUserProfileData = useCallback((userData: Partial<UserInterface>) => {
    setUserData((prev) => ({ ...prev, ...userData }));
  }, []);


  /**
   * Handle situations where the user is not authenticated.
   * Set user data after successful login.
   */
  useEffect(() => {
    if (userData.authenticated) {
      return;
    }

    const links = ['/legislation/all', '/navigator/role-based'];

    if (userData.show_aside_tour && links.includes(window.location.pathname)) {
      navigate(PATH_NAVIGATOR_LANDING);
    }

    // Allow the logout page to render without active user.
    if (matchPath(location.pathname, PATH_LOGOUT) || matchPath(location.pathname, PATH_LOGIN_FAIL)) {
      stateDispatch(stateActions.updateStateLoading(false));
      return;
    }

    // Log in if CSRF token is not found (`sessionId` is httpOnly).
    if (!getCookie(CSRF_TOKEN_COOKIE_NAME) && !matchPath(location.pathname, PATH_LOGIN_FAIL) && !matchPath(location.pathname, PATH_LOGOUT)) {
      // login();
      return;
    }

    // Set the user data if the user is already authenticated.
    if (!data?.errors?.length && !isLoading && data?.results?.length) {
      const { results } = data;
      const profile = Array.isArray(results) ? results.at(0) : results

      const groups = ['approver', 'preparer', 'file-uploader'];
      const isAdmin = groups.some(group => profile?.groups?.includes(group));
      const showGuidedTour = (!isGuidedTourCompleted && (window.location.pathname.includes(PATH_NAVIGATOR_LANDING) && appState.tourStep === 'initial'))
      ? true : !isGuidedTourCompleted && !isAdmin && window.location.pathname.includes('role-based');

      setUserData({
        ...userData,
        id: profile.identifier,
        authenticated: true,

        // Admin Info
        is_admin: isAdmin,
        is_superuser: profile.is_superuser && profile.is_staff,
        can_approve: profile.is_staff && profile.is_superuser,
        is_approver: profile.groups.includes('approver'),
        is_preparer: profile.groups.includes('preparer'),
        is_file_uploader: profile.groups.includes('file-uploader'),

        // Guided Tour Info
        show_landing_tour: false,
        show_guided_tour: showGuidedTour && appState.tourStep !== 'completed',
        show_aside_tour: showGuidedTour && ['initial'].includes(appState.tourStep),
        show_roles_tour: showGuidedTour && ['roles'].includes(appState.tourStep),
        show_filters_tour: showGuidedTour && ['filters'].includes(appState.tourStep),
        show_content_tour: showGuidedTour && ['role content'].includes(appState.tourStep),
        profile: profile,
      });
      stateDispatch(stateActions.updateStateLoading(false));
      initPendo({ email: profile.email, job_roles: profile.job_role_list });
      remove('failed_login');
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, location.pathname, window.location.pathname]);

  // Update User data if tourGuide is changed
  useEffect(() => {
    const groups = ['approver', 'preparer', 'file-uploader'];
    const isAdmin = groups.some(group => userData.profile?.groups?.includes(group));
    const showGuidedTour = !isGuidedTourCompleted && !isAdmin;

    setUserData((prev) => ({
      ...prev,
      show_aside_tour: showGuidedTour && appState.tourStep === 'initial',
      show_roles_tour: showGuidedTour && appState.tourStep === 'roles',
      show_filters_tour: showGuidedTour && appState.tourStep === 'filters',
      show_content_tour: showGuidedTour && appState.tourStep === 'role content',
    }));
  }, [appState.tourStep, isGuidedTourCompleted, userData.profile?.groups]);


  /**
   * Clear CSRF token cookie.
   */
  const clearCsrfToken = () => setCookie(CSRF_TOKEN_COOKIE_NAME, '', { days: 0 });


  /**
   * Login.
   */
  const login = () => window.location.assign(LOGIN_URL || PATH_HOME);


  /**
   * Logout, but clear CSRF token first.
   */
  const logout = ({ reload = false } = {}) => {
    clearCsrfToken();
    if (reload) {
      window.location.reload();
    } else {
      // pass along the place where this is being initiated
      navigate(PATH_LOGOUT, { state: { from: location.pathname } });
    }
  };


  /**
   * Redirect user to the home page if they are already onboarded.
   */
  useEffect(() => {
    if (userData.profile.is_onboarded || isAlreadyOnboarded) {
      return;
    }
    navigate(PATH_HOME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAlreadyOnboarded, userData.profile.is_onboarded]);


  /**
   * Redirect user to the access page if they don't have access.
   */
  useEffect(() => {
    if (matchPath(location.pathname, PATH_LOGIN_FAIL)) {
      return;
    }

    if (!isAccessLoading) {
      if (!accessData?.results?.length) {
        navigate(PATH_ACCESS);
        setUserData((prev) => ({
          ...prev,
          have_access: false,
        }));
      }

      if (accessData?.results?.length) {
        setUserData((prev) => ({
          ...prev,
          have_access: true,
        }));
      }
    }


    // if (!isAccessLoading && !userData.profile.has_access && userData.authenticated) {
    //   navigate(PATH_ACCESS);
    //   return;
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userData]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [accessData, isAccessLoading]);



  /**
  * Re-check and  the page anything the layout is
  */
  useEffect(() => {

    const notAdminNotCompleted = !isGuidedTourCompleted && !userData.is_admin;
    const windowLocation = window.location.pathname;
    remove('failed_login');

    const showGuidTour = (notAdminNotCompleted
        && (windowLocation.includes(PATH_NAVIGATOR_LANDING) && appState.tourStep === 'initial')
      ) ? true : (notAdminNotCompleted && windowLocation.includes('role-based'));

      setUserData((prev) => ({
        ...prev,
        show_guided_tour: showGuidTour && appState.tourStep !== 'completed',
        show_aside_tour: showGuidTour && appState.tourStep === 'initial',
        show_roles_tour: showGuidTour && appState.tourStep === 'roles',
        show_filters_tour: showGuidTour && appState.tourStep === 'filters',
        show_content_tour: showGuidTour && appState.tourStep === 'role content',
      }));
  }, [appState.tourStep, isGuidedTourCompleted, location.pathname, userData.is_admin]);


  /*
  * Memoize the context, and only update when certain properties change.
  */
  return useMemo(() => ({

    user: userData,
    clearCsrfToken,
    updateUserProfileData,
    login,
    logout,

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [userData,]);

};

export default useUser;
