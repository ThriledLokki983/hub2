import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
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
} from '../../components/PageComponents';
import Button from '../../components/Button';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';

// Styled components
const OccasionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.lg};
  margin-top: ${spacing.xl};
  margin-bottom: ${spacing.xxl};

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const OccasionCard = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.medium};
  }
`;

const OccasionImage = styled.div<{ backgroundImage: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
`;

const OccasionContent = styled.div`
  padding: ${spacing.lg};
`;

const OccasionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
`;

const OccasionDescription = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: ${spacing.lg};
`;

const CategorySelector = styled.div`
  display: flex;
  overflow-x: auto;
  gap: ${spacing.md};
  padding-bottom: ${spacing.md};
  margin-bottom: ${spacing.xl};

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryButton = styled.button<{ $active?: boolean }>`
  background-color: ${(props) =>
    props.$active ? colors.emeraldGreen : colors.white};
  color: ${(props) => (props.$active ? colors.white : colors.deepSpace)};
  border: 1px solid
    ${(props) => (props.$active ? colors.emeraldGreen : colors.cosmicLatte)};
  border-radius: ${borderRadius.full};
  padding: ${spacing.sm} ${spacing.lg};
  font-size: 0.95rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${spacing.xs};

  &:hover {
    background-color: ${(props) =>
      props.$active ? colors.emeraldGreen : colors.cosmicLatte};
    transform: translateY(-2px);
  }

  svg {
    font-size: 1rem;
  }
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.lg};
  margin-top: ${spacing.xl};

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const RecipeCard = styled.div`
  display: flex;
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  overflow: hidden;
  height: 180px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.medium};
  }

  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    height: auto;
  }
`;

const RecipeImage = styled.div<{ backgroundImage: string }>`
  width: 180px;
  flex-shrink: 0;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;

  @media (max-width: ${breakpoints.sm}) {
    width: 100%;
    height: 180px;
  }
`;

const RecipeContent = styled.div`
  flex: 1;
  padding: ${spacing.md};
  display: flex;
  flex-direction: column;
`;

const RecipeTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
`;

const RecipeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
  font-size: 0.85rem;
  color: ${colors.galaxyGrey};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const RecipeDescription = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: ${spacing.md};
  flex-grow: 1;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.xs};
  margin-bottom: ${spacing.md};
`;

const Tag = styled.span`
  background-color: ${colors.cosmicLatte};
  color: ${colors.emeraldGreen};
  font-size: 0.8rem;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.full};
`;

const FeaturedOccasion = styled.div`
  margin: ${spacing.xxl} 0;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};

  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.md};
  }
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
  right: 0;
  min-width: 180px;
  background-color: ${colors.white};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.medium};
  padding: ${spacing.md};
  margin-top: ${spacing.xs};
  z-index: 10;
`;

const FilterOption = styled.div`
  padding: ${spacing.xs} 0;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.emeraldGreen};
  }
`;

const ViewMoreLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  color: ${colors.emeraldGreen};
  margin-top: ${spacing.xl};
  text-align: center;
  text-decoration: none;
  font-size: 1rem;

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

// Mock data
const occasions = [
  { id: 'all', label: 'All Occasions', icon: <FiCalendar /> },
  { id: 'festivals', label: 'Festivals', icon: <FiCalendar /> },
  { id: 'weddings', label: 'Weddings', icon: <FiCalendar /> },
  { id: 'family', label: 'Family Gatherings', icon: <FiUsers /> },
  { id: 'funerals', label: 'Funeral Ceremonies', icon: <FiCalendar /> },
  { id: 'religious', label: 'Religious Celebrations', icon: <FiCalendar /> },
  { id: 'naming', label: 'Naming Ceremonies', icon: <FiUsers /> },
  { id: 'independence', label: 'Independence Day', icon: <FiCalendar /> },
];

const occasionCards = [
  {
    id: 1,
    title: 'Traditional Festivals',
    description:
      'Explore recipes for celebrations like Homowo, Adae Kese, Damba, and other vibrant Ghanaian festivals.',
    image:
      'https://images.unsplash.com/photo-1504941214544-9c1c44559ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
    category: 'festivals',
  },
  {
    id: 2,
    title: 'Wedding Ceremonies',
    description:
      'Traditional and contemporary recipes for Ghanaian wedding celebrations and engagement ceremonies.',
    image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80',
    category: 'weddings',
  },
  {
    id: 3,
    title: 'Family Gatherings',
    description:
      'Hearty meals that bring families together for Sunday lunches, reunions, and special moments.',
    image:
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80',
    category: 'family',
  },
  {
    id: 4,
    title: 'Funeral Ceremonies',
    description:
      'Respectful dishes prepared for funeral gatherings that honor tradition and community support.',
    image:
      'https://images.unsplash.com/photo-1516401266446-6432a8a07d41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
    category: 'funerals',
  },
  {
    id: 5,
    title: 'Religious Celebrations',
    description:
      'Special dishes for Christian, Muslim, and traditional religious observances throughout the year.',
    image:
      'https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80',
    category: 'religious',
  },
  {
    id: 6,
    title: 'Naming Ceremonies',
    description:
      'Traditional foods prepared to welcome new babies and celebrate their formal naming.',
    image:
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
    category: 'naming',
  },
];

