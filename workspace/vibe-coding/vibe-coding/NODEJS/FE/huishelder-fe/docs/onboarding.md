# Onboarding Flow Documentation

## Overview

The HuisHelder app includes a comprehensive onboarding process that guides new users through setting up their real estate preferences. The flow appears automatically on first login and can be revisited anytime from the Settings page.

## Components

### Main Components

- `Onboarding`: Main container component that manages the multi-step flow
- `OnboardingProgress`: Visual indicator of progress through the steps
- Individual step components (Step1Goal, Step2Budget, etc.)

### Step Structure

1. **Goal Selection**: User selects if they're buying, selling, both, or just exploring
2. **Budget Setting**: User sets their budget range with minimum and maximum values
3. **Current Home Ownership**: User indicates if they currently own a home
4. **Mortgage Status**: User indicates if they have an existing mortgage (skipped if no home ownership)
5. **Timeline**: User selects their expected timeline for their real estate journey

## Integration

### API Endpoints

- `GET /user/onboarding`: Retrieves current onboarding status and data
- `POST /user/onboarding`: Submits completed onboarding data

### User Flow

1. User logs in for the first time
2. Onboarding modal appears automatically
3. User completes all steps or skips (can be revisited later)
4. Data is saved to backend
5. User is directed to dashboard or timeline

### Restarting Onboarding

Users can restart the onboarding process from the Settings page by clicking "Customize My Journey" in the Housing Preferences section.

## Design

The onboarding flow follows the HuisHelder design system with:

- Clean, minimal UI with proper spacing
- Soft color palette with Deep Olive Green and Soft Amber accents
- Responsive design for all device sizes
- Accessible UI elements with clear labels and instructions

## State Management

Onboarding state is managed through the `useOnboarding` custom hook which:

- Tracks completion status
- Manages visibility of the modal
- Handles API communication
- Provides functions for completing or skipping onboarding
