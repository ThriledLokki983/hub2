import React, { useState, useCallback } from 'react';
import { FinancialInput, FinancialFormProps } from './FinancialDashboard.interface';
import { LabeledInput, Button } from '../';
import styles from './DashboardContainer.module.scss';

/**
 * Financial Form Component
 * A form for collecting user's financial inputs for mortgage calculations
 */
const FinancialForm: React.FC<FinancialFormProps> = ({ onSubmit, isLoading }) => {
  const [formValues, setFormValues] = useState<FinancialInput>({
    current_home_value: 450000,
    current_mortgage_left: 300000,
    new_home_price: 600000,
    interest_rate: 3.5,
    fixed_term_years: 20,
    monthly_income: 5500,
    include_nhg: true,
    extra_savings: 20000,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FinancialInput, string>>>({});

  // Validate a single field
  const validateField = (field: keyof FinancialInput, value: number | boolean): string => {
    if (typeof value === 'boolean') return '';

    if (value < 0) return 'Waarde moet positief zijn';

    if (field === 'interest_rate') {
      if (value < 0.1) return 'Rente moet minimaal 0.1% zijn';
      if (value > 10) return 'Rente mag maximaal 10% zijn';
    }

    if (field === 'fixed_term_years') {
      if (value < 1) return 'Looptijd moet minimaal 1 jaar zijn';
      if (value > 30) return 'Looptijd mag maximaal 30 jaar zijn';
    }

    return '';
  };

  // Update form values and validate on change
  const handleChange = useCallback((field: keyof FinancialInput, value: number | boolean) => {
    // Batch the state updates to reduce renders
    const error = validateField(field, value);

    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));

    // Only update errors if there's a change
    setErrors(prev => {
      const currentError = prev[field];
      if (currentError === error) return prev;

      return {
        ...prev,
        [field]: error,
      };
    });
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<Record<keyof FinancialInput, string>> = {};
    let hasError = false;

    (Object.keys(formValues) as Array<keyof FinancialInput>).forEach(key => {
      if (key !== 'include_nhg') {
        // Skip boolean fields
        const error = validateField(key, formValues[key] as number);
        if (error) {
          newErrors[key] = error;
          hasError = true;
        }
      }
    });

    setErrors(newErrors);

    if (!hasError) {
      onSubmit(formValues);
    }
  };

  // Custom number input component with validation
  const NumberInput = React.memo(
    ({
      id,
      label,
      value,
      onChange,
      error,
    }: {
      id: keyof FinancialInput;
      label: string;
      value: number;
      onChange: (val: number) => void;
      error?: string;
    }) => {
      // Use a callback for the onChange to prevent re-renders
      const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          // Use requestAnimationFrame to prevent losing focus on state update
          requestAnimationFrame(() => {
            onChange(parseFloat(e.target.value) || 0);
          });
        },
        [onChange],
      );

      return (
        <div>
          <LabeledInput id={id} label={label}>
            <input
              type="number"
              id={id}
              name={id}
              value={value}
              onChange={handleInputChange}
              step={id === 'interest_rate' ? 0.1 : 1}
              min={0}
              className={errors[id] ? 'error' : ''}
            />
          </LabeledInput>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
      );
    },
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <NumberInput
          id="current_home_value"
          label="Huidige woningwaarde (€)"
          value={formValues.current_home_value}
          onChange={val => handleChange('current_home_value', val)}
          error={errors.current_home_value}
        />

        <NumberInput
          id="current_mortgage_left"
          label="Resterende hypotheek (€)"
          value={formValues.current_mortgage_left}
          onChange={val => handleChange('current_mortgage_left', val)}
          error={errors.current_mortgage_left}
        />

        <NumberInput
          id="new_home_price"
          label="Nieuwe woningprijs (€)"
          value={formValues.new_home_price}
          onChange={val => handleChange('new_home_price', val)}
          error={errors.new_home_price}
        />

        <NumberInput
          id="interest_rate"
          label="Rentepercentage (%)"
          value={formValues.interest_rate}
          onChange={val => handleChange('interest_rate', val)}
          error={errors.interest_rate}
        />

        <NumberInput
          id="fixed_term_years"
          label="Rentevaste periode (jaren)"
          value={formValues.fixed_term_years}
          onChange={val => handleChange('fixed_term_years', val)}
          error={errors.fixed_term_years}
        />

        <NumberInput
          id="monthly_income"
          label="Maandelijks inkomen (€)"
          value={formValues.monthly_income}
          onChange={val => handleChange('monthly_income', val)}
          error={errors.monthly_income}
        />

        <NumberInput
          id="extra_savings"
          label="Extra spaargeld (€)"
          value={formValues.extra_savings}
          onChange={val => handleChange('extra_savings', val)}
          error={errors.extra_savings}
        />

        <div className={styles.toggleContainer}>
          <span className={styles.toggleLabel}>NHG meenemen</span>
          <input
            type="checkbox"
            id="include_nhg"
            checked={formValues.include_nhg}
            onChange={e => handleChange('include_nhg', e.target.checked)}
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Berekenen...' : 'Bereken financieel overzicht'}
        </Button>
      </div>
    </form>
  );
};

export default FinancialForm;
