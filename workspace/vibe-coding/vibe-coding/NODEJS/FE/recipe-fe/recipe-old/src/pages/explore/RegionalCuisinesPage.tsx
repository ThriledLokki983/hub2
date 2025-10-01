import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiMapPin,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
} from 'react-icons/fi';
import {
  colors,
  typography,
  spacing,
  shadows,
  breakpoints,
  borderRadius,
} from '../../theme/theme';
import {
  PageTitle,
  PageDescription,
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbCurrent,
  SectionTitle,
  Paragraph,
  Banner,
  BannerContent,
  BannerTitle,
  BannerDescription,
  BannerImage,
  Card,
  CardContent,
  CardTitle,
  CardText,
  CardGrid,
} from '../../components/PageComponents';
import ClassicCard from '../../components/Cards/ClassicCard';
import Button from '../../components/Button';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';

// Styled components
const RegionSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.xl};
`;

const RegionButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${(props) =>
    props.$active ? colors.darkPastelRed : colors.white};
  color: ${(props) => (props.$active ? colors.white : colors.deepSpace)};
  border: 1px solid
    ${(props) => (props.$active ? colors.darkPastelRed : colors.cosmicLatte)};
  border-radius: ${borderRadius.md};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.$active ? colors.darkPastelRed : colors.cosmicLatte};
    transform: translateY(-2px);
  }

  svg {
    margin-right: ${spacing.xs};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.lg};
  flex-wrap: wrap;
  gap: ${spacing.md};
`;

const FilterWrapper = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  background-color: transparent;
  border: 1px solid ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  color: ${colors.deepSpace};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.cosmicLatte};
  }
`;

const FilterDropdown = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background-color: ${colors.white};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.medium};
  padding: ${spacing.md};
  margin-top: ${spacing.sm};
  z-index: 10;
`;

const FilterOption = styled.div`
  padding: ${spacing.xs} 0;
  cursor: pointer;

  &:hover {
    color: ${colors.emeraldGreen};
  }
`;

const RegionalDishCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.sm};
`;

const RegionTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 0.8rem;
  color: ${colors.emeraldGreen};
  margin-top: ${spacing.xs};
`;

const RecipeImage = styled.div<{ backgroundImage: string }>`
  height: 180px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.md};
`;

const RecipeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  font-size: 0.85rem;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.md};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const ViewMore = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  color: ${colors.emeraldGreen};
  font-size: 0.9rem;
  text-decoration: none;
  margin-top: ${spacing.xl};

  &:hover {
    text-decoration: underline;

    svg {
      transform: translateX(3px);
    }
  }

  svg {
    transition: transform 0.2s ease;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.lg};
`;

const FeaturedBanner = styled(Banner)`
  margin-top: ${spacing.xxl};
