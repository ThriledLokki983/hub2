import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useUserContext from 'contexts/UserContext';
import { useQueryApi, useMutationApi } from 'hooks';
import { GET_USER_ONBOARDING, POST_USER_ONBOARDING } from 'configs/api-endpoints';
import { PATH_JOURNEY_DASHBOARD } from 'configs/paths';
import { OnboardingApiResponse, OnboardingData } from './interfaces/onboarding';

/**
 * Custom hook to manage user onboarding process.
 * It fetches the onboarding status and allows for completion of onboarding.
 */
export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useUserContext();
  const location = useLocation();

  // Skip onboarding in certain paths
  const shouldSkipOnboarding =
    location.pathname.includes('/login') ||
    location.pathname.includes('/signup') ||
    location.pathname.includes('/logout') ||
    location.pathname.includes('/reset-password');

  // Fetch onboarding status
  const {
    data: apiResponse,
    isLoading: isOnboardingLoading,
    refetch: refetchOnboarding,
  } = useQueryApi<OnboardingApiResponse>(GET_USER_ONBOARDING, null, {
    enabled: !!user && !shouldSkipOnboarding,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Process API response
  useEffect(() => {
    if (apiResponse?.status === 'success' && apiResponse?.data) {
      if (!apiResponse.data.data.onboarding_completed) {
        setShowOnboarding(true);
      } else {
        setShowOnboarding(false);
      }
    }
  }, [apiResponse]);

  // Get navigate function for redirecting
  const navigate = useNavigate();

  // Mutation for updating onboarding
  const { mutate: submitOnboarding, isPending: isSubmittingOnboarding } = useMutationApi(
    POST_USER_ONBOARDING,
    {
      onSuccess: () => {
        setShowOnboarding(false);
        refetchOnboarding();
        // After successful onboarding completion, redirect to journey dashboard
        navigate(PATH_JOURNEY_DASHBOARD);
      },
    },
  );

  // Check onboarding status when user changes
  useEffect(() => {
    if (user?.id && !shouldSkipOnboarding) {
      refetchOnboarding();
    }
  }, [user?.id, shouldSkipOnboarding, refetchOnboarding]);

  // Handle onboarding completion
  const handleOnboardingComplete = (data: OnboardingData) => {
    submitOnboarding({ ...data });
  };

  // Manual trigger to show onboarding (for settings page)
  const triggerOnboarding = () => {
    setShowOnboarding(true);
  };

  // Extract onboarding data from the API response
  const onboardingData = apiResponse?.data?.data;

  return {
    showOnboarding,
    isOnboardingLoading,
    isSubmittingOnboarding,
    onboardingCompleted: onboardingData?.onboarding_completed ?? false,
    onboardingData: onboardingData?.onboarding_data,
    handleOnboardingComplete,
    triggerOnboarding,
    closeOnboarding: () => setShowOnboarding(false),
  };
};
