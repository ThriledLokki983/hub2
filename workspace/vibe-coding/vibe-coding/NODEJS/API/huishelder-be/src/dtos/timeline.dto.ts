import { IsBoolean, IsNumber, IsOptional, IsPositive, IsUUID, Min, IsEnum, IsString, IsDateString } from 'class-validator';
import { TimelineStepStatus, TimelineStepCategory } from '@interfaces/journey.interface';

export class GenerateTimelineRequestDto {
  @IsOptional()
  public onboardingData?: any;
}

export class TimelineFiltersDto {
  @IsOptional()
  @IsEnum(TimelineStepStatus)
  public status?: TimelineStepStatus;

  @IsOptional()
  @IsEnum(TimelineStepCategory)
  public category?: TimelineStepCategory;

  @IsOptional()
  @IsString()
  public sort?: string;
}

export class TimelineStepUpdateRequestDto {
  @IsOptional()
  @IsEnum(TimelineStepStatus)
  public status?: TimelineStepStatus;

  @IsOptional()
  @IsDateString()
  public due_date?: Date;

  @IsOptional()
  @IsNumber()
  public priority?: number;

  @IsOptional()
  @IsBoolean()
  public notification_enabled?: boolean;

  @IsOptional()
  @IsString()
  public notes?: string;
}
