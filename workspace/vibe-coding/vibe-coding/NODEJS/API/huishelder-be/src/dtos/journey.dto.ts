import { IsBoolean, IsNumber, IsOptional, IsPositive, IsUUID, Min, IsEnum, IsString, IsDateString } from 'class-validator';
import { JourneyInitDto, FinancialSummaryDto, TimelineStepStatus, TimelineStepCategory } from '@interfaces/journey.interface';

export class JourneyInitRequestDto implements JourneyInitDto {
  @IsBoolean()
  public is_first_time_buyer: boolean;

  @IsBoolean()
  public is_selling_current_home: boolean;

  @IsBoolean()
  public has_bridge_loan: boolean;
}

export class CompleteTaskDto {
  @IsUUID()
  public task_id: string;
}

export class FinancialSummaryRequestDto implements FinancialSummaryDto {
  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsOptional()
  public estimated_mortgage?: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsOptional()
  public estimated_boeterente?: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsOptional()
  public bridge_loan_needed?: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsOptional()
  public monthly_gross?: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsOptional()
  public monthly_net?: number;
}
