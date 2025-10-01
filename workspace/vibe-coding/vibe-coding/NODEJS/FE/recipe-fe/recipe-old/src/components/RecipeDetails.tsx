import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiClock,
  FiUsers,
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiBookmark,
  FiUser,
} from 'react-icons/fi';
import {
  colors,
  typography,
  borderRadius,
  shadows,
  spacing,
  breakpoints,
} from '../theme/theme';
import {
  kenteAccentHorizontal,
  kenteBackground,
} from './KentePatterns';
import Button from './Button';

interface RecipeDetailsProps {
  id: number;
  title: string;
  description: string;
  image: string;
  chef: string;
  prep_time?: string;
  cook_time?: string;
  total_time?: string;
  servings?: number;
  difficulty?: string;
  region?: string;
  ingredients: Array<{
    name: string;
    amount: string;
    notes?: string;
  }>;
  instructions: Array<{
    step_number: number;
    text: string;
  }>;
  nutritionalInfo?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fats?: string;
  };
  tips?: string[];
  relatedRecipes?: Array<{
    id: number;
    title: string;
    image: string;
  }>;
  onBack?: () => void;
}

const RecipeDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-bottom: ${spacing.xl};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${colors.galaxyGrey};
  font-family: ${typography.fontFamily};
  font-size: 0.9rem;
  font-weight: ${typography.fontWeights.light};
  cursor: pointer;
  padding: ${spacing.sm};
  margin: ${spacing.md} 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.emeraldGreen};
  }

  svg {
    margin-right: ${spacing.xs};
  }

  @media (min-width: ${breakpoints.tablet}) {
    margin: ${spacing.lg} 0;
  }
`;

const HeroSection = styled.div`
  position: relative;
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${spacing.xl};
  box-shadow: ${shadows.medium};
  height: 30vh;

  @media (min-width: ${breakpoints.tablet}) {
    height: 40vh;
  }

  @media (min-width: ${breakpoints.desktop}) {
    height: 40vh;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(26, 26, 34, 0.05) 0%,
    rgba(26, 26, 34, 0.4) 70%,
    rgba(26, 26, 34, 0.7) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${spacing.lg};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.xl};
  }
`;

const RecipeBadges = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.md};
  position: absolute;
  top: ${spacing.md};
  right: ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    margin-bottom: ${spacing.sm};
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

const HeroTitle = styled.h1`
  color: ${colors.white};
  font-weight: ${typography.fontWeights.light};
  font-size: 1.8rem;
  margin-bottom: ${spacing.xs};
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 2.5rem;
    margin-bottom: ${spacing.xs};
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 3rem;
  }
`;

const HeroDescription = styled.p`
  color: ${colors.cosmicLatte};
  font-size: 0.9rem;
  font-weight: ${typography.fontWeights.light};
  max-width: 800px;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: ${spacing.xs};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 1rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.xl};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr;
    gap: ${spacing.xl};
  }
`;

const MainContent = styled.div`
  ${kenteBackground}
  padding: ${spacing.md};
  border-radius: ${borderRadius.lg};
  background-color: ${colors.white};
  box-shadow: ${shadows.soft};
  position: relative;
  overflow: hidden;

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.lg};
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const InfoBox = styled.div`
  padding: ${spacing.md};
  border-radius: ${borderRadius.lg};
  background-color: ${colors.white};
  box-shadow: ${shadows.soft};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.lg};
  }
`;

const RecipeActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${spacing.md};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${colors.galaxyGrey};
  cursor: pointer;
  padding: ${spacing.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.emeraldGreen};
  }

  svg {
    margin-right: ${spacing.xs};
  }
`;

const RecipeInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const RecipeInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${spacing.md};
  background-color: ${colors.cosmicLatte}50;
  border-radius: ${borderRadius.md};
`;

const RecipeInfoIcon = styled.div`
  color: ${colors.emeraldGreen};
  margin-bottom: ${spacing.xs};
`;

const RecipeInfoLabel = styled.span`
  color: ${colors.galaxyGrey};
  font-size: 0.7rem;
  margin-bottom: ${spacing.xs};
`;

const RecipeInfoValue = styled.span`
  color: ${colors.deepSpace};
  font-size: 0.9rem;
  font-weight: ${typography.fontWeights.regular};
`;

const SectionTitle = styled.h2`
  ${kenteAccentHorizontal}
  font-size: 1.4rem;
  color: ${colors.deepSpace};
  margin: ${spacing.lg} 0 ${spacing.md};
  font-weight: ${typography.fontWeights.light};
  position: relative;
  display: inline-block;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 1.6rem;
  }
`;

const IngredientsSection = styled.div`
  margin-bottom: ${spacing.xl};
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-block-start: ${spacing.sm};
`;

const IngredientItem = styled.li`
  display: flex;
  align-items: baseline;
  padding: ${spacing.sm} 0;
  border-bottom: 1px dashed ${colors.antiqueWhite};

  &:last-child {
    border-bottom: none;
  }

  &:before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${colors.maximumYellow};
    margin-right: ${spacing.sm};
    flex-shrink: 0;
  }
`;

