export interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
}

export type OnboardingGoal = 'buying' | 'selling' | 'both' | 'exploring';
export type OnboardingTimeline = 'within_3_months' | '3_6_months' | '6_12_months' | 'just_looking';

export interface OnboardingData {
  goal: OnboardingGoal;
  budget_min: number;
  budget_max: number;
  owns_home: boolean;
  has_existing_mortgage: boolean;
  timeline: OnboardingTimeline;
}

export interface OnboardingStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSkip?: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
  isLastStep?: boolean;
}

export interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export type OnboardingApiResponse = {
  status: 'success' | 'error';
  message: string;
  code: number;
  data: {
    message: string;
    statusCode: number;
    success: boolean;
    data: {
      onboarding_completed: boolean;
      onboarding_data?: OnboardingData;
    };
  };
};
