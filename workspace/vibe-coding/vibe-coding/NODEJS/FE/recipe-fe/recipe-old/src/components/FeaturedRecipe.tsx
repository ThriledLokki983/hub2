import React from 'react';
import styled from 'styled-components';
import {
  colors,
  typography,
  borderRadius,
  spacing,
  shadows,
  breakpoints,
} from '../theme/theme';
import { kenteBorder } from './KentePatterns';
import Button from './Button';

interface FeaturedRecipeProps {
  id?: number;
  title: string;
  description: string;
  image: string;
  chef: string;
  cook_time: string;
  servings: number;
  region?: string;
  difficulty?: string;
  onViewRecipe: () => void;
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  box-shadow: ${shadows.medium};
  margin: ${spacing.lg} 0;

  @media (min-width: ${breakpoints.tablet}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: ${spacing.xl} 0;
  }

  @media (min-width: ${breakpoints.desktop}) {
    margin: ${spacing.xxl} 0;
  }
`;

const ImageSection = styled.div`
  position: relative;
  height: 250px;

  @media (min-width: ${breakpoints.mobile}) {
    height: 300px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    height: 500px;
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: centre;
`;

const ContentSection = styled.div`
  ${kenteBorder}
  padding: ${spacing.lg};
  display: flex;
  flex-direction: column;

  @media (min-width: ${breakpoints.mobile}) {
    padding: ${spacing.xl};
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.xl} ${spacing.xl};
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: ${spacing.xl} ${spacing.xxl};
  }
`;

const Category = styled.span`
  color: ${colors.darkPastelRed};
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${spacing.sm};
  font-weight: ${typography.fontWeights.medium};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 0.85rem;
    margin-bottom: ${spacing.md};
  }
`;

const Title = styled.h2`
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.light};
  margin-bottom: ${spacing.md};
  font-size: 1.8rem;
  line-height: 1.2;

  @media (min-width: ${breakpoints.mobile}) {
    font-size: 2rem;
    margin-bottom: ${spacing.lg};
  }

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 2.2rem;
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  color: ${colors.galaxyGrey};
  font-weight: ${typography.fontWeights.light};
  margin-bottom: ${spacing.lg};
  line-height: 1.6;
  font-size: 0.9rem;

  @media (min-width: ${breakpoints.tablet}) {
    line-height: 1.8;
    font-size: 1rem;
    margin-bottom: ${spacing.xl};
  }
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.sm};
  margin-bottom: ${spacing.lg};

  @media (min-width: ${breakpoints.mobile}) {
    gap: ${spacing.md};
  }

  @media (min-width: ${breakpoints.tablet}) {
    margin-bottom: ${spacing.xl};
  }
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaLabel = styled.span`
  font-size: 0.7rem;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.xs};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 0.75rem;
  }
`;

const MetaValue = styled.span`
  font-size: 0.9rem;
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.regular};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: auto;
  flex-wrap: wrap;

  @media (min-width: ${breakpoints.mobile}) {
    flex-wrap: nowrap;
  }
`;

const RecipeBadges = styled.div`
  display: flex;
  gap: ${spacing.sm};
  position: absolute;
  top: ${spacing.md};
  right: ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    top: ${spacing.lg};
    right: ${spacing.lg};
  }
`;

const Badge = styled.span<{ type?: 'region' | 'difficulty'; difficulty?: string }>`
  display: inline-flex;
  align-items: center;
  background-color: ${(props) => {
    if (props.type === 'region') {
      return `${colors.emeraldGreen}CC`;
    } else if (props.type === 'difficulty') {
      if (props.difficulty === 'Hard') return `${colors.darkPastelRed}90`;
      if (props.difficulty === 'Medium') return `${colors.maximumYellow}90`;
      if (props.difficulty === 'Easy') return `${colors.lightGreen}80`;
      return `${colors.darkPastelRed}90`;
    } else {
      return `${colors.cosmicLatte}CC`;
    }
  }};
  color: ${(props) => {
    if (props.type === 'region') {
      return colors.white;
    } else if (props.type === 'difficulty') {
      if (props.difficulty === 'Medium') return colors.deepSpace;
      return colors.white;
    } else {
      return colors.deepSpace;
    }
  }};
  font-size: 0.7rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  font-weight: ${typography.fontWeights.medium};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 0.75rem;
    padding: 0.4rem 1rem;
  }
`;

const FeaturedRecipe: React.FC<FeaturedRecipeProps> = ({
  title,
  description,
  image,
  chef,
  cook_time,
  servings,
  region,
  difficulty,
  id,
  onViewRecipe,
}) => {
  return (
    <Container>
      <ImageSection>
        <RecipeImage
          src={image}
          alt={title}
        />
        {(region || difficulty) && (
          <RecipeBadges>
            {region && <Badge type="region">{region}</Badge>}
            {difficulty && <Badge type="difficulty" difficulty={difficulty}>{difficulty}</Badge>}
          </RecipeBadges>
        )}
      </ImageSection>
      <ContentSection>
        <Category>Featured Recipe</Category>
        <Title>{title}</Title>
        <Description>{description}</Description>

        <MetaInfo>
          <MetaItem>
            <MetaLabel>Chef</MetaLabel>
            <MetaValue>{chef}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Cook Time</MetaLabel>
            <MetaValue>{cook_time}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Servings</MetaLabel>
            <MetaValue>{servings}</MetaValue>
          </MetaItem>
        </MetaInfo>

        <ButtonGroup>
          <Button
            primary
            // onClick={onViewRecipe}
            href={`/recipe/${id}`}>
            View Recipe
          </Button>
          <Button outlined>Save for Later</Button>
        </ButtonGroup>
      </ContentSection>
    </Container>
  );
};

export default FeaturedRecipe;
