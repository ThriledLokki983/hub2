import apiClient, { getTokenFromCookies } from '../config';

export interface Ingredient {
  name: string;
  amount: string;
  notes?: string;
}

export interface Instruction {
  step_number: number;
  text: string;
}

export interface NutritionalInfo {
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
}

export interface RelatedRecipe {
  id: number;
  title: string;
  image: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  chef: string;
  cookTime: string;
  prepTime: string;
  totalTime: string;
  servings: number;
  difficulty: string;
  region: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  nutritionalInfo?: NutritionalInfo;
  tips?: string[];
  relatedRecipes?: RelatedRecipe[];
}

export interface RecipeInterface {
  data: {
    id: number;
    title: string;
    description: string;
    image: string;
    chef: string;
    cookTime: string;
    prepTime: string;
    totalTime: string;
    servings: number;
    difficulty: string;
    region: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
    nutritionalInfo?: NutritionalInfo;
    tips?: string[];
    relatedRecipes?: RelatedRecipe[];
  };
  message: string;
}

export interface RecipeListResponse {
  recipes: Recipe[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RecipeParams {
  page?: number;
  pageSize?: number;
  category?: string;
  region?: string;
  search?: string;
}

const recipeService = {
  /**
   * Get all recipes with optional filtering
   */
  getRecipes: async (
    params: RecipeParams = {}
  ): Promise<RecipeListResponse> => {
    const token = getTokenFromCookies();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const { data } = await apiClient.get('/recipes', {
      params,
      headers,
      withCredentials: true
    });
    return data;
  },

  /**
   * Get featured recipes
   */
  getFeaturedRecipe: async (): Promise<Recipe> => {
    const token = getTokenFromCookies();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const { data } = await apiClient.get('/recipes/featured', {
      headers,
      withCredentials: true
    });
    return data;
  },

  /**
   * Get a specific recipe by id
   */
  getRecipeById: async (id: string): Promise<RecipeInterface> => {
    const token = getTokenFromCookies();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const { data } = await apiClient.get(`/recipes/${id}`, {
      headers,
      withCredentials: true
    });
    return data;
  },

  /**
   * Get recipes by category
   */
  getRecipesByCategory: async (
    category: string,
    params: RecipeParams = {}
  ): Promise<RecipeListResponse> => {
    const token = getTokenFromCookies();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const { data } = await apiClient.get(`/recipes/category/${category}`, {
      params,
      headers,
      withCredentials: true
    });
    return data;
  },

  /**
   * Search recipes
   */
  searchRecipes: async (
    query: string,
    params: RecipeParams = {}
  ): Promise<RecipeListResponse> => {
    const token = getTokenFromCookies();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const { data } = await apiClient.get('/recipes/search', {
      params: {
        ...params,
        query,
      },
      headers,
      withCredentials: true
    });
    return data;
  },

  /**
   * Get user's favorite recipes
   * This endpoint requires authentication
   */
  getUserFavorites: async (
    params: RecipeParams = {}
  ): Promise<RecipeListResponse> => {
    const { data } = await apiClient.get('/recipes/favorites', {
      params,
      withCredentials: true,
    });
    return data;
  },

  /**
   * Check if a recipe is favorited by the current user
   * This endpoint requires authentication
   */
  checkIsFavorite: async (recipeId: string): Promise<boolean> => {
    try {
      const { data } = await apiClient.get(`/recipes/${recipeId}/favorite`, {
        withCredentials: true,
      });
      return data.isFavorite;
    } catch (error) {
      // If the endpoint returns a 404, the recipe is not favorited
      return false;
    }
  },

  /**
   * Add a recipe to user's favorites
   * This endpoint requires authentication
   */
  addFavorite: async (recipeId: string): Promise<void> => {
    await apiClient.post(`/recipes/${recipeId}/favorite`, {}, {
      withCredentials: true
    });
  },

  /**
   * Remove a recipe from user's favorites
   * This endpoint requires authentication
   */
  removeFavorite: async (recipeId: string): Promise<void> => {
    await apiClient.delete(`/recipes/${recipeId}/favorite`, {
      withCredentials: true
    });
  }
};

export default recipeService;
