import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  FinancialInput,
  FinancialOutput,
  FinancialDashboardContainerProps,
} from './FinancialDashboard.interface';
// Import from index.tsx to avoid direct module resolution issues
import { FinancialForm, FinancialResults } from './';
import styles from './DashboardContainer.module.scss';
import classNames from 'classnames';
import { useAppStateContext } from '../../contexts';
import { FinancialService } from '../../services/financialService';

/**
 * Financial Dashboard Container Component
 * Manages the state and data flow between the form and results
 */
const FinancialDashboardContainer: React.FC<FinancialDashboardContainerProps> = ({ className }) => {
  const [results, setResults] = useState<FinancialOutput | null>(null);
  const { showError } = useAppStateContext();

  // Setup mutation for form submission using React Query
  const mutation = useMutation({
    mutationFn: async (formData: FinancialInput) => {
      const response = await FinancialService.calculateFinancialSnapshot(formData);
      return response.data;
    },
    onSuccess: data => {
      console.log('Financial calculation success:', data);

      setResults(data.data);
      window.scrollTo({
        top: document.getElementById('results')?.offsetTop || 0,
        behavior: 'smooth',
      });
    },
    onError: error => {
      console.error('Financial calculation error:', error);
      showError({
        title: 'Fout',
        message:
          'Er is een fout opgetreden bij het berekenen van uw financiële overzicht. Probeer het later opnieuw.',
        active: true,
      });
    },
  });

  return (
    <div className={classNames(styles.container, className)}>
      <h1 className={styles.title}>Financieel Dashboard</h1>
      <p className={styles.subtitle}>
        Bereken uw hypotheek, overbruggingskrediet en financiële mogelijkheden voor uw nieuwe woning
      </p>

      <div className={styles.dashboardSection}>
        <div className={styles.formContainer}>
          <FinancialForm
            onSubmit={(values: FinancialInput) => mutation.mutate(values)}
            isLoading={mutation.isPending}
          />
        </div>
      </div>

      {results && (
        <div id="results" className={styles.resultsContainer}>
          <h2 className={styles.title}>Uw Financieel Overzicht</h2>
          <FinancialResults data={results} />
        </div>
      )}

      {/* Toast notifications are handled by the AppStateContext */}
    </div>
  );
};

export default FinancialDashboardContainer;
