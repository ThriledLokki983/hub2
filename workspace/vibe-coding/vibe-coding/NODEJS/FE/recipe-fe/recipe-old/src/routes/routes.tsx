import { RouteObject, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layout components
import Layout from '../components/Layout';
import RecipeDetailsPage from '../pages/RecipeDetailsPage';

// Main pages
import { HomePage } from '../pages';
import { AboutPage } from '../pages';
import { RecipesPage } from '../pages';
import { RegionsPage } from '../pages';
import { IngredientsPage } from '../pages';

// Auth pages
import { LoginPage, SignupPage, ResetPasswordPage } from '../pages/auth';

// Profile pages
import { ProfilePage, SettingsPage } from '../pages/profile';

// Footer pages - Explore category
import {
  FeaturedChefsPage,
  RegionalCuisinesPage,
  SeasonalDishesPage,
  SpecialOccasionsPage,
} from '../pages/explore';

// Footer pages - About Us category
import {
  CareersPage,
  ContactUsPage,
  OurStoryPage,
  OurTeamPage,
  TestimonialsPage,
} from '../pages/about';

// Footer pages - Resources category
import {
  BlogPage,
  CookingTipsPage,
  FAQPage,
  IngredientGuidePage,
  KitchenToolsPage,
} from '../pages/resources';

// Footer pages - Legal
import {
  PrivacyPolicyPage,
  TermsOfServicePage,
  CookiePolicyPage,
} from '../pages/legal';

// ProtectedRoute component to guard routes requiring authentication
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show nothing while checking authentication status
  if (loading) {
    return null;
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

// Define routes using RouteObject type
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      // Main Navigation Routes
      { index: true, element: <HomePage /> },
      { path: 'recipes', element: <RecipesPage /> },
      { path: 'recipe/:id', element: <RecipeDetailsPage /> },
      { path: 'ingredients', element: <IngredientsPage /> },
      { path: 'regions', element: <RegionsPage /> },
      { path: 'about', element: <AboutPage /> },

      // Auth Routes
      {
        path: 'auth',
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'signup', element: <SignupPage /> },
          { path: 'reset-password', element: <ResetPasswordPage /> },
        ],
      },

      // Protected Profile Routes
      {
        path: 'profile',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },

      // Explore Footer Routes
      { path: 'regional-cuisines', element: <RegionalCuisinesPage /> },
      { path: 'seasonal-dishes', element: <SeasonalDishesPage /> },
      { path: 'special-occasions', element: <SpecialOccasionsPage /> },
      { path: 'featured-chefs', element: <FeaturedChefsPage /> },

      // About Us Footer Routes
      { path: 'our-story', element: <OurStoryPage /> },
      { path: 'our-team', element: <OurTeamPage /> },
      { path: 'testimonials', element: <TestimonialsPage /> },
      { path: 'careers', element: <CareersPage /> },
      { path: 'contact', element: <ContactUsPage /> },

      // Resources Footer Routes
      { path: 'cooking-tips', element: <CookingTipsPage /> },
      { path: 'ingredient-guide', element: <IngredientGuidePage /> },
      { path: 'kitchen-tools', element: <KitchenToolsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'faq', element: <FAQPage /> },

      // Legal Footer Routes
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms-of-service', element: <TermsOfServicePage /> },
      { path: 'cookie-policy', element: <CookiePolicyPage /> },

      // Catch-all route for 404
      { path: '*', element: <Navigate to="/" replace /> }
    ],
  },
];