const featuredRecipes = [
  {
    id: 101,
    title: 'Festival Jollof with Grilled Guinea Fowl',
    description:
      'A spectacular one-pot rice dish cooked with tomatoes, peppers, and aromatic spices, paired with perfectly grilled guinea fowl.',
    image:
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
    prepTime: 30,
    cookTime: 60,
    servings: 8,
    tags: ['Festival', 'Signature', 'Spicy'],
  },
  {
    id: 102,
    title: 'Traditional Kontomire Stew',
    description:
      'Hearty cocoyam leaves stew with smoked fish and meats, often served at important family gatherings and celebrations.',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
    prepTime: 45,
    cookTime: 90,
    servings: 10,
    tags: ['Traditional', 'Family', 'Nutritious'],
  },
  {
    id: 103,
    title: 'Celebration TuoZaafi',
    description:
      'A northern speciality of smooth millet or corn flour dumplings served with savory soup, prepared for special celebrations.',
    image:
      'https://images.unsplash.com/photo-1567982047351-76b6f93e9932?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
    prepTime: 30,
    cookTime: 45,
    servings: 6,
    tags: ['Northern', 'Festive', 'Filling'],
  },
  {
    id: 104,
    title: 'Wedding Waakye Feast',
    description:
      'A festive version of the popular rice and beans dish, enhanced with special spices and served with multiple sides.',
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2372&q=80',
    prepTime: 40,
    cookTime: 120,
    servings: 50,
    tags: ['Wedding', 'Festive', 'Large-batch'],
  },
];

// Component
const SpecialOccasionsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(false);

  // Filter occasion cards by selected category
  const filteredOccasions =
    selectedCategory === 'all'
      ? occasionCards
      : occasionCards.filter(
          (occasion) => occasion.category === selectedCategory
        );

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/explore'>Explore</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Special Occasions</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Special Occasions</PageTitle>
      <PageDescription>
        Discover recipes for Ghana's most significant celebrations and
        ceremonies. From weddings and festivals to family gatherings, these
        dishes carry cultural importance and bring people together.
      </PageDescription>

      <Banner>
        <BannerContent>
          <BannerTitle>Celebrating Through Food</BannerTitle>
          <BannerDescription>
            In Ghanaian culture, special occasions are marked by unique dishes
            that hold symbolic meaning and reflect our values of community,
            respect, and tradition. These recipes have been perfected over
            generations.
          </BannerDescription>
        </BannerContent>
        <BannerImage backgroundImage='https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80' />
      </Banner>

      <CategorySelector>
        {occasions.map((occasion) => (
          <CategoryButton
            key={occasion.id}
            $active={selectedCategory === occasion.id}
            onClick={() => setSelectedCategory(occasion.id)}>
            {occasion.icon} {occasion.label}
          </CategoryButton>
        ))}
      </CategorySelector>

      <SectionTitle>Celebrate With These Traditions</SectionTitle>

      {loading ? (
        <LoadingState message='Loading occasion recipes...' />
      ) : filteredOccasions.length === 0 ? (
        <ErrorState
          message='No occasions found in this category.'
          retry={() => setSelectedCategory('all')}
        />
      ) : (
        <OccasionGrid>
          {filteredOccasions.map((occasion) => (
            <OccasionCard key={occasion.id}>
              <OccasionImage backgroundImage={occasion.image} />
              <OccasionContent>
                <OccasionTitle>{occasion.title}</OccasionTitle>
                <OccasionDescription>
                  {occasion.description}
                </OccasionDescription>
                <Button
                  onClick={() =>
                    console.log(`Viewing ${occasion.title} recipes`)
                  }>
                  Explore Recipes
                </Button>
              </OccasionContent>
            </OccasionCard>
          ))}
        </OccasionGrid>
      )}

      <FeaturedOccasion>
        <FilterContainer>
          <SectionTitle>Featured Celebration Recipes</SectionTitle>

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
                  setSortBy('newest');
                  setIsFilterOpen(false);
                }}>
                Newest First
              </FilterOption>
              <FilterOption
                onClick={() => {
                  setSortBy('servings');
                  setIsFilterOpen(false);
                }}>
                Serving Size
              </FilterOption>
            </FilterDropdown>
          </FilterWrapper>
        </FilterContainer>

        <RecipeGrid>
          {featuredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id}>
              <RecipeImage backgroundImage={recipe.image} />
              <RecipeContent>
                <RecipeTitle>{recipe.title}</RecipeTitle>
                <RecipeInfo>
                  <InfoItem>
                    <FiClock size={14} /> {recipe.prepTime + recipe.cookTime}{' '}
                    min
                  </InfoItem>
                  <InfoItem>
                    <FiUsers size={14} /> Serves {recipe.servings}
                  </InfoItem>
                </RecipeInfo>
                <TagsWrapper>
                  {recipe.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagsWrapper>
                <RecipeDescription>{recipe.description}</RecipeDescription>
                <Link to={`/recipe/${recipe.id}`}>
                  <Button $primary>View Recipe</Button>
                </Link>
              </RecipeContent>
            </RecipeCard>
          ))}
        </RecipeGrid>
      </FeaturedOccasion>

      <ViewMoreLink to='/recipes'>
        Explore all recipes <FiArrowRight />
      </ViewMoreLink>
    </>
  );
};

export default SpecialOccasionsPage;
