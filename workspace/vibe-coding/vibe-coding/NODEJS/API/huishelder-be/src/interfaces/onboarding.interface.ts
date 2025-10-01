export interface OnboardingData {
  goal: string;
  budget_min?: number;
  budget_max?: number;
  owns_home: boolean;
  has_existing_mortgage: boolean;
  timeline: string;
}

export interface OnboardingResponse {
  onboarding_completed: boolean;
  onboarding_data?: OnboardingData;
}

export enum GoalType {
  BUYING = 'buying',
  SELLING = 'selling',
  BOTH = 'both',
  EXPLORING = 'exploring',
}

export enum TimelineType {
  LESS_THAN_3_MONTHS = '<3_months',
  THREE_TO_SIX_MONTHS = '3_6_months',
  SIX_TO_TWELVE_MONTHS = '6_12_months',
  JUST_LOOKING = 'just_looking',
}
