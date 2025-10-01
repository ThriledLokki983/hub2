import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { PATH_HOME, PATH_LOGOUT } from 'configs/paths';
import useUserContext from 'contexts/UserContext';
import { Loading } from 'pages';

/**
 * AuthGuard component that prevents authenticated users from accessing auth pages
 * This is the opposite of ProtectedRoute - it redirects authenticated users away
 * from login, signup, and password reset pages to the home page.
 * Makes an exception for the logout page, which is accessible to all users.
 */
const AuthGuard: React.FC = () => {
  const { user, loading } = useUserContext();
  const location = useLocation();

  // Special case for logout page - always allow access
  if (location.pathname === PATH_LOGOUT) {
    return <Outlet />;
  }

  // Show loading state while checking authentication status
  if (loading) {
    return <Loading />;
  }

  // Redirect to home page if already authenticated (except for logout page)
  if (user?.authenticated) {
    // Check localStorage for previously stored intended redirect location
    const intendedRedirect = localStorage.getItem('intendedRedirect');

    // If we have a saved redirect location, use it and clear storage
    if (intendedRedirect) {
      localStorage.removeItem('intendedRedirect');
      return <Navigate to={intendedRedirect} replace />;
    }

    // Otherwise default to home page
    return <Navigate to={PATH_HOME} replace />;
  }

  // Render child routes via Outlet when not authenticated
  return <Outlet />;
};

export default AuthGuard;
