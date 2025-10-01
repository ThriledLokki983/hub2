import { useCallback, useMemo } from 'react';

import { API_URL, SESSION_ID } from '../configs/constants';
import { useAppState } from './';

const CACHE = {};

export const useApi = ({ endpoint, method, cache }) => {
  const { setLoading, showError } = useAppState();

  const connect = useCallback((payload, { forced = false, silent = false } = {}) =>
      new Promise((resolve, reject) => {

        // Return from cache if found.
        if (cache && CACHE[endpoint] && !forced) {
          return resolve(CACHE[endpoint]);
        }

        // Set loading state.
        if (!silent) {
          setLoading(true);
        }

        // Fetch.
        fetch(`${endpoint}`, {
          method: method,
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: payload ? JSON.stringify(payload) : null,
        })
          .then(response => {
            // Reset loading state.
            if (!silent) {
              setLoading(false);
            }

            // Handle bad responses.
            if (!response.ok) {

              // Forbidden.
              if (response.status === 403 || response.statusText === 'Forbidden') {
                showError({
                  title: `Forbidden`,
                  message: `We were unable to authenticate you, please login again.`,
                  persistent: true,
                });

              // Everything else.
              } else {
                showError({
                  message: `Error: ${response.statusText || 'Unknown'} (code: ${response.status})`,
                  persistent: true,
                });
              }
              return reject(response);
            }


            // Parse and return JSON response if method is GET.
            if (method === 'GET') {
              return response.json()
            }
            if (cache) {
              CACHE[endpoint] = response;
            }
            return resolve(response);
          })
          .then(json => {
            if (cache) {
              CACHE[endpoint] = json;
            }
            return resolve(json);
          })
          .catch(error => {
            showError({
              title: `Unable to connect to server`,
              message: `Error: ${error.message}`,
              persistent: true,
              reload: true,
            });
            if (!silent) {
              setLoading(false);
            }
            return reject(error);
          });

  }), [cache, endpoint, method, showError, setLoading]);

  return {
    delete: useMemo(() => connect, [connect]),
    get: useMemo(() => connect, [connect]),
    post: useMemo(() => connect, [connect]),
    put: useMemo(() => connect, [connect]),
  };

};