const IngredientAmount = styled.span`
  color: ${colors.emeraldGreen};
  font-weight: ${typography.fontWeights.medium};
  font-size: 0.9rem;
  width: 120px;
  margin-right: ${spacing.md};
`;

const IngredientName = styled.span`
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.light};
  font-size: 0.95rem;
  flex-grow: 1;
`;

const IngredientNote = styled.span`
  color: ${colors.galaxyGrey};
  font-style: italic;
  font-size: 0.8rem;
  margin-left: ${spacing.md};
`;

const InstructionsSection = styled.div`
  margin-bottom: ${spacing.xl};
`;

const InstructionsList = styled.ol`
  padding-left: ${spacing.lg};
  margin-block-start: ${spacing.md};
`;

const InstructionItem = styled.li`
  margin-bottom: ${spacing.lg};
  position: relative;
  padding-left: ${spacing.md};
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.light};
  line-height: 1.6;

  &::marker {
    color: ${colors.emeraldGreen};
    font-weight: ${typography.fontWeights.medium};
  }
`;

const StepNumber = styled.div`
  position: absolute;
  left: -${spacing.xl};
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: ${colors.emeraldGreen};
  color: ${colors.white};
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: ${typography.fontWeights.medium};
`;

const TipsSection = styled.div`
  margin-bottom: ${spacing.xl};
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TipItem = styled.li`
  position: relative;
  padding: ${spacing.md};
  background-color: ${colors.cosmicLatte}80;
  margin-bottom: ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};

  &:before {
    content: '💡';
    margin-right: ${spacing.sm};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ChefBox = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.md};
  background-color: ${colors.cosmicLatte}50;
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.lg};
`;

const ChefAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${colors.antiqueWhite};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.md};
  overflow: hidden;
  font-size: 1.2rem;
  color: ${colors.emeraldGreen};
  border: 2px solid ${colors.emeraldGreen}40;
`;

const ChefInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChefName = styled.span`
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.medium};
  font-size: 0.95rem;
`;

const ChefTitle = styled.span`
  color: ${colors.galaxyGrey};
  font-size: 0.8rem;
`;

const NutritionalInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.sm};
`;

const NutritionalInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing.sm};
  background-color: ${colors.white};
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.antiqueWhite};
`;

const NutritionalInfoLabel = styled.span`
  color: ${colors.galaxyGrey};
  font-size: 0.7rem;
`;

const NutritionalInfoValue = styled.span`
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.medium};
  font-size: 1rem;
`;

const RelatedRecipesSection = styled.div``;

const RelatedRecipesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const RelatedRecipeItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.sm};
  cursor: pointer;
  border-radius: ${borderRadius.md};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.cosmicLatte}50;
  }
`;

const RelatedRecipeImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${borderRadius.md};
  overflow: hidden;
  flex-shrink: 0;
  margin-right: ${spacing.md};
`;

const RelatedRecipeImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RelatedRecipeTitle = styled.span`
  color: ${colors.deepSpace};
  font-size: 0.9rem;
  font-weight: ${typography.fontWeights.light};
`;

