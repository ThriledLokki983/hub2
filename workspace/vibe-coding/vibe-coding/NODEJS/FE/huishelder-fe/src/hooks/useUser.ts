import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GET_USER, LOGOUT } from 'configs/api-endpoints';
import { PATH_LOGOUT, PATH_LOGIN } from 'configs/paths';
import { useQueryApi, useMutationApi } from 'hooks';
import { useAppStateContext } from 'contexts';
import { UserInterface, UserDataInterface } from './interfaces/user.interface';
import { ApiResult } from './interfaces/api.interface';

interface UserApiResponse {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  role: string;
  language_preference: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_active: boolean;
  avatar_url?: string;
}

export const useUser = (): UserDataInterface => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { showError } = useAppStateContext();

  const handleError = useCallback((err: Error) => {
    const error = err instanceof Error ? err : new Error('An unknown error occurred');
    setError(error);
    showError({
      type: 'error',
      title: 'Error',
      message: error.message,
      active: true,
      persistent: true,
    });
    return error;
  }, [showError]);

  // Set up mutation for logout
  const { mutateAsync: logoutMutation } = useMutationApi({
    endpoint: LOGOUT.endpoint,
    method: 'POST',
  });

  // Fetch user data
  const { isLoading } = useQueryApi<ApiResult<UserApiResponse>>(
    { endpoint: GET_USER.endpoint, method: 'GET' },
    undefined,
    {
      enabled: !location.pathname.includes(PATH_LOGOUT),
      retry: false,
      queryKey: ['user'],
    },
  );

  // Login function
  const login = useCallback(async (_email: string, _password: string) => {
    try {
      // Implement login logic here
      setError(null);
    } catch (err) {
      throw handleError(err instanceof Error ? err : new Error('Login failed'));
    }
  }, [handleError]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await logoutMutation(null);
      setUser(null);
      navigate(PATH_LOGIN);
    } catch (err) {
      throw handleError(err instanceof Error ? err : new Error('Logout failed'));
    }
  }, [logoutMutation, navigate, handleError]);

  return {
    user,
    loading: isLoading,
    error,
    login,
    logout,
  };
};

export default useUser;
