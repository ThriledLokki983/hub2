import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';
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
  Card,
  CardContent,
  CardTitle,
  CardText,
  CardImage,
} from '../components/PageComponents';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

// Styled components
const SearchContainer = styled.div`
  margin-bottom: ${spacing.xl};
  position: relative;
  max-width: 600px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${spacing.md} ${spacing.lg};
  padding-left: ${spacing.xxl};
  border-radius: 30px;
  border: none;
  background-color: ${colors.white};
  font-size: 1rem;
  color: ${colors.deepSpace};
  box-shadow: ${shadows.soft};
  transition: box-shadow 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: ${shadows.medium};
  }

  &::placeholder {
    color: ${colors.galaxyGrey}99;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: ${spacing.lg};
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.galaxyGrey};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterTabs = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: ${spacing.xs};
  overflow-x: auto;
  margin-bottom: ${spacing.xl};
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
    justify-content: center;
  }
`;

const FilterTab = styled.button<{ active?: boolean }>`
  white-space: nowrap;
  background-color: ${(props) =>
    props.active ? colors.darkPastelRed : 'transparent'};
  color: ${(props) => (props.active ? colors.white : colors.deepSpace)};
  border: 1px solid
    ${(props) => (props.active ? colors.darkPastelRed : colors.cosmicLatte)};
  border-radius: 30px;
  padding: ${spacing.xs} ${spacing.md};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) =>
      props.active ? colors.darkPastelRed : colors.cosmicLatte};
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.sm} ${spacing.lg};
    font-size: 1rem;
  }
`;

const IngredientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${spacing.lg};
`;

const IngredientCard = styled(Card)`
  aspect-ratio: auto;
`;

const IngredientImage = styled(CardImage)`
  height: 180px;
`;

const AlphabetNav = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${spacing.xs};
  margin-bottom: ${spacing.xl};
  padding: ${spacing.md};
  background-color: ${colors.cosmicLatte}50;
  border-radius: ${borderRadius.lg};
`;

const AlphabetButton = styled.button<{ active?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${(props) =>
    props.active ? colors.emeraldGreen : colors.white};
  color: ${(props) => (props.active ? colors.white : colors.deepSpace)};
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${shadows.soft};
  font-weight: ${typography.fontWeights.regular};

  &:hover {
    background-color: ${(props) =>
      props.active ? colors.emeraldGreen : colors.cosmicLatte};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin: ${spacing.xl} 0 ${spacing.lg};
`;

const SectionLetter = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.emeraldGreen};
  color: ${colors.white};
  border-radius: ${borderRadius.md};
  font-size: 1.5rem;
  font-weight: ${typography.fontWeights.medium};
  margin-right: ${spacing.md};
`;

const SectionDivider = styled.div`
  flex: 1;
  height: 2px;
  background: linear-gradient(
    to right,
    ${colors.emeraldGreen},
    ${colors.cosmicLatte}
  );
`;

// Array of alphabets
const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Sample ingredients data (in a real app, you'd fetch this from an API)
const ingredientsData = [
  {
    id: 1,
    name: 'Ɔmos (Palm nut)',
    category: 'Fruits & Nuts',
    image: 'https://example.com/image.jpg',
    description:
      'Palm nuts are used to make palm nut soup, a popular Ghanaian dish.',
  },
  {
    id: 2,
    name: 'Akutu (Garden Eggs)',
    category: 'Vegetables',
    image: 'https://example.com/image.jpg',
    description:
      'These small eggplants are often used in stews or enjoyed as a snack with ground pepper.',
  },
  {
    id: 3,
    name: 'Bankye (Cassava)',
    category: 'Starches',
    image: 'https://example.com/image.jpg',
    description:
      'A starchy root vegetable that can be processed into many forms including fufu and gari.',
  },
  {
    id: 4,
    name: 'Chinchinga Spice',
    category: 'Spices & Herbs',
    image: 'https://example.com/image.jpg',
    description:
      "A spice mix used for Ghana's popular street food kebabs, known as chinchinga.",
  },
  {
    id: 5,
    name: 'Dawadawa',
    category: 'Seasonings',
    image: 'https://example.com/image.jpg',
    description:
      'Fermented locust beans used as a seasoning in soups and stews.',
  },
  {
    id: 6,
    name: 'Alasa (African Star Apple)',
    category: 'Fruits & Nuts',
    image: 'https://example.com/image.jpg',
    description: "Sweet-sour fruit that's eaten fresh when in season.",
  },
];

// Group ingredients by first letter
const groupByFirstLetter = (ingredients: typeof ingredientsData) => {
  const grouped: Record<string, typeof ingredientsData> = {};

  ingredients.forEach((ingredient) => {
    const firstLetter = ingredient.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(ingredient);
  });

  return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
};

// Component
const IngredientsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLetter, setActiveLetter] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulating data fetching
  const ingredients = ingredientsData;
  const groupedIngredients = groupByFirstLetter(ingredients);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // In a real app, you'd filter ingredients based on search query
  };

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Ingredients</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Ghanaian Ingredients</PageTitle>
      <PageDescription>
        Explore the unique ingredients used in Ghanaian cuisine, from staple
        foods to exotic spices and herbs.
      </PageDescription>

      <form onSubmit={handleSearch}>
        <SearchContainer>
          <SearchIcon>
            <FiSearch size={20} />
          </SearchIcon>
          <SearchInput
            type='text'
            placeholder='Search for ingredients...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </form>

      <FilterTabs>
        {[
          'All',
          'Starches',
          'Vegetables',
          'Fruits & Nuts',
          'Proteins',
          'Spices & Herbs',
          'Seasonings',
        ].map((category) => (
          <FilterTab
            key={category}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}>
            {category}
          </FilterTab>
        ))}
      </FilterTabs>

      <AlphabetNav>
        {alphabets.map((letter) => (
          <AlphabetButton
            key={letter}
            active={activeLetter === letter}
            onClick={() => setActiveLetter(letter)}>
            {letter}
          </AlphabetButton>
        ))}
      </AlphabetNav>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message="We couldn't load the ingredients. Please try again."
          retry={() => console.log('Retrying...')}
        />
      ) : (
        groupedIngredients.map(([letter, items]) => (
          <div
            key={letter}
            id={letter}>
            <SectionHeader>
              <SectionLetter>{letter}</SectionLetter>
              <SectionDivider />
            </SectionHeader>

            <IngredientGrid>
              {items.map((ingredient) => (
                <IngredientCard key={ingredient.id}>
                  <IngredientImage $backgroundImage={ingredient.image} />
                  <CardContent>
                    <CardTitle>{ingredient.name}</CardTitle>
                    <CardText>{ingredient.description}</CardText>
                    <Button $primary>View Recipes</Button>
                  </CardContent>
                </IngredientCard>
              ))}
            </IngredientGrid>
          </div>
        ))
      )}
    </>
  );
};

export default IngredientsPage;
