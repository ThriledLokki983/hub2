export interface FinancialInput {
  id: string;
  user_id: string;
  created_at: Date;
  current_home_value: number;
  current_mortgage_left: number;
  new_home_price: number;
  interest_rate: number;
  fixed_term_years: number;
  monthly_income: number;
  include_nhg: boolean;
  extra_savings: number;
}

export interface FinancialOutput {
  id: string;
  input_id: string;
  created_at: Date;
  estimated_mortgage: number;
  estimated_boeterente: number;
  bridge_loan_amount: number;
  total_buyer_costs: number;
  monthly_payment_gross: number;
  monthly_payment_net: number;
}

export interface FinancialSnapshot extends FinancialOutput {
  input: FinancialInput;
}
