import {
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import {
  RecipeListResponse,
  RecipeParams,
  Recipe as RecipeInterface,
} from '../services/recipeService';
import { useProtectedQuery } from './useAuthenticatedQuery';
import { useAuth } from '../../contexts/AuthContext';
import useApi from './useApi';

// Query keys for caching and invalidation
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (filters: RecipeParams) =>
    [...recipeKeys.lists(), { ...filters }] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  featured: () => [...recipeKeys.all, 'featured'] as const,
  categories: () => [...recipeKeys.all, 'categories'] as const,
  category: (category: string) =>
    [...recipeKeys.categories(), category] as const,
  userFavorites: () => [...recipeKeys.all, 'userFavorites'] as const,
};

// Hook to fetch all recipes (waits for auth status, doesn't require auth)
export const useRecipes = (
  params: RecipeParams = {},
  options?: UseQueryOptions<RecipeListResponse>
) => {
  const recipesApi = useApi<RecipeListResponse>({
    endpoint: '/recipes',
    method: 'GET',
    queryKey: recipeKeys.list(params),
    cache: true,
  });

  return recipesApi.get(params, options);
};

// Hook to fetch a single recipe by ID (waits for auth status, doesn't require auth)
export const useRecipe = (
  id: string,
  options?: UseQueryOptions<RecipeInterface>
) => {
  const recipeApi = useApi<RecipeInterface>({
    endpoint: `/recipes/${id}`,
    method: 'GET',
    queryKey: recipeKeys.detail(id),
    cache: true,
  });

  return recipeApi.get(undefined, options);
};

// Hook to fetch the featured recipe (waits for auth status, doesn't require auth)
export const useFeaturedRecipe = (
  options?: UseQueryOptions<RecipeInterface>
) => {
  const featuredRecipeApi = useApi<RecipeInterface>({
    endpoint: '/recipes/featured',
    method: 'GET',
    queryKey: recipeKeys.featured(),
    cache: true,
  });

  return featuredRecipeApi.get(undefined, options);
};

// Hook to fetch recipes by category (waits for auth status, doesn't require auth)
export const useRecipesByCategory = (
  category: string,
  params: RecipeParams = {},
  options?: UseQueryOptions<RecipeListResponse>
) => {
  const categoryRecipesApi = useApi<RecipeListResponse>({
    endpoint: `/recipes/category/${category}`,
    method: 'GET',
    queryKey: [...recipeKeys.category(category), params],
    cache: true,
  });

  return categoryRecipesApi.get(params, options);
};

// Hook to search recipes (waits for auth status, doesn't require auth)
export const useSearchRecipes = (
  query: string,
  params: RecipeParams = {},
  options?: UseQueryOptions<RecipeListResponse>
) => {
  const searchRecipesApi = useApi<RecipeListResponse>({
    endpoint: '/recipes/search',
    method: 'GET',
    queryKey: [...recipeKeys.lists(), 'search', query, params],
    cache: true,
  });

  return searchRecipesApi.get(
    { ...params, query },
    {
      ...options,
      enabled: query.length > 0 && (options?.enabled !== false),
    }
  );
};

// Hook to fetch user favorite recipes (requires authentication)
export const useFavoriteRecipes = (
  params: RecipeParams = {},
  options?: UseQueryOptions<RecipeListResponse>
) => {
  const favoritesApi = useApi<RecipeListResponse>({
    endpoint: '/recipes/favorites',
    method: 'GET',
    queryKey: [...recipeKeys.userFavorites(), params],
    cache: true,
  });

  return favoritesApi.get(params, options);
};

// Hook to check if a recipe is favorited by the current user
export const useIsFavorite = (
  recipeId: string,
  options?: UseQueryOptions<boolean>
) => {
  const isFavoriteApi = useApi<{ isFavorite: boolean }>({
    endpoint: `/recipes/${recipeId}/favorite`,
    method: 'GET',
    queryKey: [...recipeKeys.userFavorites(), 'check', recipeId],
  });

  return useProtectedQuery(
    [...recipeKeys.userFavorites(), 'check', recipeId],
    () => isFavoriteApi.get()
      .then(response => response.data?.isFavorite || false)
      .catch(() => false),
    options
  );
};

// Hook to add a recipe to favorites
export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const addFavoriteApi = useApi({
    endpoint: '/recipes/{id}/favorite',
    method: 'POST',
  });

  const mutation = addFavoriteApi.post();

  return {
    ...mutation,
    mutate: (recipeId: string) => {
      const endpoint = `/recipes/${recipeId}/favorite`;
      return mutation.mutate({}, {
        onSuccess: () => {
          // If user is authenticated, update the relevant queries
          if (isAuthenticated) {
            // Invalidate the user favorites list
            queryClient.invalidateQueries({ queryKey: recipeKeys.userFavorites() });

            // Update the isFavorite check for this recipe
            queryClient.setQueryData(
              [...recipeKeys.userFavorites(), 'check', recipeId],
              true
            );
          }
        }
      });
    }
  };
};

// Hook to remove a recipe from favorites
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const removeFavoriteApi = useApi({
    endpoint: '/recipes/{id}/favorite',
    method: 'DELETE',
  });

  const mutation = removeFavoriteApi.delete();

  return {
    ...mutation,
    mutate: (recipeId: string) => {
      const endpoint = `/recipes/${recipeId}/favorite`;
      return mutation.mutate({}, {
        onSuccess: () => {
          // If user is authenticated, update the relevant queries
          if (isAuthenticated) {
            // Invalidate the user favorites list
            queryClient.invalidateQueries({ queryKey: recipeKeys.userFavorites() });

            // Update the isFavorite check for this recipe
            queryClient.setQueryData(
              [...recipeKeys.userFavorites(), 'check', recipeId],
              false
            );
          }
        }
      });
    }
  };
};
