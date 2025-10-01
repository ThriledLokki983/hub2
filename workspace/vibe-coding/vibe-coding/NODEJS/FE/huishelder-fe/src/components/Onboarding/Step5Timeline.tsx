import React from 'react';
import { OnboardingStepProps, OnboardingTimeline } from './Onboarding.interface';
import styles from './Onboarding.module.scss';
import { Icon } from 'components';

const TIMELINES: { id: OnboardingTimeline; title: string; description: string }[] = [
  {
    id: 'within_3_months',
    title: 'Within 3 months',
    description: 'I need to move very soon',
  },
  {
    id: '3_6_months',
    title: '3–6 months',
    description: 'Planning to move in the near future',
  },
  {
    id: '6_12_months',
    title: '6–12 months',
    description: 'Considering a move within a year',
  },
  {
    id: 'just_looking',
    title: 'Just looking',
    description: 'Researching without a specific timeline',
  },
];

const Step5Timeline: React.FC<OnboardingStepProps> = ({
  onNext,
  onPrevious,
  updateData,
  data,
  isLastStep,
}) => {
  const handleSelect = (timeline: OnboardingTimeline) => {
    updateData({ timeline });
    onNext();
  };

  return (
    <div className={styles.step}>
      <h3>What&apos;s your rough timeline?</h3>
      <p>When are you looking to move or complete your real estate transaction?</p>

      <div className={`${styles.optionsList} ${styles.timeline}`}>
        {TIMELINES.map(timeline => (
          <div
            key={timeline.id}
            className={`${styles.optionCard} ${data.timeline === timeline.id ? styles.selected : ''}`}
            onClick={() => handleSelect(timeline.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {timeline.id === 'within_3_months' && (
                <Icon name="lightning" phosphor="Lightning" weight="light" width={24} />
              )}
              {timeline.id === '3_6_months' && (
                <Icon name="calendar" phosphor="Calendar" weight="light" width={24} />
              )}
              {timeline.id === '6_12_months' && (
                <Icon name="calendar-blank" phosphor="CalendarBlank" weight="light" width={24} />
              )}
              {timeline.id === 'just_looking' && (
                <Icon name="binoculars" phosphor="Binoculars" weight="light" width={24} />
              )}
              <div style={{ marginLeft: '12px', textAlign: 'left' }}>
                <h4>{timeline.title}</h4>
                <p>{timeline.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button onClick={onPrevious} className={`${styles.button} ${styles.secondary}`}>
          Back
        </button>
        {isLastStep && (
          <button onClick={() => onNext()} className={`${styles.button} ${styles.primary}`}>
            Finish Setup
          </button>
        )}
      </div>
    </div>
  );
};

export default Step5Timeline;
