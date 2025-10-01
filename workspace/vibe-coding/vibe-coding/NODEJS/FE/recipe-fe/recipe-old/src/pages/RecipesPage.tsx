import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {
  colors,
  typography,
  spacing,
  shadows,
  breakpoints,
  borderRadius,
} from '../theme/theme';
import {
  PageTitle,
  PageDescription,
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbCurrent,
} from '../components/PageComponents';
import ClassicCard from '../components/Cards/ClassicCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import Button from '../components/Button';

// Import React Query hooks
import { useRecipes } from '../api/hooks/useRecipes';

// Styled components
const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.md};
  margin-bottom: ${spacing.lg};
  box-shadow: ${shadows.soft};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.lg};
  }
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
`;

const FiltersTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${colors.deepSpace};
  cursor: pointer;
  padding: ${spacing.xs};
`;

const FilterOptions = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};

  @media (min-width: ${breakpoints.tablet}) {
    display: block;
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${spacing.lg};
`;

const FilterSectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${colors.galaxyGrey};
  cursor: pointer;

  &:hover {
    color: ${colors.deepSpace};
  }
`;

const Checkbox = styled.input`
  margin-right: ${spacing.sm};
  cursor: pointer;
`;

const RecipesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};

  @media (min-width: ${breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  @media (min-width: ${breakpoints.tablet}) {
    gap: ${spacing.xl};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  flex: 1;
  order: 2;

  @media (min-width: ${breakpoints.tablet}) {
    flex: 0 0 300px;
    order: 1;
  }
`;

const MainContent = styled.div`
  flex: 3;
  order: 1;

  @media (min-width: ${breakpoints.tablet}) {
    order: 2;
  }
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.lg};
`;

const SortSelect = styled.select`
  padding: ${spacing.sm} ${spacing.lg};
  border: 1px solid ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  background-color: ${colors.white};
  color: ${colors.deepSpace};
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colors.emeraldGreen};
  }
`;

const RecipesFoundText = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing.sm};
  margin-top: ${spacing.xl};
`;

const PageButton = styled.button<{ active?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid
    ${(props) => (props.active ? colors.emeraldGreen : colors.cosmicLatte)};
  background-color: ${(props) =>
    props.active ? colors.emeraldGreen : colors.white};
  color: ${(props) => (props.active ? colors.white : colors.deepSpace)};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.emeraldGreen};
    color: ${(props) => (props.active ? colors.white : colors.emeraldGreen)};
  }
