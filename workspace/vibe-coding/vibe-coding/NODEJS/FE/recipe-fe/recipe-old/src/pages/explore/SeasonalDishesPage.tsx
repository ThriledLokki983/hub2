import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiStar, FiArrowRight } from 'react-icons/fi';
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
  PageSection,
} from '../../components/PageComponents';

// Styled components
const SeasonContainer = styled.div`
  margin-bottom: ${spacing.xxl};
`;

const SeasonSelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${spacing.xl};

  @media (max-width: ${breakpoints.md}) {
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: ${spacing.sm};
    margin-bottom: ${spacing.lg};
  }
`;

const SeasonButton = styled.button<{ active: boolean }>`
  background-color: ${(props) =>
    props.active ? colors.emeraldGreen : colors.white};
  color: ${(props) => (props.active ? colors.white : colors.emeraldGreen)};
  border: 1px solid ${colors.emeraldGreen};
  border-radius: ${borderRadius.full};
  padding: ${spacing.md} ${spacing.lg};
  margin: 0 ${spacing.sm};
  font-size: 1rem;
  font-weight: ${typography.fontWeights.light};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover {
    background-color: ${(props) =>
      props.active ? colors.emeraldGreen : colors.cosmicLatte};
    transform: translateY(-2px);
  }

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: ${spacing.sm};
  }

  @media (max-width: ${breakpoints.md}) {
    min-width: 100px;
    font-size: 0.9rem;
    white-space: nowrap;
  }
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.lg};

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const RecipeCard = styled.div`
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

const RecipeImage = styled.div<{ src: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const RecipeContent = styled.div`
  padding: ${spacing.lg};
`;

const RecipeTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
`;

const RecipeMeta = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
  margin-bottom: ${spacing.md};

  & > div {
    display: flex;
    align-items: center;
    margin-right: ${spacing.md};

    svg {
      margin-right: ${spacing.xs};
    }
  }
`;

const RecipeDescription = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: ${spacing.lg};
`;

const ViewRecipeLink = styled(Link)`
  display: flex;
  align-items: center;
  color: ${colors.emeraldGreen};
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: ${typography.fontWeights.light};

  svg {
    transition: transform 0.2s ease;
    margin-left: ${spacing.xs};
  }

  &:hover {
    svg {
      transform: translateX(3px);
    }
  }
`;

const SeasonIntroCard = styled.div`
  background-color: ${colors.cosmicLatte}30;
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
  margin-bottom: ${spacing.xl};
  display: flex;
  gap: ${spacing.xl};
  align-items: center;

  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
    padding: ${spacing.lg};
  }
`;

const SeasonImage = styled.div<{ src: string }>`
  width: 250px;
  height: 250px;
  border-radius: ${borderRadius.full};
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  box-shadow: ${shadows.soft};

  @media (max-width: ${breakpoints.md}) {
    width: 200px;
    height: 200px;
  }
`;

const SeasonInfo = styled.div`
  flex: 1;
`;

const SeasonTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

// Mock data for seasonal recipes
interface Recipe {
  id: string;
  title: string;
  image: string;
  description: string;
  prepTime: number;
  rating: number;
}

interface SeasonData {
  title: string;
  description: string;
  image: string;
  recipes: Recipe[];
}

