import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MortgageChartProps } from './FinancialDashboard.interface';
import styles from './DashboardContainer.module.scss';

// Chart colors in the system palette
const COLORS = ['#3A4F41', '#F4C77B', '#C25A5A', '#6E7673'];

/**
 * Mortgage Chart Component
 * Displays a visual representation of the mortgage and financial data
 * using Recharts library
 */
const MortgageChart: React.FC<MortgageChartProps> = ({ data }) => {
  // Calculate some metrics for visualization
  const monthlyPaymentRatio = data.monthly_payment_net / data.monthly_payment_gross;
  const savingsPercent = Math.round((1 - monthlyPaymentRatio) * 100);

  // Format data for payment comparison chart
  const paymentData = [
    { name: 'Bruto', value: data.monthly_payment_gross },
    { name: 'Netto', value: data.monthly_payment_net },
  ];

  // Format data for costs breakdown
  const costsData = [
    { name: 'Hypotheek', value: data.estimated_mortgage },
    { name: 'Overbrugging', value: data.bridge_loan_amount },
    { name: 'Boeterente', value: data.estimated_boeterente },
    { name: 'Kosten Koper', value: data.total_buyer_costs },
  ];

  return (
    <div className={styles.chartWrapper}>
      <h3 className={styles.cardTitle}>Financieel Overzicht</h3>

      {/* Monthly Payment Comparison Chart */}
      <div className={styles.chartSection}>
        <h4 className={styles.chartSubtitle}>Maandlasten Vergelijking</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={paymentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `€${value.toLocaleString('nl-NL')}`} />
            <Legend />
            <Bar dataKey="value" name="Maandlasten" fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className={styles.chartInfo}>
          Uw netto maandlasten zijn {savingsPercent}% lager dan de bruto maandlasten
        </p>
      </div>

      {/* Costs Breakdown Chart */}
      <div className={styles.chartSection}>
        <h4 className={styles.chartSubtitle}>Kosten Verdeling</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={costsData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }: { name: string; percent: number }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {costsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `€${value.toLocaleString('nl-NL')}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.financialSummary}>
        <p>Belangrijkste punten uit uw financiële analyse:</p>
        <ul>
          <li>
            Uw hypotheek bedraagt{' '}
            {((data.estimated_mortgage / data.bridge_loan_amount) * 100).toFixed(0)}% van het
            overbruggingskrediet
          </li>
          <li>Uw netto maandlasten zijn {savingsPercent}% lager dan de bruto maandlasten</li>
          <li>
            Bijkomende kosten zijn{' '}
            {((data.total_buyer_costs / data.estimated_mortgage) * 100).toFixed(1)}% van uw
            hypotheeksom
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MortgageChart;
