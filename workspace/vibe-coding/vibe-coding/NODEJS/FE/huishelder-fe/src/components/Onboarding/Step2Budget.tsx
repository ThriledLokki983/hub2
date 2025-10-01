import React, { useState } from 'react';
import { OnboardingStepProps } from './Onboarding.interface';
import styles from './Onboarding.module.scss';

const MIN_BUDGET = 100000; // €100,000
const MAX_BUDGET = 1500000; // €1,500,000
const STEP = 10000; // €10,000 increments

const Step2Budget: React.FC<OnboardingStepProps> = ({
  onNext,
  onPrevious,
  onSkip,
  updateData,
  data,
}) => {
  const [minValue, setMinValue] = useState<number>(data.budget_min || 300000);
  const [maxValue, setMaxValue] = useState<number>(data.budget_max || 500000);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= MIN_BUDGET && value < maxValue) {
      setMinValue(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value <= MAX_BUDGET && value > minValue) {
      setMaxValue(value);
    }
  };

  const handleSubmit = () => {
    updateData({
      budget_min: minValue,
      budget_max: maxValue,
    });
    onNext();
  };

  return (
    <div className={styles.step}>
      <h3>What&apos;s your budget?</h3>
      <p>Set your minimum and maximum budget for a property</p>

      <div className={styles.sliderContainer}>
        <div className={styles.rangeValues}>
          <div className={styles.rangeValue}>
            <label htmlFor="min-budget">Minimum Budget</label>
            <input
              id="min-budget"
              type="text"
              value={formatCurrency(minValue)}
              onChange={handleMinChange}
            />
          </div>
          <div className={styles.rangeValue}>
            <label htmlFor="max-budget">Maximum Budget</label>
            <input
              id="max-budget"
              type="text"
              value={formatCurrency(maxValue)}
              onChange={handleMaxChange}
            />
          </div>
        </div>

        <div className={styles.rangeLimits}>
          <span>{formatCurrency(MIN_BUDGET)}</span>
          <span>{formatCurrency(MAX_BUDGET)}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <button onClick={onPrevious} className={`${styles.button} ${styles.secondary}`}>
          Back
        </button>
        <button onClick={handleSubmit} className={`${styles.button} ${styles.primary}`}>
          Continue
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

export default Step2Budget;
