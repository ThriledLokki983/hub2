/**
 * Financial dashboard interfaces
 */

// Input form values
export interface FinancialInput {
  current_home_value: number;
  current_mortgage_left: number;
  new_home_price: number;
  interest_rate: number;
  fixed_term_years: number;
  monthly_income: number;
  extra_savings: number;
  include_nhg: boolean;
}

// Output response from API
export interface FinancialOutput {
  estimated_mortgage: number;
  estimated_boeterente: number;
  bridge_loan_amount: number;
  total_buyer_costs: number;
  monthly_payment_gross: number;
  monthly_payment_net: number;
  id: string;
  created_at: string;
}

// Props for the container component
export interface FinancialDashboardContainerProps {
  className?: string;
}

// Props for the form component
export interface FinancialFormProps {
  onSubmit: (values: FinancialInput) => void;
  isLoading: boolean;
}

// Props for the results component
export interface FinancialResultsProps {
  data: FinancialOutput;
  className?: string;
}

// Props for the result card component
export interface ResultCardProps {
  title: string;
  value: number;
  description?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

// Props for the mortgage chart component
export interface MortgageChartProps {
  data: FinancialOutput;
  className?: string;
}
