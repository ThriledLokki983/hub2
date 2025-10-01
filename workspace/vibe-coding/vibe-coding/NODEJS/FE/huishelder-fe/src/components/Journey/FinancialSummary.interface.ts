import { FinancialSummary } from '../../hooks/interfaces/journey';

export interface FinancialSummaryProps {
  financialData: FinancialSummary | Record<string, unknown>; // Allow object type to handle API response objects
}

export interface PaymentScheduleItem {
  date: string;
  amount: number;
}

// This is for backward compatibility with the existing component
export interface LegacyFinancialData {
  loanAmount: number;
  approvalStatus: string;
  interestRate: number;
  monthlyPayment: number;
  totalAmountDue: number;
  paymentSchedule?: PaymentScheduleItem[];
}