`;

// Sample data
const regions = [
  { id: 'all', name: 'All Regions' },
  { id: 'ashanti', name: 'Ashanti Region' },
  { id: 'greater-accra', name: 'Greater Accra' },
  { id: 'northern', name: 'Northern Region' },
  { id: 'western', name: 'Western Region' },
  { id: 'volta', name: 'Volta Region' },
  { id: 'eastern', name: 'Eastern Region' },
];

const regionalRecipes = [
  {
    id: 1,
    name: 'Fufu with Light Soup',
    region: 'Ashanti Region',
    image: 'https://example.com/fufu.jpg',
    prepTime: '30 min',
    cookTime: '1 hr',
    difficulty: 'Medium',
    description:
      'A staple dish from the Ashanti region featuring pounded cassava and plantain dumplings served with light soup.',
  },
  {
    id: 2,
    name: 'Ga Kenkey with Fish',
    region: 'Greater Accra',
    image: 'https://example.com/kenkey.jpg',
    prepTime: '1 hr',
    cookTime: '3 hrs',
    difficulty: 'Medium',
    description:
      'Fermented corn dough dumplings served with fried fish and pepper sauce, a signature dish of the Ga people.',
  },
  {
    id: 3,
    name: 'Tuo Zaafi',
    region: 'Northern Region',
    image: 'https://example.com/tuo-zaafi.jpg',
    prepTime: '20 min',
    cookTime: '40 min',
    difficulty: 'Medium',
    description:
      'A thick, smooth porridge made from millet or corn flour, typically served with ayoyo soup.',
  },
  {
    id: 4,
    name: 'Fante Fante',
    region: 'Western Region',
    image: 'https://example.com/fante.jpg',
    prepTime: '15 min',
    cookTime: '30 min',
    difficulty: 'Easy',
    description:
      'A fish and vegetable stew prepared with palm oil, popular in the coastal areas of the Western Region.',
  },
  {
    id: 5,
    name: 'Akple with Okro Soup',
    region: 'Volta Region',
    image: 'https://example.com/akple.jpg',
    prepTime: '20 min',
    cookTime: '45 min',
    difficulty: 'Medium',
    description:
      'A cornmeal-based staple food from the Volta Region, typically served with okra soup.',
  },
  {
    id: 6,
    name: 'Akyeke with Palm Nut Soup',
    region: 'Western Region',
    image: 'https://example.com/akyeke.jpg',
    prepTime: '25 min',
    cookTime: '50 min',
    difficulty: 'Medium',
    description:
      'Granulated cassava couscous served with palm nut soup, a traditional dish of the Nzema people.',
  },
];

// Component
const RegionalCuisinesPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Filter recipes by selected region
  const filteredRecipes =
    selectedRegion === 'all'
      ? regionalRecipes
      : regionalRecipes.filter((recipe) =>
          recipe.region.toLowerCase().includes(selectedRegion)
        );

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Regional Cuisines</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Regional Cuisines</PageTitle>
      <PageDescription>
        Explore the diverse culinary traditions from different regions of Ghana,
        each with its unique flavors, ingredients, and cooking techniques.
      </PageDescription>

      <Banner>
        <BannerContent>
          <BannerTitle>The Regional Flavors of Ghana</BannerTitle>
          <BannerDescription>
            Ghana's cuisine is as diverse as its culture. From the spicy dishes
            of the north to the seafood specialties of the coastal regions, each
            area has developed its own culinary identity shaped by local
            agriculture, historical influences, and cultural practices.
          </BannerDescription>
        </BannerContent>
        <BannerImage backgroundImage='https://example.com/ghana-cuisine-map.jpg' />
      </Banner>

      <RegionSelector>
        {regions.map((region) => (
          <RegionButton
            key={region.id}
            $active={selectedRegion === region.id}
            onClick={() => setSelectedRegion(region.id)}>
            <FiMapPin size={14} />
            {region.name}
          </RegionButton>
        ))}
      </RegionSelector>

      <FilterContainer>
        <SectionTitle>Traditional Dishes</SectionTitle>

        <FilterWrapper>
          <FilterButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <FiFilter size={14} />
            Sort By
            {isFilterOpen ? (
              <FiChevronUp size={14} />
            ) : (
              <FiChevronDown size={14} />
            )}
          </FilterButton>

          <FilterDropdown $isOpen={isFilterOpen}>
            <FilterOption
              onClick={() => {
                setSortBy('popularity');
                setIsFilterOpen(false);
              }}>
              Most Popular
            </FilterOption>
            <FilterOption
              onClick={() => {
                setSortBy('az');
                setIsFilterOpen(false);
              }}>
              A-Z
            </FilterOption>
            <FilterOption
              onClick={() => {
                setSortBy('difficulty');
                setIsFilterOpen(false);
              }}>
              Difficulty (Easy to Hard)
            </FilterOption>
            <FilterOption
              onClick={() => {
                setSortBy('time');
                setIsFilterOpen(false);
              }}>
              Preparation Time
            </FilterOption>
          </FilterDropdown>
        </FilterWrapper>
      </FilterContainer>

      {loading ? (
        <LoadingState />
      ) : filteredRecipes.length === 0 ? (
        <ErrorState
          message='No recipes found for this region. Please try another region.'
          retry={() => setSelectedRegion('all')}
        />
      ) : (
        <CardGrid>
          {filteredRecipes.map((recipe) => (
            <RegionalDishCard key={recipe.id}>
              <RecipeImage backgroundImage={recipe.image} />
              <CardContent>
                <CardHeader>
                  <CardTitle>{recipe.name}</CardTitle>
                  <RegionTag>
                    <FiMapPin size={12} />
                    {recipe.region}
                  </RegionTag>
                </CardHeader>
                <CardText>{recipe.description}</CardText>
                <RecipeInfo>
                  <InfoItem>Prep: {recipe.prepTime}</InfoItem>
                  <InfoItem>Cook: {recipe.cookTime}</InfoItem>
                  <InfoItem>Difficulty: {recipe.difficulty}</InfoItem>
                </RecipeInfo>
                <Button
                  $primary
                  onClick={() => navigate(`/recipe/${recipe.id}`)}>
                  View Recipe
                </Button>
              </CardContent>
            </RegionalDishCard>
          ))}
        </CardGrid>
      )}

      <ViewMore to='/recipes'>
        Explore all recipes
        <FiArrowRight size={14} />
      </ViewMore>

      <FeaturedBanner>
        <BannerContent>
          <BannerTitle>Featured Region: Ashanti</BannerTitle>
          <BannerDescription>
            The Ashanti Region is known for its rich culinary heritage,
            featuring dishes like fufu with light soup, palm nut soup, and
            garden egg stew. The region's cuisine emphasizes fresh ingredients
            and complex flavors that highlight Ghana's diverse agricultural
            bounty.
          </BannerDescription>
          <Button $primary>Explore Ashanti Cuisine</Button>
        </BannerContent>
        <BannerImage backgroundImage='https://example.com/ashanti-cuisine.jpg' />
      </FeaturedBanner>
    </>
  );
};

export default RegionalCuisinesPage;
