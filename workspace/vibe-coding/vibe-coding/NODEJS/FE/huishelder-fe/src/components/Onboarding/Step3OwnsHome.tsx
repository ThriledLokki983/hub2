import React, { useState } from 'react';
import { OnboardingStepProps } from './Onboarding.interface';
import styles from './Onboarding.module.scss';
import { Icon } from 'components';

const Step3OwnsHome = ({ onNext, onPrevious, onSkip, updateData, data }: OnboardingStepProps) => {
  const [hoveredOption, setHoveredOption] = useState<boolean | null>(null);

  const handleSelect = (value: boolean) => {
    updateData({ owns_home: value });
    onNext();
  };

  return (
    <div className={styles.step}>
      <h3 className={styles.stepTitle}>Current Home Ownership</h3>
      <p className={styles.stepDescription}>
        This helps us tailor property recommendations to your specific situation
      </p>

      <div className={styles.toggleContainer}>
        <div className={styles.toggle}>
          <div
            className={`${styles.toggleOption} ${data.owns_home === true ? styles.selected : ''}`}
            onClick={() => handleSelect(true)}
            onMouseEnter={() => setHoveredOption(true)}
            onMouseLeave={() => setHoveredOption(null)}
            role="button"
            tabIndex={0}
            aria-pressed={data.owns_home === true}
          >
            <div
              className={`${styles.iconWrapper} ${hoveredOption === true ? styles.iconHovered : ''}`}
            >
              <Icon name="house" phosphor="House" weight="light" width={32} />
            </div>
            <h4>Yes, I Own a Home</h4>
            <p>I currently own a property</p>

            {data.owns_home === true && (
              <div className={styles.selectionIndicator}>
                <Icon name="check-circle" phosphor="CheckCircle" weight="fill" width={20} />
              </div>
            )}
          </div>

          <div
            className={`${styles.toggleOption} ${data.owns_home === false ? styles.selected : ''}`}
            onClick={() => handleSelect(false)}
            onMouseEnter={() => setHoveredOption(false)}
            onMouseLeave={() => setHoveredOption(null)}
            role="button"
            tabIndex={0}
            aria-pressed={data.owns_home === false}
          >
            <div
              className={`${styles.iconWrapper} ${hoveredOption === false ? styles.iconHovered : ''}`}
            >
              <Icon name="buildings" phosphor="Buildings" weight="light" width={32} />
            </div>
            <h4>No, I Don&apos;t Own a Home</h4>
            <p>I&apos;m looking to purchase</p>

            {data.owns_home === false && (
              <div className={styles.selectionIndicator}>
                <Icon name="check-circle" phosphor="CheckCircle" weight="fill" width={20} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.navigationControls}>
        <button
          onClick={onPrevious}
          className={`${styles.button} ${styles.secondary}`}
          aria-label="Go back to previous step"
        >
          <Icon name="arrow-left" phosphor="ArrowLeft" weight="regular" width={16} />
          <span>Previous</span>
        </button>

        <div className={styles.rightControls}>
          {onSkip && (
            <button onClick={onSkip} className={styles.skip} aria-label="Skip this step for now">
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Export the component
export default Step3OwnsHome;
