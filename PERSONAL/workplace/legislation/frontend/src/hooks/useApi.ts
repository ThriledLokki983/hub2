import { useCallback, useMemo } from 'react';

import {
  API_URL,
  CSRF_TOKEN,
  HTTP_CODES_UNAUTHORIZED,
} from 'configs/constants';

import { ApiEndpointInterface } from 'configs/interfaces';
import {
  ApiResult,
  ErrorResponse,
  ConnectOptions,
  ConnectInterface,
} from 'hooks/interfaces';
import { useAppStateContext } from 'contexts';


/**
 * API hook, to simplify response and state handling.
 *
 * @TODO:
 *
 * - This could be moved to a context, so we don't have to leverage these global
 *   variables and multiple inits when the hook gets called.
 *   fixes and simplifications.
 */
const useApi = <T>({ endpoint, method, json: parseJson, cache: useCache }: ApiEndpointInterface): {
  delete: ConnectInterface<T>;
  get: ConnectInterface<T>;
  patch: ConnectInterface<T>;
  post: ConnectInterface<T>;
  put: ConnectInterface<T>;
} => {

  const FETCH_CACHE: Record<string, Promise<ApiResult<T>>> = {};
  let FETCHES_ACTIVE: Array<string> = [];

  const { stateDispatch: updateAppState, showError } = useAppStateContext();

  /**
   * Error message fallback helper.
   */
  const getErrorMessage = (response: ErrorResponse) => response.message
    || response.statusText
    || (response.status === 500 ? 'Internal Server Error' : 'Unknown');

  /**
   * Cache key clear helper.
   * This implementation checks if the cache key exists in the cache before deleting it
   * to avoid any errors.
   */
  const clearCacheKey = (key: string) => {
    if (key in FETCH_CACHE) {
      delete FETCH_CACHE[key];
    }
  };

  /**
   * Generic exposed connect method used in this hook.
   */
  const connect = useCallback((
    payload: Record<string, any> | null,
    { forced = false, silent = false, throwError = true }: ConnectOptions = {}
  ): Promise<ApiResult<T>> => {

    // Create cache key for the call.
    // This way, we ensure that the cache key is only created with a valid payload object.
    let CACHE_KEY = '';
    if (payload === null) {
      CACHE_KEY = JSON.stringify({ endpoint, method });
    } else {
      CACHE_KEY = JSON.stringify({ endpoint, method, ...payload });
    }

    // Return cached fetch call when needed, including promise and response.
    if (useCache && !forced && typeof FETCH_CACHE[CACHE_KEY] !== "undefined") {
      return FETCH_CACHE[CACHE_KEY];
    }

    // Add to currently active fetches array, and set loading state.
    if (!silent) {
      FETCHES_ACTIVE.push(CACHE_KEY);
      updateAppState({
        type: "UPDATE_STATE_FETCHING",
        payload: { isFetching: true }
      });
    }

    // Set updated endpoint if the request is `GET` and there is a payload.
    if (payload && method.toUpperCase() === 'GET') {
      const searchParams = new URLSearchParams(payload);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      endpoint = `${endpoint}?${searchParams.toString()}`;
    }

    // Perform fetch call, and store it in cache.
    const call = fetch(API_URL + endpoint, {
      method: method,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': CSRF_TOKEN,
      },
      body: payload && method.toUpperCase() !== 'GET'
        ? JSON.stringify(payload)
        : null,
    })
      .then(response => {

        // Handle common bad responses.
        const message = getErrorMessage(response);
        const code = response.status;

        // Handle good or silent responses.
        if (response.ok || silent) {
          const result = parseJson ? response.json() : Promise.resolve(response);

          // Store the result in the cache object
          if (useCache) {
            FETCH_CACHE[CACHE_KEY] = result;
          }

          return result.then(data => ({
            status: 'success',
            data,
            code,
            message,
          }));
        }

        // Handle 'forbidden', when a user is not authorized or logged in.
        if (HTTP_CODES_UNAUTHORIZED.includes(code)) {
          if (throwError) {
            showError({
              active: true,
              title: `Not authorized`,
              message: `We were unable to authenticate you, please login again.`,
            });
          }

        // Handle JSON error responses, which should have `errors` property included.
        } else if (parseJson) {
          response.json()
            .then(json => {
              const messageUpdated = json?.errors?.[0]?.message || json?.errors?.[0]?.details || message;
              if (throwError) {
                showError({
                  active: true,
                  persistent: false,
                  message: `Error: ${messageUpdated} (${code})`,
                });
              }
              return;
            })
            // Handle JSON that cannot be parsed.
            .catch((error) => {
              if (throwError) {
                showError({
                  active: true,
                  persistent: false,
                  message: `Error: ${error.message} (${code})`,
                });
              }
            });

        // Handle everything else.
        } else {
          showError({
            active: true,
            persistent: false,
            message: `Error: ${message} (${code})`,
          });
        }

        // Reject the bad response.
        clearCacheKey(CACHE_KEY);
        return window.Promise.reject(response);
      })
      .then(json => json)
      .catch(error => {
        if (!silent) {
          showError({
            active: true,
            title: `Unable to connect to server`,
            message: `Error: ${getErrorMessage(error)}`,
          });
        }
        clearCacheKey(CACHE_KEY)
        return window.Promise.reject(error);
      })
      .finally(() => {
        // Remove fetch from active fetches array, and set loading state.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        FETCHES_ACTIVE = FETCHES_ACTIVE.filter(f => f !== CACHE_KEY);
        updateAppState({
          type: "UPDATE_STATE_FETCHING",
          payload: { isFetching: !!FETCHES_ACTIVE.length }
        });
      });

      // Cache and return the fetch call.
      FETCH_CACHE[CACHE_KEY] = call as unknown as Promise<ApiResult<T>>;
      return Promise.resolve(call as unknown as Promise<ApiResult<T>>);

  }, [endpoint, method, useCache, parseJson, showError, updateAppState]);

  return {
    delete: useMemo(() => connect, [connect]),
    get: useMemo(() => connect, [connect]),
    patch: useMemo(() => connect, [connect]),
    post: useMemo(() => connect, [connect]),
    put: useMemo(() => connect, [connect]),
  };
};

export default useApi;
