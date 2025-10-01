import { PATH_JOURNEY_DASHBOARD } from 'configs/paths';
import { NavigateFunction } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/v1/user/onboarding';

/**
 * Handle redirecting users after login based on onboarding status
 *
 * @param callBackFn - React Router navigate function
 * @param returnUrl - Default URL to redirect to if onboarding is not completed
 */
export const handleDashboardRedirect = (callBackFn: NavigateFunction, returnUrl: string) => {
  // Store redirection in localStorage as fallback
  // This helps prevent redirection loops and preserves intent across page reloads
  localStorage.setItem('intendedRedirect', returnUrl);

  // Simple function to ensure we use the navigate function with timeout
  // This prevents navigation happening before state is completely updated
  const safeNavigate = (url: string) => {
    setTimeout(() => {
      callBackFn(url, { replace: true });
    }, 100);
  };

  // Get token from localStorage
  const token = localStorage.getItem('Authorization');

  // If no token is available, just navigate to the return URL
  if (!token) {
    safeNavigate(returnUrl);
    return;
  }

  // Add timestamp to avoid caching issues
  const timestamp = new Date().getTime();
  const urlWithTimestamp = `${API_URL}?_=${timestamp}`;

  // Configure headers with authentication token
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
  };

  // Check onboarding status with proper authentication
  fetch(urlWithTimestamp, {
    method: 'GET',
    headers,
    credentials: 'include',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success && data.data && data.data.onboarding_completed) {
        // Force a hard redirect to Journey Dashboard when onboarding is completed
        window.location.href = PATH_JOURNEY_DASHBOARD;
      } else {
        // Use navigate function for regular navigation
        safeNavigate(returnUrl);
      }
    })
    .catch(error => {
      console.error('Error checking onboarding status:', error);
      safeNavigate(returnUrl);
    });
};
