import React from 'react';
import { FinancialSummaryProps } from './FinancialSummary.interface';
import styles from './FinancialSummary.module.scss';

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ financialData }) => {
  // Check if we have a valid object
  if (!financialData || typeof financialData !== 'object') {
    return (
      <div className={styles.financialContainer}>
        <h2 className={styles.sectionTitle}>Financieel Overzicht</h2>
        <p className={styles.emptyState}>Geen financiële informatie beschikbaar.</p>
      </div>
    );
  }

  // If we got an API response object instead of the actual data, extract the data
  if (
    financialData &&
    typeof financialData === 'object' &&
    'success' in financialData &&
    'data' in financialData &&
    'statusCode' in financialData &&
    'message' in financialData
  ) {
    const apiResponse = financialData as { data: { data: Record<string, unknown> } };
    if (apiResponse.data?.data) {
      financialData = apiResponse.data.data;
    } else {
      console.error('Invalid API response structure', financialData);
      return (
        <div className={styles.financialContainer}>
          <h2 className={styles.sectionTitle}>Financieel Overzicht</h2>
          <p className={styles.emptyState}>
            Er is een probleem opgetreden bij het laden van de financiële gegevens.
          </p>
        </div>
      );
    }
  }

  // Create a helper function for safe extraction of financial data values
  const safeGetNumber = (key: string, defaultValue: number = 0): number => {
    // Handle the financialData as a generic record with string keys
    const data = financialData as Record<string, unknown>;

    // Try camelCase key first
    if (key in data) {
      if (typeof data[key] === 'number') {
        return data[key] as number;
      }
      if (typeof data[key] === 'string') {
        const num = Number(data[key]);
        if (!isNaN(num)) {
          return num;
        }
      }
    }

    // Convert to snake_case and try again
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    if (snakeKey in data) {
      if (typeof data[snakeKey] === 'number') {
        return data[snakeKey] as number;
      }
      if (typeof data[snakeKey] === 'string') {
        const num = Number(data[snakeKey]);
        if (!isNaN(num)) {
          return num;
        }
      }
    }

    return defaultValue;
  };

  // Extract values safely with fallbacks
  const estimatedMortgage = safeGetNumber('estimatedMortgage', 0);
  const monthlyGrossCost = safeGetNumber('monthlyGrossCost', 0);
  const monthlyNetCost = safeGetNumber('monthlyNetCost', 0);
  const bridgeLoan = safeGetNumber('bridgeLoan', 0);
  const boeterente = safeGetNumber('boeterente', 0);

  // Safe function to extract additional costs
  const additionalCosts: Record<string, number> = {};

  // Try to get additional costs from camelCase or snake_case
  const data = financialData as Record<string, unknown>;
  const additionalCostsSource =
    data.additionalCosts && typeof data.additionalCosts === 'object'
      ? data.additionalCosts
      : data.additional_costs && typeof data.additional_costs === 'object'
        ? data.additional_costs
        : null;

  // Copy properties to our additionalCosts object, ensuring all values are numbers
  if (additionalCostsSource) {
    Object.entries(additionalCostsSource as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === 'number') {
        additionalCosts[key] = value;
      } else if (typeof value === 'string') {
        const num = Number(value);
        if (!isNaN(num)) {
          additionalCosts[key] = num;
        }
      }
    });
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Calculate total additional costs safely
  const totalAdditionalCosts = Object.values(additionalCosts).reduce(
    (sum, cost) => sum + (cost || 0),
    0,
  );

  // For empty financial data, show a message
  const hasData =
    estimatedMortgage > 0 ||
    monthlyGrossCost > 0 ||
    monthlyNetCost > 0 ||
    bridgeLoan > 0 ||
    boeterente > 0 ||
    totalAdditionalCosts > 0;

  if (!hasData) {
    return (
      <div className={styles.financialContainer}>
        <h2 className={styles.sectionTitle}>Financieel Overzicht</h2>
        <p className={styles.emptyState}>Uw financiële gegevens worden nog berekend.</p>
      </div>
    );
  }

  return (
    <div className={styles.financialContainer}>
      <h2 className={styles.sectionTitle}>Financieel Overzicht</h2>

      {estimatedMortgage > 0 && (
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Geschatte Hypotheek</div>
          <div className={styles.statValue}>{formatCurrency(estimatedMortgage)}</div>
        </div>
      )}

      {monthlyGrossCost > 0 && (
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Maandelijkse bruto kosten</div>
          <div className={styles.statValue}>{formatCurrency(monthlyGrossCost)}</div>
        </div>
      )}

      {monthlyNetCost > 0 && (
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Maandelijkse netto kosten</div>
          <div className={styles.statValue}>{formatCurrency(monthlyNetCost)}</div>
        </div>
      )}

      {bridgeLoan > 0 && (
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Overbruggingskrediet</div>
          <div className={styles.statValue}>{formatCurrency(bridgeLoan)}</div>
        </div>
      )}

      {boeterente > 0 && (
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Boeterente</div>
          <div className={styles.statValue}>{formatCurrency(boeterente)}</div>
        </div>
      )}

      {totalAdditionalCosts > 0 && (
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Bijkomende kosten</div>
          <div className={styles.statValue}>{formatCurrency(totalAdditionalCosts)}</div>
        </div>
      )}

      {Object.keys(additionalCosts).length > 0 && (
        <div className={styles.paymentSchedule}>
          <div className={styles.paymentTitle}>Specificatie bijkomende kosten</div>
          {Object.entries(additionalCosts).map(([name, amount], index) => (
            <div className={styles.paymentItem} key={index}>
              <div className={styles.paymentDate}>{name}</div>
              <div className={styles.paymentAmount}>{formatCurrency(amount)}</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.dashboardLinkContainer}>
        <a href="/financial-dashboard" className={styles.dashboardLink}>
          <span className={styles.dashboardLinkIcon}>📊</span>
          <span>
            <strong>Financieel Dashboard openen</strong>
            <span className={styles.dashboardLinkSubtitle}>
              Bereken uw hypotheek, kosten koper en meer
            </span>
          </span>
        </a>
      </div>
    </div>
  );
};

export default FinancialSummary;
