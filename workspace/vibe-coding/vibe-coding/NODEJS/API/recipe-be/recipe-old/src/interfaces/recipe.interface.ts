export interface Recipe {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  image: string;
  chef: string;
  cook_time: string;
  prep_time: string;
  total_time: string;
  servings: number;
  difficulty: string;
  ingredients?: RecipeIngredient[];
  instructions?: RecipeInstruction[];
  photos?: string[];
}

export interface CreateRecipeDto {
  title: string;
  description: string;
  image?: string;
  chef?: string;
  cook_time?: string;
  prep_time?: string;
  total_time?: string;
  servings?: number;
  difficulty?: string;
  ingredients?: string[];
  instructions?: string[];
  photos?: string[];
}

export interface UpdateRecipeDto {
  title?: string;
  description?: string;
  image?: string;
  chef?: string;
  cook_time?: string;
  prep_time?: string;
  total_time?: string;
  servings?: number;
  difficulty?: string;
  ingredients?: string[];
  instructions?: string[];
  photos?: string[];
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  name: string;
  amount: string;
  notes: string;
}

// New interface for structured ingredient input
export interface IngredientInput {
  name: string;
  amount: string;
  notes?: string;
}

// New interface for structured instruction input
export interface InstructionInput {
  text: string;
  step_number?: number; // Optional, will be auto-assigned if not provided
}

export interface RecipeInstruction {
  id: string;
  recipe_id: string;
  step_number: number;
  text: string; // Changed from 'description' to 'text' to match DB column
}

export interface RecipePhoto {
  id: string;
  recipe_id: string;
  photo_url: string;
  created_at: Date;
}
