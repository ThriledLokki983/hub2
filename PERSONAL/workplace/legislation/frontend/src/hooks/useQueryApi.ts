import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { API_URL, CSRF_TOKEN, DEVELOPMENT, HTTP_CODES_UNAUTHORIZED } from 'configs/constants';
import { ApiEndpointInterface } from 'configs/interfaces';
import { useAppStateContext } from 'contexts';
import { PATH_SERVER_ERROR } from 'configs/paths';

const useApi = <T>({
  endpoint,
  method,
  json: parseJson,
  cache: useCache,
  url: urlToInvalidate,
  is_footer = false,
  isFile = false,
}: ApiEndpointInterface) => {

  const navigate = useNavigate();
  const { stateDispatch, stateActions, showError } = useAppStateContext();
  const queryClient = useQueryClient();
  const isExemptUrl = ['/logout', '/login-fail'].includes(window.location.pathname);
  const isExemptEndpoint = ['login', 'footertool'].includes(endpoint);
  const shouldFetch = !isExemptUrl || !isExemptEndpoint;

  const fetcher = async (key: string, payload: any) => {
    if (isExemptUrl) {
      return { data: { results: {}, errors: [] }, error: null, isLoading: false };
    }

    if (endpoint.includes('undefined')) {
      console.warn('Endpoint is not defined');
      return { data: { results: {}, errors: [] }, error: null, isLoading: false };
    }

    const endpointUrl = payload?.endpoint
      ? `${API_URL}${payload.endpoint}`
      : (is_footer ? `${endpoint}` : `${API_URL}${endpoint}`);

    // For FormData, we don't want to destructure or modify it
    let bodyPayload;
    if (payload instanceof FormData) {
      bodyPayload = payload;
    } else {
      const { endpoint, ...rest } = payload || {};
      bodyPayload = rest;
    }

    const headers = new Headers();
    headers.append('X-CSRFToken', CSRF_TOKEN);
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    if (isFile && payload instanceof FormData) {
      headers.delete('Content-Type');
    }

    const response = await fetch(endpointUrl, {
      method,
      credentials: 'include',
      headers,
      body: method.toUpperCase() !== 'GET' && bodyPayload instanceof FormData
        ? bodyPayload
          : method.toUpperCase() !== 'GET' && bodyPayload
          ? JSON.stringify(bodyPayload)
        : null,
    });

    if (response.status === 500) {
      console.warn('Something went wrong. Please try again.');
      const errorData = await response.json().catch(() => null);
      console.trace(errorData);
      navigate(PATH_SERVER_ERROR);
      throw new Error(JSON.stringify(errorData));
    }

    if (response.status === 404) {
      console.warn('Page not found');
      return { data: { results: [], errors: [] }, error: null, isLoading: false };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.errors?.[0]?.message || response.statusText;


      if (response.status === 400) {
        errorData.message = 'Something went wrong. Please try again.';
        throw new Error(JSON.stringify(errorData));
      }

      if (HTTP_CODES_UNAUTHORIZED.includes(response.status)) {
        showError({
          active: true,
          title: 'Not authorized',
          message: 'Please login again.'
        });
      } else {
        showError({
          active: true,
          persistent: false,
          message: `Error: ${message} (${response.status})`,
        });
      }
      stateDispatch(stateActions.updateStateLoading(false));
      throw new Error(message);
    }

    if (response.status === 400 && !response.ok) {
      return response.json().then((data) => {
        return {
          status: 'error',
          data,
        };
      });
    }

    if (response.status === 204) {
      return { data: { results: {}, errors: [] }, error: null, isLoading: false };
    }

    return parseJson ? response.json() : response;
  };


  const useApiQuery = (payload: any) => useQuery({
    queryKey: [endpoint],
    queryFn: () => fetcher(endpoint, payload),
    enabled: method.toUpperCase() === 'GET' && !payload,
    staleTime: useCache ? 1 * 60 * 1000 : 0,
    retry: 2,
    retryDelay: 1000 * 5,
  });

  const useApiMutation = () => useMutation({
    mutationFn: (payload: any) => fetcher(endpoint, payload),
    onSuccess: (data) => {
      const normalizedUrl = urlToInvalidate?.split('?')[0];
      if (normalizedUrl) {
        queryClient.invalidateQueries({ queryKey: [normalizedUrl], exact: true });
      }
    },
    onError: (error) => {
      const errorData = JSON.parse(error?.message);

      showError({
        active: true,
        title: 'Something went wrong',
        message: DEVELOPMENT ? error.message : errorData.message
      });
    },
  });

  return {
    get: shouldFetch ? useApiQuery : () => ({ data: { results: {}, errors: [] }, error: null, isLoading: false }),
    post: useApiMutation,
    put: useApiMutation,
    patch: useApiMutation,
    delete: useApiMutation,
  };
};

export default useApi;
