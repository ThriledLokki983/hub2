import React from 'react';
import { OnboardingStepProps } from './Onboarding.interface';
import styles from './Onboarding.module.scss';
import { Icon } from 'components';

const Step4Mortgage: React.FC<OnboardingStepProps> = ({
  onNext,
  onPrevious,
  onSkip,
  updateData,
  data,
}) => {
  const handleSelect = (value: boolean) => {
    updateData({ has_existing_mortgage: value });
    onNext();
  };

  // Skip this question if the user doesn't own a home
  if (data.owns_home === false) {
    // Update the data automatically and move to next step
    setTimeout(() => {
      updateData({ has_existing_mortgage: false });
      onNext();
    }, 0);
    return null;
  }

  return (
    <div className={styles.step}>
      <h3>Do you have an existing mortgage?</h3>
      <p>This helps us tailor financial recommendations for your situation</p>

      <div className={styles.toggle}>
        <div
          className={`${styles.toggleOption} ${data.has_existing_mortgage === true ? styles.selected : ''}`}
          onClick={() => handleSelect(true)}
        >
          <Icon name="bank" phosphor="Bank" weight="light" width={24} />
          <h4>Yes</h4>
          <p>I have a mortgage</p>
        </div>

        <div
          className={`${styles.toggleOption} ${data.has_existing_mortgage === false ? styles.selected : ''}`}
          onClick={() => handleSelect(false)}
        >
          <Icon name="x" phosphor="X" weight="light" width={24} />
          <h4>No</h4>
          <p>No mortgage</p>
        </div>
      </div>

      <div className={styles.footer}>
        <button onClick={onPrevious} className={`${styles.button} ${styles.secondary}`}>
          Back
        </button>
      </div>

      {onSkip && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={onSkip} className={styles.skip}>
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
};

export default Step4Mortgage;