const seasonalData: Record<string, SeasonData> = {
  spring: {
    title: 'Spring Cuisine',
    description:
      "Spring brings fresh greens, tender vegetables, and light dishes that celebrate renewal. These recipes feature asparagus, peas, spring onions, and herbs that capture the essence of the season's vibrant flavors.",
    image:
      'https://images.unsplash.com/photo-1569420067112-9a321006d3ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80',
    recipes: [
      {
        id: '1',
        title: 'Spring Pea Risotto',
        image:
          'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Creamy risotto with fresh spring peas and mint.',
        prepTime: 45,
        rating: 4.8,
      },
      {
        id: '2',
        title: 'Asparagus Tart',
        image:
          'https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2572&q=80',
        description: 'Elegant tart with fresh asparagus and goat cheese.',
        prepTime: 60,
        rating: 4.7,
      },
      {
        id: '3',
        title: 'Spring Vegetable Soup',
        image:
          'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Light and refreshing soup with spring vegetables.',
        prepTime: 30,
        rating: 4.5,
      },
      {
        id: '4',
        title: 'Herb Roasted Lamb',
        image:
          'https://images.unsplash.com/photo-1614983646436-b3d7a8398b3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2371&q=80',
        description: 'Tender lamb roast with fresh spring herbs.',
        prepTime: 90,
        rating: 4.9,
      },
      {
        id: '5',
        title: 'Rhubarb Crumble',
        image:
          'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Classic rhubarb dessert with a crunchy crumble topping.',
        prepTime: 50,
        rating: 4.6,
      },
      {
        id: '6',
        title: 'Spring Greens Salad',
        image:
          'https://images.unsplash.com/photo-1564675231164-1dd8d5a8288e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
        description: 'Fresh salad with foraged spring greens and flowers.',
        prepTime: 15,
        rating: 4.4,
      },
    ],
  },
  summer: {
    title: 'Summer Delights',
    description:
      'Summer cuisine celebrates the peak of harvest season with colorful, sun-ripened produce. These recipes feature juicy tomatoes, sweet corn, vibrant berries, and refreshing flavors perfect for warm days.',
    image:
      'https://images.unsplash.com/photo-1532523159447-95d71825c668?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80',
    recipes: [
      {
        id: '7',
        title: 'Heirloom Tomato Salad',
        image:
          'https://images.unsplash.com/photo-1629894470562-2c1cfa7a0e5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Colorful salad with heirloom tomatoes and fresh basil.',
        prepTime: 15,
        rating: 4.7,
      },
      {
        id: '8',
        title: 'Grilled Corn on the Cob',
        image:
          'https://images.unsplash.com/photo-1470119693884-47d3a1d1f180?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2094&q=80',
        description: 'Sweet corn with herb butter and chili lime seasoning.',
        prepTime: 20,
        rating: 4.8,
      },
      {
        id: '9',
        title: 'Summer Berry Pavlova',
        image:
          'https://images.unsplash.com/photo-1463780374078-15526392c763?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Light meringue dessert topped with fresh summer berries.',
        prepTime: 75,
        rating: 4.9,
      },
      {
        id: '10',
        title: 'Gazpacho',
        image:
          'https://images.unsplash.com/photo-1581237730219-699b77cebfdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Refreshing cold soup with ripe tomatoes and vegetables.',
        prepTime: 25,
        rating: 4.6,
      },
      {
        id: '11',
        title: 'BBQ Grilled Fish',
        image:
          'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2371&q=80',
        description: 'Fresh fish grilled to perfection with lemon and herbs.',
        prepTime: 30,
        rating: 4.8,
      },
      {
        id: '12',
        title: 'Summer Vegetable Ratatouille',
        image:
          'https://images.unsplash.com/photo-1598511796432-32312c4c8e2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2515&q=80',
        description: 'Classic French dish with summer vegetables.',
        prepTime: 60,
        rating: 4.7,
      },
    ],
  },
  autumn: {
    title: 'Autumn Harvest',
    description:
      'Autumn cuisine embraces comfort and warmth with harvest ingredients. These recipes feature root vegetables, squash, apples, mushrooms, and warming spices that welcome the cooler months.',
    image:
      'https://images.unsplash.com/photo-1508995476428-43d70c3d0042?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
    recipes: [
      {
        id: '13',
        title: 'Butternut Squash Soup',
        image:
          'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
        description:
          'Creamy soup with roasted butternut squash and warming spices.',
        prepTime: 45,
        rating: 4.8,
      },
      {
        id: '14',
        title: 'Apple Cider Donuts',
        image:
          'https://images.unsplash.com/photo-1636484229126-c433ed21b977?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Homemade donuts with apple cider and cinnamon sugar.',
        prepTime: 60,
        rating: 4.9,
      },
      {
        id: '15',
        title: 'Mushroom Risotto',
        image:
          'https://images.unsplash.com/photo-1610970881699-44a5587cabec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Rich risotto with wild mushrooms and herbs.',
        prepTime: 50,
        rating: 4.7,
      },
      {
        id: '16',
        title: 'Pumpkin Pie',
        image:
          'https://images.unsplash.com/photo-1509461399763-ae67a981b254?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Classic autumn dessert with spiced pumpkin filling.',
        prepTime: 75,
        rating: 4.8,
      },
      {
        id: '17',
        title: 'Roasted Root Vegetables',
        image:
          'https://images.unsplash.com/photo-1510863407349-73f47ce337a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1984&q=80',
        description: 'Colorful medley of seasonal root vegetables.',
        prepTime: 40,
        rating: 4.5,
      },
      {
        id: '18',
        title: 'Fig and Goat Cheese Salad',
        image:
          'https://images.unsplash.com/photo-1604021302176-d4de0e4567bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2371&q=80',
        description: 'Fresh salad with ripe figs and creamy goat cheese.',
        prepTime: 15,
        rating: 4.6,
      },
    ],
  },
  winter: {
    title: 'Winter Comfort',
    description:
      'Winter cuisine focuses on hearty, warming dishes that provide comfort during cold months. These recipes feature slow-cooked stews, festive treats, citrus fruits, and rich, satisfying flavors.',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2371&q=80',
    recipes: [
      {
        id: '19',
        title: 'Beef Bourguignon',
        image:
          'https://images.unsplash.com/photo-1608500218890-c4f9604dde20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Classic French beef stew with red wine and vegetables.',
        prepTime: 180,
        rating: 4.9,
      },
      {
        id: '20',
        title: 'Gingerbread Cookies',
        image:
          'https://images.unsplash.com/photo-1607110722875-61feb52e64f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Festive spiced cookies perfect for decorating.',
        prepTime: 60,
        rating: 4.8,
      },
      {
        id: '21',
        title: 'Blood Orange Salad',
        image:
          'https://images.unsplash.com/photo-1547414876-0c5089110c50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2135&q=80',
        description: 'Bright winter salad with blood oranges and fennel.',
        prepTime: 20,
        rating: 4.6,
      },
      {
        id: '22',
        title: 'Potato Leek Soup',
        image:
          'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
        description: 'Creamy soup with potatoes and leeks.',
        prepTime: 45,
        rating: 4.5,
      },
      {
        id: '23',
        title: 'Roast Duck with Orange Sauce',
        image:
          'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Festive duck with a tangy orange sauce.',
        prepTime: 120,
        rating: 4.9,
      },
      {
        id: '24',
        title: 'Chocolate Bread Pudding',
        image:
          'https://images.unsplash.com/photo-1551529834-a4317f14215a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
        description: 'Decadent dessert with chocolate and brioche.',
        prepTime: 70,
        rating: 4.7,
      },
    ],
  },
};

