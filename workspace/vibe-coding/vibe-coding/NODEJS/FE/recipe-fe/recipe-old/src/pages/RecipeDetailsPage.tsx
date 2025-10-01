import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import RecipeDetails from '../components/RecipeDetails';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useRecipe } from '../api/hooks/useRecipes';

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: recipeData, isLoading, error, refetch } = useRecipe(id || '');
  const recipe = recipeData?.data || {};

  if (isLoading) {
    return (
      <LoadingState
        message='Loading recipe details...'
        fullPage
      />
    );
  }

  if (error) {
    return (
      <>
        <ErrorState
          message="We couldn't load this recipe. Please try again."
          retry={() => refetch()}
        />
        <Button
          $primary
          onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </>
    );
  }

  if (!recipe) {
    return (
      <>
        <h2>Recipe not found</h2>
        <Button
          $primary
          onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </>
    );
  }

  return (
    <RecipeDetails
      {...recipe}
      onBack={() => navigate('/')}
    />
  );
};

export default RecipeDetailsPage;