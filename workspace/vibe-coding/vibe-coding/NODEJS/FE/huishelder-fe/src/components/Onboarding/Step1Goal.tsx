import React from 'react';
import { OnboardingStepProps, OnboardingGoal } from './Onboarding.interface';
import styles from './Onboarding.module.scss';
import { Icon } from 'components';

const GOALS: { id: OnboardingGoal; title: string; description: string }[] = [
  {
    id: 'buying',
    title: 'Buying',
    description: 'Looking to purchase a new home',
  },
  {
    id: 'selling',
    title: 'Selling',
    description: 'Planning to sell your current home',
  },
  {
    id: 'both',
    title: 'Both',
    description: 'Selling current home and buying a new one',
  },
  {
    id: 'exploring',
    title: 'Just Exploring',
    description: 'Researching the market',
  },
];

const Step1Goal: React.FC<OnboardingStepProps> = ({ onNext, onSkip, updateData, data }) => {
  const handleSelect = (goal: OnboardingGoal) => {
    updateData({ goal });
    onNext();
  };

  return (
    <div className={styles.step}>
      <h3>What are you trying to do?</h3>
      <p>Select the option that best describes your current real estate goals</p>

      <div className={styles.optionsList}>
        {GOALS.map(goal => (
          <div
            key={goal.id}
            className={`${styles.optionCard} ${data.goal === goal.id ? styles.selected : ''}`}
            onClick={() => handleSelect(goal.id)}
          >
            {goal.id === 'buying' && (
              <Icon name="home-simple" phosphor="HouseSimple" weight="light" width={24} />
            )}
            {goal.id === 'selling' && <Icon name="tag" phosphor="Tag" weight="light" width={24} />}
            {goal.id === 'both' && (
              <Icon name="arrows-exchange" phosphor="ArrowsLeftRight" weight="light" width={24} />
            )}
            {goal.id === 'exploring' && (
              <Icon name="magnifying-glass" phosphor="MagnifyingGlass" weight="light" width={24} />
            )}
            <h4>{goal.title}</h4>
            <p>{goal.description}</p>
          </div>
        ))}
      </div>

      {onSkip && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button onClick={onSkip} className={styles.skip}>
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
};

export default Step1Goal;
