import { IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateFinancialSnapshotDto {
  @IsNumber()
  @Min(0)
  current_home_value: number;

  @IsNumber()
  @Min(0)
  current_mortgage_left: number;

  @IsNumber()
  @Min(0)
  new_home_price: number;

  @IsNumber()
  @Min(0)
  interest_rate: number;

  @IsNumber()
  @Min(1)
  fixed_term_years: number;

  @IsNumber()
  @Min(0)
  monthly_income: number;

  @IsBoolean()
  include_nhg: boolean;

  @IsNumber()
  @Min(0)
  extra_savings: number;
}

export class FinancialSnapshotResponseDto {
  id: string;
  estimated_mortgage: number;
  estimated_boeterente: number;
  bridge_loan_amount: number;
  total_buyer_costs: number;
  monthly_payment_gross: number;
  monthly_payment_net: number;
  created_at: Date;
}