`;

// RecipesPage component
const RecipesPage = () => {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);

  // Filters state
  const [filters, setFilters] = useState({
    categories: {
      mainDishes: false,
      soups: false,
      streetFood: false,
      desserts: false,
      beverages: false,
      vegetarian: false,
    },
    regions: {
      ashanti: false,
      greater: false,
      northern: false,
      western: false,
      eastern: false,
      volta: false,
    },
    difficulty: {
      easy: false,
      medium: false,
      hard: false,
    },
  });

  const { data: recipesData, isLoading, error, refetch } = useRecipes();

  // Handle filter change
  const handleFilterChange = (
    section: string,
    key: string,
    checked: boolean
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [section]: {
        ...prevFilters[section as keyof typeof prevFilters],
        [key]: checked,
      },
    }));
  };

  // Handle viewing a recipe
  const handleViewRecipe = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`);
  };

  const totalRecipes = recipesData?.recipes ? recipesData.recipes.length : 0;
  const totalPages = Math.ceil(totalRecipes / 12);

  // Generate array with page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Recipes</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Ghanaian Recipes</PageTitle>
      <PageDescription>
        Explore authentic Ghanaian recipes that showcase the rich culinary
        heritage of Ghana's diverse regions.
      </PageDescription>

      <ContentWrapper>
        <Sidebar>
          <FiltersContainer>
            <FiltersHeader>
              <FiltersTitle>
                <FiFilter
                  size={16}
                  style={{ marginRight: spacing.xs }}
                />
                Filters
              </FiltersTitle>
              <ToggleButton onClick={() => setFiltersOpen(!filtersOpen)}>
                {filtersOpen ? <FiChevronUp /> : <FiChevronDown />}
              </ToggleButton>
            </FiltersHeader>

            <FilterOptions isOpen={filtersOpen}>
              <FilterSection>
                <FilterSectionTitle>Category</FilterSectionTitle>
                <CheckboxGroup>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.categories.mainDishes}
                      onChange={(e) =>
                        handleFilterChange(
                          'categories',
                          'mainDishes',
                          e.target.checked
                        )
                      }
                    />
                    Main Dishes
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.categories.soups}
                      onChange={(e) =>
                        handleFilterChange(
                          'categories',
                          'soups',
                          e.target.checked
                        )
                      }
                    />
                    Soups & Stews
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.categories.streetFood}
                      onChange={(e) =>
                        handleFilterChange(
                          'categories',
                          'streetFood',
                          e.target.checked
                        )
                      }
                    />
                    Street Food
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.categories.desserts}
                      onChange={(e) =>
                        handleFilterChange(
                          'categories',
                          'desserts',
                          e.target.checked
                        )
                      }
                    />
                    Desserts
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.categories.beverages}
                      onChange={(e) =>
                        handleFilterChange(
                          'categories',
                          'beverages',
                          e.target.checked
                        )
                      }
                    />
                    Beverages
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.categories.vegetarian}
                      onChange={(e) =>
                        handleFilterChange(
                          'categories',
                          'vegetarian',
                          e.target.checked
                        )
                      }
                    />
                    Vegetarian
                  </CheckboxLabel>
                </CheckboxGroup>
              </FilterSection>

              <FilterSection>
                <FilterSectionTitle>Region</FilterSectionTitle>
                <CheckboxGroup>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.regions.ashanti}
                      onChange={(e) =>
                        handleFilterChange(
                          'regions',
                          'ashanti',
                          e.target.checked
                        )
                      }
                    />
                    Ashanti Region
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.regions.greater}
                      onChange={(e) =>
                        handleFilterChange(
                          'regions',
                          'greater',
                          e.target.checked
                        )
                      }
                    />
                    Greater Accra Region
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.regions.northern}
                      onChange={(e) =>
                        handleFilterChange(
                          'regions',
                          'northern',
                          e.target.checked
                        )
                      }
                    />
                    Northern Region
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.regions.western}
                      onChange={(e) =>
                        handleFilterChange(
                          'regions',
                          'western',
                          e.target.checked
                        )
                      }
                    />
                    Western Region
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.regions.eastern}
                      onChange={(e) =>
                        handleFilterChange(
                          'regions',
                          'eastern',
                          e.target.checked
                        )
                      }
                    />
                    Eastern Region
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.regions.volta}
                      onChange={(e) =>
                        handleFilterChange('regions', 'volta', e.target.checked)
                      }
                    />
                    Volta Region
                  </CheckboxLabel>
                </CheckboxGroup>
              </FilterSection>

              <FilterSection>
                <FilterSectionTitle>Difficulty</FilterSectionTitle>
                <CheckboxGroup>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.difficulty.easy}
                      onChange={(e) =>
                        handleFilterChange(
                          'difficulty',
                          'easy',
                          e.target.checked
                        )
                      }
                    />
                    Easy
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.difficulty.medium}
                      onChange={(e) =>
                        handleFilterChange(
                          'difficulty',
                          'medium',
                          e.target.checked
                        )
                      }
                    />
                    Medium
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type='checkbox'
                      checked={filters.difficulty.hard}
                      onChange={(e) =>
                        handleFilterChange(
                          'difficulty',
                          'hard',
                          e.target.checked
                        )
                      }
                    />
                    Hard
                  </CheckboxLabel>
                </CheckboxGroup>
              </FilterSection>

              <Button $primary>Apply Filters</Button>
            </FilterOptions>
          </FiltersContainer>
        </Sidebar>

        <MainContent>
          <SortContainer>
            <RecipesFoundText>{totalRecipes} recipes found</RecipesFoundText>

            <SortSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}>
              <option value='latest'>Latest</option>
              <option value='popular'>Most Popular</option>
              <option value='az'>A-Z</option>
              <option value='za'>Z-A</option>
            </SortSelect>
          </SortContainer>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              message="We couldn't load the recipes. Please try again."
              retry={() => refetch()}
            />
          ) : (
            recipesData?.recipes && (
              <RecipesGrid>
                {recipesData.recipes.map((recipe) => (
                  <ClassicCard
                    key={recipe.id}
                    {...recipe}
                    variant='detailed'
                    onReserve={() => handleViewRecipe(recipe.id)}
                  />
                ))}
              </RecipesGrid>
            )
          )}

          {totalPages > 1 && (
            <Pagination>
              {currentPage > 1 && (
                <PageButton onClick={() => setCurrentPage(currentPage - 1)}>
                  &lt;
                </PageButton>
              )}

              {pageNumbers.map((number) => (
                <PageButton
                  key={number}
                  active={currentPage === number}
                  onClick={() => setCurrentPage(number)}>
                  {number}
                </PageButton>
              ))}

              {currentPage < totalPages && (
                <PageButton onClick={() => setCurrentPage(currentPage + 1)}>
                  &gt;
                </PageButton>
              )}
            </Pagination>
          )}
        </MainContent>
      </ContentWrapper>
    </>
  );
};

export default RecipesPage;
