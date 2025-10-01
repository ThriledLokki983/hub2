import { useState, lazy } from 'react';
import { PATH_PATTERNS } from 'configs/paths';
import { GET_RECIPES } from 'configs/api-endpoints';
import { useQueryApi } from 'hooks/useQueryApi';
import { Button, ButtonSet, LazyComponentWrapper } from 'components';

// Lazy load the example component
const LazyComponentExample = lazy(() => import('./LazyComponentExample'));

import styles from './Home.module.scss';

interface Recipe {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  chef: string;
  category: string;
  tags: string[];
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  difficulty: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  status: string;
  is_public: boolean;
  average_rating: string;
  ratings_count: number;
  views: number;
  source: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  data: Recipe[];
  limit: number;
  page: number;
  total: number;
}

const Home = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showExample, setShowExample] = useState(false);

  const {
    data: recipesResponse,
    isLoading,
    error,
    refetch
  } = useQueryApi<PaginatedResponse>(GET_RECIPES, { page, limit });

  // Extract recipes from the paginated response
  const paginatedData = recipesResponse?.data as PaginatedResponse | undefined;
  const recipes = paginatedData?.data || [];
  const totalPages = paginatedData ? Math.ceil(paginatedData.total / paginatedData.limit) : 0;

  const handlePrevPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <article className={styles.root}>
      <h1>Recipe List</h1>

      {/* Lazy loading example toggle */}
      <div style={{ margin: '1rem 0' }}>
        <Button onClick={() => setShowExample(!showExample)} variation="primary">
          {showExample ? 'Hide' : 'Show'} Lazy Loading Example
        </Button>

        {showExample && (
          <LazyComponentWrapper>
            <LazyComponentExample />
          </LazyComponentWrapper>
        )}
      </div>

      {isLoading && <p>Loading recipes...</p>}

      {error && (
        <div>
          <p>Error loading recipes: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <Button onClick={() => refetch()} variation="secondary">Try again</Button>
        </div>
      )}

      {!isLoading && recipes.length === 0 && <p>No recipes found.</p>}

      <div className={styles.recipeGrid}>
        {recipes.map((recipe: Recipe) => (
          <div key={recipe.id} className={styles.recipeCard}>
            <h2>{recipe.title}</h2>
            {recipe.image && <img src={recipe.image} alt={recipe.title} />}
            <p>{recipe.description}</p>
            <div className={styles.recipeInfo}>
              <span>Prep: {recipe.prep_time} min</span>
              <span>Cook: {recipe.cook_time} min</span>
              <span>Difficulty: {recipe.difficulty}</span>
            </div>
            <div className={styles.recipeStats}>
              <span>{recipe.calories} cal</span>
              <span>Rating: {recipe.average_rating}/5 ({recipe.ratings_count})</span>
            </div>
            <div className={styles.recipeTags}>
              {recipe.tags.map((tag: string, index: number) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            onClick={handlePrevPage}
            variation="secondary"
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            variation="secondary"
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <ButtonSet>
        <Button url={PATH_PATTERNS}>View Patterns</Button>
        <Button onClick={() => refetch()} variation="secondary">Refresh Recipes</Button>
      </ButtonSet>
    </article>
  );
};

export default Home;
