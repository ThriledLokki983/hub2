import { useCallback, useMemo, useState, useEffect } from 'react';
import useFetch from 'use-http';

import { API_URL } from '../configs/constants';
import { useAppState } from './';

const CACHE = {};

export const useApi = ({ endpoint, method, cache }) => {
    const [fetched, setFetched] = useState(false);
    const [error, setError] = useState(null);

    const {
            showError,
            startLoading,
            stopLoading,
            notifications: {
            warning: warningNotification,
            error: errorNotification,
        }
    } = useAppState();

    const connect = useCallback((payload, { forced = false, silent = false } = {}) =>
        new Promise((resolve, reject) => {

            // Return from cache if found.
            if (cache && CACHE[endpoint] && !forced) {
                return resolve(CACHE[endpoint]);
            }

            // Set loading state.
            if (!silent) {
                startLoading(endpoint);
            } else {
                stopLoading(endpoint);
            }

        // Fetch.
        fetch(`${API_URL}/${endpoint}`, {
            method: method,
            credentials: 'include',
            crossorigin: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: payload ? JSON.stringify(payload) : null,
        })
          .then(response => {
            if (!silent) {
                setFetched(true);
            }

            // Handle bad responses.
            if (!response.ok) {
                setFetched(true);

              // Forbidden.
              if (response.status === 403 || response.statusText === 'Forbidden') {
                warningNotification(
                    `Je hebt niet de juiste rechten om "${endpoint}" op te vragen.`,
                    { title: "Ho! 👮" }
                );

                // Everything else.
                } else {
                    setFetched(false);

                    warningNotification(
                        `Er is iets fout gegaan bij "${endpoint}".`,
                        { title: "Oeps! 😲" }
                    );
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
            console.log(error);
            setError(error.message);
            warningNotification(
                `Unable to connect to server - Error: ${error.message}`,
                { title: "Oh nee! ☠️" }
            );
            if (!silent) {
                stopLoading(endpoint);
            }
                return reject(error);
          });

    }), [cache, endpoint, method, showError, startLoading, stopLoading, warningNotification]);

      // warn when backend is not available
      useEffect(() => {
        if (error instanceof Error && error.message.toLowerCase() === 'failed to fetch') {
            errorNotification(
                `De Flexx services zijn momenteel niet beschikbaar. Probeer het later opnieuw.`,
                { title: "Oh nee! ☠️" }
            );
        }
    }, [error, errorNotification]);

    return {
        delete: useMemo(() => connect, [connect]),
        get: useMemo(() => connect, [connect]),
        post: useMemo(() => connect, [connect]),
        put: useMemo(() => connect, [connect]),
        fetched,
    };
};
