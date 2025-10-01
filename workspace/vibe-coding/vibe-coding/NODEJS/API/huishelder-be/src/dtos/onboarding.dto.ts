import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { GoalType, TimelineType } from '@interfaces/onboarding.interface';

export class OnboardingDto {
  @IsEnum(GoalType, { message: 'Goal must be one of: buying, selling, both, exploring' })
  public goal: GoalType;

  @IsInt()
  @Min(0)
  @IsOptional()
  public budget_min?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  public budget_max?: number;

  @IsBoolean()
  public owns_home: boolean;

  @IsBoolean()
  public has_existing_mortgage: boolean;

  @IsEnum(TimelineType, { message: 'Timeline must be one of: <3_months, 3_6_months, 6_12_months, just_looking' })
  public timeline: TimelineType;
}