const PrintRecipeButton = styled(Button)`
  margin-top: ${spacing.md};
  width: 100%;
`;

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  title,
  description,
  image,
  chef,
  prep_time,
  cook_time,
  total_time,
  servings,
  difficulty,
  region,
  ingredients,
  instructions,
  nutritionalInfo,
  tips,
  relatedRecipes = [],
  onBack,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      ?.map((part) => part[0])
      ?.join('')
      ?.toUpperCase();
  };

  return (
    <RecipeDetailsContainer>
      <BackButton onClick={onBack}>
        <FiArrowLeft size={18} />
        Back to Recipes
      </BackButton>

      <HeroSection>
        <HeroImage
          src={image}
          alt={title}
        />
        <HeroOverlay>
          <RecipeBadges>
            {region && <Badge type='region'>{region}</Badge>}
            {difficulty && <Badge type='difficulty' difficulty={difficulty}>{difficulty}</Badge>}
          </RecipeBadges>
          <HeroTitle>{title}</HeroTitle>
          <HeroDescription>{description}</HeroDescription>
        </HeroOverlay>
      </HeroSection>

      <ContentGrid>
        <MainContent>
          <RecipeActions>
            <div>
              <ActionButton onClick={() => setIsSaved(!isSaved)}>
                {isSaved ? (
                  <FiHeart
                    fill={colors.darkPastelRed}
                    color={colors.darkPastelRed}
                  />
                ) : (
                  <FiHeart />
                )}
                {isSaved ? 'Saved' : 'Save'}
              </ActionButton>
              <ActionButton>
                <FiShare2 />
                Share
              </ActionButton>
              <ActionButton>
                <FiBookmark />
                Bookmark
              </ActionButton>
            </div>
          </RecipeActions>

          <RecipeInfoGrid>
            {prep_time && (
              <RecipeInfoItem>
                <RecipeInfoIcon>
                  <FiClock size={18} />
                </RecipeInfoIcon>
                <RecipeInfoLabel>Prep Time</RecipeInfoLabel>
                <RecipeInfoValue>{prep_time}</RecipeInfoValue>
              </RecipeInfoItem>
            )}
            {cook_time && (
              <RecipeInfoItem>
                <RecipeInfoIcon>
                  <FiClock size={18} />
                </RecipeInfoIcon>
                <RecipeInfoLabel>Cook Time</RecipeInfoLabel>
                <RecipeInfoValue>{cook_time}</RecipeInfoValue>
              </RecipeInfoItem>
            )}
            {total_time && (
              <RecipeInfoItem>
                <RecipeInfoIcon>
                  <FiClock size={18} />
                </RecipeInfoIcon>
                <RecipeInfoLabel>Total Time</RecipeInfoLabel>
                <RecipeInfoValue>{total_time}</RecipeInfoValue>
              </RecipeInfoItem>
            )}
            {servings && (
              <RecipeInfoItem>
                <RecipeInfoIcon>
                  <FiUsers size={18} />
                </RecipeInfoIcon>
                <RecipeInfoLabel>Servings</RecipeInfoLabel>
                <RecipeInfoValue>{servings}</RecipeInfoValue>
              </RecipeInfoItem>
            )}
          </RecipeInfoGrid>

          <IngredientsSection>
            <SectionTitle>Ingredients</SectionTitle>
            <IngredientsList>
              {ingredients?.map((ingredient, index) => (
                <IngredientItem key={index}>
                  <IngredientAmount>{ingredient.amount}</IngredientAmount>
                  <IngredientName>{ingredient.name}</IngredientName>
                  {ingredient.notes && (
                    <IngredientNote>{ingredient.notes}</IngredientNote>
                  )}
                </IngredientItem>
              ))}
            </IngredientsList>
          </IngredientsSection>

          <InstructionsSection>
            <SectionTitle>Instructions</SectionTitle>
            <InstructionsList>
              {instructions?.map((instruction) => (
                <InstructionItem key={instruction.step_number}>
                  {instruction.text}
                </InstructionItem>
              ))}
            </InstructionsList>
          </InstructionsSection>

          {tips && tips.length > 0 && (
            <TipsSection>
              <SectionTitle>Chef's Tips</SectionTitle>
              <TipsList>
                {tips.map((tip, index) => (
                  <TipItem key={index}>{tip}</TipItem>
                ))}
              </TipsList>
            </TipsSection>
          )}
        </MainContent>

        <Sidebar>
          <InfoBox>
            <ChefBox>
              <ChefAvatar>{getInitials(chef)}</ChefAvatar>
              <ChefInfo>
                <ChefName>{chef}</ChefName>
                <ChefTitle>Recipe Creator</ChefTitle>
              </ChefInfo>
            </ChefBox>

            {nutritionalInfo && (
              <>
                <SectionTitle>Nutritional Info</SectionTitle>
                <NutritionalInfoGrid>
                  {nutritionalInfo.calories && (
                    <NutritionalInfoItem>
                      <NutritionalInfoValue>
                        {nutritionalInfo.calories}
                      </NutritionalInfoValue>
                      <NutritionalInfoLabel>Calories</NutritionalInfoLabel>
                    </NutritionalInfoItem>
                  )}
                  {nutritionalInfo.protein && (
                    <NutritionalInfoItem>
                      <NutritionalInfoValue>
                        {nutritionalInfo.protein}
                      </NutritionalInfoValue>
                      <NutritionalInfoLabel>Protein</NutritionalInfoLabel>
                    </NutritionalInfoItem>
                  )}
                  {nutritionalInfo.carbs && (
                    <NutritionalInfoItem>
                      <NutritionalInfoValue>
                        {nutritionalInfo.carbs}
                      </NutritionalInfoValue>
                      <NutritionalInfoLabel>Carbs</NutritionalInfoLabel>
                    </NutritionalInfoItem>
                  )}
                  {nutritionalInfo.fats && (
                    <NutritionalInfoItem>
                      <NutritionalInfoValue>
                        {nutritionalInfo.fats}
                      </NutritionalInfoValue>
                      <NutritionalInfoLabel>Fats</NutritionalInfoLabel>
                    </NutritionalInfoItem>
                  )}
                </NutritionalInfoGrid>
              </>
            )}

            <PrintRecipeButton outlined>Print Recipe</PrintRecipeButton>
          </InfoBox>

          {Array.isArray(relatedRecipes) && relatedRecipes.length > 0 && (
            <InfoBox>
              <SectionTitle>Similar Recipes</SectionTitle>
              <RelatedRecipesList>
                {relatedRecipes.map((recipe) => (
                  <RelatedRecipeItem key={recipe.id}>
                    <RelatedRecipeImage>
                      <RelatedRecipeImg
                        src={recipe.image}
                        alt={recipe.title}
                      />
                    </RelatedRecipeImage>
                    <RelatedRecipeTitle>{recipe.title}</RelatedRecipeTitle>
                  </RelatedRecipeItem>
                ))}
              </RelatedRecipesList>
            </InfoBox>
          )}
        </Sidebar>
      </ContentGrid>
    </RecipeDetailsContainer>
  );
};

export default RecipeDetails;
