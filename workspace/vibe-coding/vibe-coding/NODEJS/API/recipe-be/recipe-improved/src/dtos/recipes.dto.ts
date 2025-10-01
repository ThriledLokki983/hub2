import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength, ValidateNested, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateRecipeDto {
  @IsString()
  @Length(3, 255)
  public title: string;

  @IsOptional()
  @IsString()
  public slug?: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString()
  public chef?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  public category?: string;

  @IsOptional()
  @IsUUID('4')
  public region_id?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public tags?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  public tag_ids?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  public prep_time?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public cook_time?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public total_time?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  public servings?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public difficulty?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public calories?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public protein?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public fat?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public carbohydrates?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  public status?: string;

  @IsOptional()
  @IsBoolean()
  public is_public?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  public source?: string;
}

export class UpdateRecipeDto extends CreateRecipeDto {}

export class CreateIngredientDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  public quantity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public unit?: string;

  @IsOptional()
  @IsString()
  public notes?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public order_index?: number;
}

export class CreateIngredientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIngredientDto)
  public ingredients: CreateIngredientDto[];
}

export class CreateInstructionDto {
  @IsNumber()
  @Min(1)
  public step_number: number;

  @IsString()
  @MinLength(1)
  public instruction: string;
}

export class CreateInstructionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInstructionDto)
  public instructions: CreateInstructionDto[];
}

export class RecipeQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public limit?: number;

  @IsOptional()
  @IsString()
  public category?: string;

  @IsOptional()
  @IsString()
  public search?: string;

  @IsOptional()
  @IsUUID()
  public user_id?: string;

  @IsOptional()
  @IsString()
  public tags?: string;

  @IsOptional()
  @IsString()
  public sort?: string;

  @IsOptional()
  @IsString()
  public sort_direction?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  public tag_ids?: string[];

  // Advanced filter parameters
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public max_prep_time?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public max_cook_time?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public max_total_time?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public min_calories?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public max_calories?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public min_protein?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public max_protein?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public min_fat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public max_fat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public min_carbs?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public max_carbs?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  public exclude_ingredients?: string[];
}

export class CreateTagDto {
  @IsString()
  @Length(1, 100)
  public name: string;

  @IsOptional()
  @IsString()
  public slug?: string;

  @IsOptional()
  @IsString()
  public description?: string;
}

export class UpdateTagDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  public name?: string;

  @IsOptional()
  @IsString()
  public slug?: string;

  @IsOptional()
  @IsString()
  public description?: string;
}

export class TagRecipeDto {
  @IsUUID('4', { each: true })
  public tag_ids: string[];
}

export class CreateRegionDto {
  @IsString()
  @Length(1, 100)
  public name: string;

  @IsOptional()
  @IsString()
  public description?: string;
}

export class UpdateRegionDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  public name?: string;

  @IsOptional()
  @IsString()
  public description?: string;
}

export class RecipeRegionDto {
  @IsUUID('4')
  public region_id: string;
}

export class CreateRatingDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  public rating: number;
}

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  public comment: string;
}

export class UpdateCommentDto {
  @IsString()
  @MinLength(1)
  public comment: string;
}
