import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { PATH_LOGIN } from 'configs/paths';
import useUserContext from 'contexts/UserContext';
import { Loading } from 'pages';

/**
 * ProtectedRoute component that wraps route groups requiring authentication
 * Uses Outlet from react-router-dom to render child routes
 * Redirects unauthenticated users to the login page
 */
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useUserContext();
  const location = useLocation();

  // Show loading state while checking authentication status
  if (loading) {
    return <Loading />;
  }

  // Redirect to login page if not authenticated
  if (!user?.authenticated) {
    return <Navigate to={PATH_LOGIN} state={{ returnUrl: location.pathname }} replace />;
  }

  // Render child routes via Outlet when authenticated
  return <Outlet />;
};

export default ProtectedRoute;
