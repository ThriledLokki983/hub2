import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiHeart } from 'react-icons/fi';
import { colors, typography, spacing, breakpoints } from '../theme/theme';
import ClassicCard from '../components/Cards/ClassicCard';
import FeaturedRecipe from '../components/FeaturedRecipe';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

// Import React Query hooks
import { useFeaturedRecipe, useRecipes } from '../api/hooks/useRecipes';

// Styled components for layout
const SectionTitle = styled.h2`
  color: ${colors.deepSpace};
  font-size: 1.5rem;
  font-weight: ${typography.fontWeights.light};
  margin: ${spacing.xl} 0 ${spacing.lg};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 1.75rem;
    margin: ${spacing.xxl} 0 ${spacing.xl};
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 2rem;
  }
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};

  @media (min-width: ${breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  @media (min-width: ${breakpoints.tablet}) {
    gap: ${spacing.lg} ${spacing.xs};
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: ${spacing.xs};
  overflow-x: auto;
  margin: ${spacing.xl} 0;
  padding-bottom: ${spacing.sm};

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.cosmicLatte};
    border-radius: ${spacing.md};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${colors.darkPastelRed};
    border-radius: ${spacing.md};
  }

  @media (min-width: ${breakpoints.tablet}) {
    gap: ${spacing.sm};
    margin: ${spacing.xxl} 0 ${spacing.xl};
    justify-content: center;
  }
`;

const CategoryTab = styled.button<{ $active?: boolean }>`
  white-space: nowrap;
  background-color: ${(props) =>
    props.$active ? colors.darkPastelRed : 'transparent'};
  color: ${(props) => (props.$active ? colors.white : colors.deepSpace)};
  border: 1px solid
    ${(props) => (props.$active ? colors.darkPastelRed : colors.cosmicLatte)};
  border-radius: 30px;
  padding: ${spacing.xs} ${spacing.md};
  font-size: 0.8rem;
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) =>
      props.$active ? colors.darkPastelRed : colors.cosmicLatte};
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.sm} ${spacing.lg};
    font-size: 0.9rem;
  }
`;

const ExploreMoreSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
  margin: ${spacing.xl} 0;

  @media (min-width: ${breakpoints.tablet}) {
    margin: ${spacing.xxl} 0;
    gap: ${spacing.xxl};
  }
`;

const SubscriptionContainer = styled.div`
  background-color: ${colors.white};
  padding: ${spacing.lg};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.xl};
  }
`;

const SubscriptionTitle = styled.h3`
  font-size: 1.2rem;
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.light};
  margin-bottom: ${spacing.md};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 1.4rem;
  }
`;

const SubscriptionDesc = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: ${spacing.lg};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
  }
`;

const SubscribeInput = styled.input`
  padding: ${spacing.sm} ${spacing.lg};
  border: 1px solid ${colors.cosmicLatte};
  border-radius: 4px;
  font-size: 0.9rem;
  flex: 1;

  &:focus {
    outline: none;
    border-color: ${colors.darkPastelRed};
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  margin-right: ${spacing.xs};
`;

// HomePage component
const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const {
    data: featuredRecipe,
    isLoading: isFeaturedLoading,
    error: featuredError,
    refetch: refetchFeatured,
  } = useFeaturedRecipe();

  const {
    data: recipesData,
    isLoading: isRecipesLoading,
    error: recipesError,
    refetch: refetchRecipes,
  } = useRecipes();

  const handleViewRecipe = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // In a real implementation, you would fetch recipes by category here
  };

  // Get error message
  const getErrorMessage = (error: any) => {
    return error?.message || 'Something went wrong. Please try again later.';
  };

  return (
    <>
      {/* Featured Recipe Section */}
      {isFeaturedLoading ? (
        <LoadingState message='Loading featured recipe...' />
      ) : featuredError ? (
        <ErrorState
          message={getErrorMessage(featuredError)}
          retry={refetchFeatured}
        />
      ) : (
        featuredRecipe && (
          <FeaturedRecipe
            {...featuredRecipe.data}
            onViewRecipe={() => handleViewRecipe(featuredRecipe.id)}
          />
        )
      )}

      <CategoryTabs>
        {[
          'All',
          'Main Dishes',
          'Soups & Stews',
          'Street Food',
          'Desserts',
          'Beverages',
          'Vegetarian',
        ].map((category) => (
          <CategoryTab
            key={category}
            $active={activeCategory === category}
            onClick={() => handleCategoryChange(category)}>
            {category}
          </CategoryTab>
        ))}
      </CategoryTabs>

      <SectionTitle>Popular Ghanaian Recipes</SectionTitle>

      {/* Recipes Grid Section */}
      {isRecipesLoading ? (
        <LoadingState />
      ) : recipesError ? (
        <ErrorState
          message={getErrorMessage(recipesError)}
          retry={refetchRecipes}
        />
      ) : (
        recipesData?.recipes && (
          <RecipeGrid>
            {recipesData.recipes.map((recipe) => (
              <ClassicCard
                key={recipe.id}
                {...recipe}
                variant='detailed'
                onReserve={() => handleViewRecipe(recipe.id)}
              />
            ))}
          </RecipeGrid>
        )
      )}

      <ExploreMoreSection>
        <Button $primary>
          <IconWrapper>
            <FiHeart />
          </IconWrapper>
          Explore More Recipes
        </Button>

        <SubscriptionContainer>
          <SubscriptionTitle>
            <IconWrapper>
              <FiMail />
            </IconWrapper>
            Get Weekly Recipes
          </SubscriptionTitle>
          <SubscriptionDesc>
            Subscribe to receive delicious Ghanaian recipes directly to your
            inbox every week.
          </SubscriptionDesc>
          <InputGroup>
            <SubscribeInput
              type='email'
              placeholder='Your email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button $primary>Subscribe</Button>
          </InputGroup>
        </SubscriptionContainer>
      </ExploreMoreSection>
    </>
  );
};

export default HomePage;
