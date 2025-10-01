import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { colors, typography } from './theme/theme';

// Layout
import Layout from './components/Layout/Layout';

// Pages
import HomePage from './pages/Home/HomePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Protected route component
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if the user is authenticated from localStorage
  const isAuthenticated = localStorage.getItem('cosmic_recipe_user') !== null;

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${typography.fontFamily};
    background-color: ${colors.darkBackground};
    color: ${colors.white};
    font-weight: ${typography.fontWeights.light};
    line-height: 1.6;
    letter-spacing: ${typography.letterSpacing};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  input, button, textarea, select {
    font-family: ${typography.fontFamily};
  }
`;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GlobalStyle />
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Main routes with Layout */}
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="recipes" element={<div>Recipes Page (Coming Soon)</div>} />
          <Route path="categories" element={<div>Categories Page (Coming Soon)</div>} />
          <Route path="discover" element={<div>Discover Page (Coming Soon)</div>} />

          {/* Protected routes */}
          <Route path="profile" element={<RequireAuth><div>Profile Page (Coming Soon)</div></RequireAuth>} />
          <Route path="favorites" element={<RequireAuth><div>Favorites Page (Coming Soon)</div></RequireAuth>} />
          <Route path="my-recipes" element={<RequireAuth><div>My Recipes Page (Coming Soon)</div></RequireAuth>} />
          <Route path="settings" element={<RequireAuth><div>Settings Page (Coming Soon)</div></RequireAuth>} />

          {/* Fall back for 404 */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
