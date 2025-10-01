import React from 'react';
import { OnboardingProgressProps } from './Onboarding.interface';
import styles from './Onboarding.module.scss';

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ currentStep, totalSteps }) => {
  const progress = Math.floor((currentStep / totalSteps) * 5); // Scale to 0-5 for our CSS classes

  return (
    <div className={`${styles.progressContainer} ${styles[`progress-${progress}`]}`}>
      <div className={styles.progressBar}></div>
      <div className={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default OnboardingProgress;
