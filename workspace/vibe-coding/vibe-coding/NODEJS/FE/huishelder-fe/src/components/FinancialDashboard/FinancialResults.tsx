import React from 'react';
import { FinancialResultsProps } from './FinancialDashboard.interface';
import ResultCard from './ResultCard';
// Import from index.tsx to avoid direct module resolution issues
import { MortgageChart } from './';
import styles from './DashboardContainer.module.scss';
import classNames from 'classnames';

/**
 * Financial Results Component
 * Displays the calculated financial data in cards and charts
 */
const FinancialResults: React.FC<FinancialResultsProps> = ({ data, className }) => {
  console.log('FinancialResults data:', data);

  // Determine status indicators based on financial health
  const getMortgageStatus = () => {
    // Example logic: If mortgage is >80% of home price = warning
    const mortgageRatio = data.estimated_mortgage / data.bridge_loan_amount;
    if (mortgageRatio > 0.95) return 'error';
    if (mortgageRatio > 0.8) return 'warning';
    return 'success';
  };

  const getBoeterenteStatus = () => {
    // If penalty is high, show warning
    if (data.estimated_boeterente > 10000) return 'error';
    if (data.estimated_boeterente > 5000) return 'warning';
    return 'info';
  };

  const getBridgeLoanStatus = () => {
    // If bridge loan is very high compared to current home value, show warning
    if (data.bridge_loan_amount > data.estimated_mortgage * 0.5) return 'warning';
    return 'info';
  };

  return (
    <div className={classNames(styles.resultsSection, className)}>
      <div className={styles.resultsGrid}>
        <ResultCard
          title="Hypotheek"
          value={data.estimated_mortgage}
          description="Geschatte hypotheek op basis van uw inkomen en uitgaven"
          status={getMortgageStatus()}
        />

        <ResultCard
          title="Boeterente"
          value={data.estimated_boeterente}
          description="Geschatte boeterente bij vervroegd aflossen"
          status={getBoeterenteStatus()}
        />

        <ResultCard
          title="Overbruggingskrediet"
          value={data.bridge_loan_amount}
          description="Benodigd overbruggingskrediet tijdens transitie"
          status={getBridgeLoanStatus()}
        />

        <ResultCard
          title="Kosten koper"
          value={data.total_buyer_costs}
          description="Totale bijkomende kosten voor de koper"
          status="info"
        />

        <ResultCard
          title="Maandlasten bruto"
          value={data.monthly_payment_gross}
          description="Maandelijkse hypotheeklasten voor belastingaftrek"
          status="info"
        />

        <ResultCard
          title="Maandlasten netto"
          value={data.monthly_payment_net}
          description="Maandelijkse hypotheeklasten na belastingaftrek"
          status="info"
        />
      </div>

      <div className={styles.chartContainer}>
        <MortgageChart data={data} />
      </div>
    </div>
  );
};

export default FinancialResults;
