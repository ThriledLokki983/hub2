import { useEffect, useMemo, useState } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { setCookie } from 'react-use-cookie';

import { GET_USER } from 'configs/api-endpoints';
import {
  CSRF_TOKEN,
  CSRF_TOKEN_COOKIE_NAME,
  HTTP_CODES_UNAUTHORIZED,
  DEVELOPMENT,
  LOGIN_URL,
  LOGOUT_URL,
} from 'configs/constants';
import { PATH_HOME, PATH_LOGOUT } from 'configs/paths';
import { USER_DEFAULTS, USER_MOCK } from 'data/user';

import { useApi } from 'hooks';
import { useAppStateContext } from 'contexts';
import { UserInterface, UserDataInterface } from './interfaces';


const useUser = (): UserDataInterface => {

  const location = useLocation();

  const { stateDispatch, stateActions } = useAppStateContext();
  const { get: getUser } = useApi<UserInterface>(GET_USER);

  const [user, setUser] = useState(USER_DEFAULTS);

  /**
   * Fetch and set user.
   */
  useEffect(() => {

    if (DEVELOPMENT) {
      setUser(USER_MOCK);
      stateDispatch(stateActions.updateStateLoading(false));
      return;
    }
    // Do nothing if the user is already authenticated.
    if (user.authenticated) {
      return;
    }

    // Allow the logout page to render without active user.
     if (matchPath(location.pathname, PATH_LOGOUT)) {
       stateDispatch(stateActions.updateStateLoading(false));
       return;
     }

    // Log in if CSRF token is not found (`sessionId` is httpOnly).
    if (!CSRF_TOKEN) {
      login();
      return;
    }

    // Log in if CSRF token is not found (`sessionId` is httpOnly).
    getUser({}).then((response) => {
      const results: any = response.data; // the type for results has to be changed
      setUser({
        ...results,
        authenticated: true,
      });
      stateDispatch(stateActions.updateStateLoading(false));
    }).catch(error => {
      if (HTTP_CODES_UNAUTHORIZED.includes(error.status)) {
        logout();
      }
      console.log(error);
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, user]);

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
  const logout = () => {
    clearCsrfToken();
    window.location.assign(LOGOUT_URL || PATH_HOME);
  };

  /*
 * Memoize the context, and only update when certain properties change.
 */
  return useMemo(() => ({

    user,
    login,
    logout,

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [user,]);

};

export default useUser;
