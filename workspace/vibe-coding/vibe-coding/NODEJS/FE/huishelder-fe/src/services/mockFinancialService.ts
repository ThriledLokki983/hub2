import {
  FinancialInput,
  FinancialOutput,
} from '../components/FinancialDashboard/FinancialDashboard.interface';

/**
 * Mock implementation of financial calculations API
 * Use this for development and testing purposes until the real API is ready
 */
export const mockFinancialCalculator = (input: FinancialInput): FinancialOutput => {
  // Determine if current home will be sold
  const sellsCurrentHome = input.current_home_value > 0;

  // Calculate how much mortgage the user can get based on income
  // A simple calculation: ~4.5x annual income
  const annualIncome = input.monthly_income * 12;
  let estimatedMortgage = annualIncome * 4.5;

  // Add extra savings to mortgage capacity
  estimatedMortgage += input.extra_savings;

  // If selling current home, calculate equity and add to mortgage capacity
  const equity = input.current_home_value - input.current_mortgage_left;
  if (equity > 0) {
    estimatedMortgage += equity;
  }

  // Calculate bridge loan if buying before selling
  const bridgeLoanAmount = sellsCurrentHome
    ? Math.max(0, input.new_home_price - estimatedMortgage)
    : 0;

  // Calculate boeterente (mortgage penalty) - simplified calculation
  // Around 2% of remaining mortgage for each year left in fixed term
  const estimatedBoeterente = Math.round(
    input.current_mortgage_left * 0.02 * Math.min(input.fixed_term_years, 5),
  );

  // Calculate buyer costs (approximate 4% of new home price)
  const totalBuyerCosts = Math.round(input.new_home_price * 0.04);

  // Calculate monthly payment - rough approximation based on interest and term
  // Using simplified mortgage formula
  const principal = Math.min(estimatedMortgage, input.new_home_price);
  const monthlyInterestRate = input.interest_rate / 100 / 12;
  const numberOfPayments = input.fixed_term_years * 12;

  // Calculate monthly payment using mortgage formula: P = (r*P)/(1-(1+r)^-n)
  const monthlyPaymentGross = Math.round(
    (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments)),
  );

  // Net payment after tax deduction (simplified: ~25% lower for Dutch tax system)
  const monthlyPaymentNet = Math.round(monthlyPaymentGross * 0.75);

  // Apply NHG effect if selected (lower interest rate and thus lower monthly payments)
  const nhgDiscount = input.include_nhg ? 0.9 : 1;

  return {
    id: `mock-${Date.now()}`, // Generate a unique mock ID
    created_at: new Date().toISOString(), // Current timestamp
    estimated_mortgage: Math.round(estimatedMortgage),
    estimated_boeterente: Math.round(estimatedBoeterente),
    bridge_loan_amount: Math.round(bridgeLoanAmount),
    total_buyer_costs: Math.round(totalBuyerCosts),
    monthly_payment_gross: Math.round(monthlyPaymentGross * nhgDiscount),
    monthly_payment_net: Math.round(monthlyPaymentNet * nhgDiscount),
  };
};
