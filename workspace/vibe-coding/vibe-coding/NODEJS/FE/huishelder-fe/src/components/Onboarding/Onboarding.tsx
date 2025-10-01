import React, { useState } from 'react';
import { OnboardingProps, OnboardingData } from './Onboarding.interface';
import OnboardingProgress from './OnboardingProgress';
import Step1Goal from './Step1Goal';
import Step2Budget from './Step2Budget';
import Step3OwnsHome from './Step3OwnsHome';
import Step4Mortgage from './Step4Mortgage';
import Step5Timeline from './Step5Timeline';
import styles from './Onboarding.module.scss';

const defaultOnboardingData: OnboardingData = {
  goal: 'exploring',
  budget_min: 300000,
  budget_max: 500000,
  owns_home: false,
  has_existing_mortgage: false,
  timeline: 'just_looking',
};

const Onboarding: React.FC<OnboardingProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);

  const totalSteps = 5;

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStep === totalSteps) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    // Skip mortgage step if user doesn't own a home
    if (currentStep === 5 && !data.owns_home) {
      setCurrentStep(3);
    } else {
      setCurrentStep(prev => Math.max(1, prev - 1));
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleComplete = () => {
    onComplete(data);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Welcome to HuisHelder</h2>
          <p>Help us personalize your experience by answering a few questions</p>
        </div>

        <div className={styles.content}>
          <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

          {currentStep === 1 && (
            <Step1Goal
              onNext={handleNext}
              onPrevious={() => {}}
              onSkip={handleSkip}
              updateData={updateData}
              data={data}
            />
          )}

          {currentStep === 2 && (
            <Step2Budget
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSkip={handleSkip}
              updateData={updateData}
              data={data}
            />
          )}

          {currentStep === 3 && (
            <Step3OwnsHome
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSkip={handleSkip}
              updateData={updateData}
              data={data}
            />
          )}

          {currentStep === 4 && (
            <Step4Mortgage
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSkip={handleSkip}
              updateData={updateData}
              data={data}
            />
          )}

          {currentStep === 5 && (
            <Step5Timeline
              onNext={handleNext}
              onPrevious={handlePrevious}
              updateData={updateData}
              data={data}
              isLastStep={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