const seasons = [
  { id: 'spring', label: 'Spring', icon: <FiCalendar /> },
  { id: 'summer', label: 'Summer', icon: <FiCalendar /> },
  { id: 'autumn', label: 'Autumn', icon: <FiCalendar /> },
  { id: 'winter', label: 'Winter', icon: <FiCalendar /> },
];

// Component
const SeasonalDishesPage: React.FC = () => {
  const [currentSeason, setCurrentSeason] = useState<string>('spring');
  const seasonData = seasonalData[currentSeason];

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/explore'>Explore</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Seasonal Dishes</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Seasonal Dishes</PageTitle>
      <PageDescription>
        Discover recipes that celebrate the best ingredients each season has to
        offer, from spring's tender vegetables to winter's hearty comfort foods.
      </PageDescription>

      <SeasonSelector>
        {seasons.map((season) => (
          <SeasonButton
            key={season.id}
            active={currentSeason === season.id}
            onClick={() => setCurrentSeason(season.id)}>
            {season.icon} {season.label}
          </SeasonButton>
        ))}
      </SeasonSelector>

      <SeasonContainer>
        <SeasonIntroCard>
          <SeasonImage src={seasonData.image} />
          <SeasonInfo>
            <SeasonTitle>{seasonData.title}</SeasonTitle>
            <Paragraph>{seasonData.description}</Paragraph>
          </SeasonInfo>
        </SeasonIntroCard>

        <SectionTitle>
          Featured{' '}
          {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}{' '}
          Recipes
        </SectionTitle>
        <RecipeGrid>
          {seasonData.recipes.map((recipe) => (
            <RecipeCard key={recipe.id}>
              <RecipeImage src={recipe.image} />
              <RecipeContent>
                <RecipeTitle>{recipe.title}</RecipeTitle>
                <RecipeMeta>
                  <div>
                    <FiClock size={14} /> {recipe.prepTime} mins
                  </div>
                  <div>
                    <FiStar size={14} /> {recipe.rating}
                  </div>
                </RecipeMeta>
                <RecipeDescription>{recipe.description}</RecipeDescription>
                <ViewRecipeLink to={`/recipes/${recipe.id}`}>
                  View Recipe <FiArrowRight />
                </ViewRecipeLink>
              </RecipeContent>
            </RecipeCard>
          ))}
        </RecipeGrid>
      </SeasonContainer>
    </>
  );
};

export default SeasonalDishesPage;
