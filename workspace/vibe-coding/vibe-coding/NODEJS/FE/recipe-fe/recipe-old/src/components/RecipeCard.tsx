import React from 'react';
import styled from 'styled-components';
import {
  colors,
  typography,
  borderRadius,
  shadows,
  spacing,
  breakpoints,
} from '../theme/theme';
import { kenteAccentHorizontal, kenteBackground } from './KentePatterns';

interface RecipeCardProps {
  title: string;
  description: string;
  image: string;
  prepTime: string;
  difficulty: string;
  region?: string;
  onClick?: () => void;
}

const Card = styled.div`
  ${kenteBackground}
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  box-shadow: ${shadows.soft};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.medium};
  }

  @media (max-width: ${breakpoints.mobile}) {
    margin-bottom: ${spacing.sm};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  padding-top: 65%;
  width: 100%;
  overflow: hidden;

  @media (min-width: ${breakpoints.tablet}) {
    padding-top: 60%;
  }
`;

const RecipeImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const RegionTag = styled.span`
  position: absolute;
  top: ${spacing.sm};
  right: ${spacing.sm};
  background-color: ${colors.cosmicLatte}CC;
  backdrop-filter: blur(4px);
  color: ${colors.emeraldGreen};
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: ${borderRadius.sm};
  font-weight: ${typography.fontWeights.medium};
  letter-spacing: ${typography.letterSpacing};

  @media (min-width: ${breakpoints.tablet}) {
    top: ${spacing.md};
    right: ${spacing.md};
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
`;

const Content = styled.div`
  padding: ${spacing.md};
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.lg};
  }
`;

const Title = styled.h3`
  ${kenteAccentHorizontal}
  margin-bottom: ${spacing.lg};
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  position: relative;
  display: inline-block;
  font-size: 1.2rem;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 1.3rem;
    margin-bottom: ${spacing.xl};
  }
`;

const Description = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 0.85rem;
  font-weight: ${typography.fontWeights.light};
  margin-bottom: ${spacing.md};
  line-height: 1.5;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: ${spacing.lg};
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: ${colors.galaxyGrey};

  &:before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${colors.darkPastelRed};
    margin-right: 6px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 0.8rem;

    &:before {
      width: 6px;
      height: 6px;
      margin-right: 8px;
    }
  }
`;

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  description,
  image,
  prepTime,
  difficulty,
  region,
  onClick,
}) => {
  return (
    <Card onClick={onClick}>
      <ImageContainer>
        <RecipeImage
          src={image}
          alt={title}
        />
        {region && <RegionTag>{region}</RegionTag>}
      </ImageContainer>
      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <MetaInfo>
          <MetaItem>{prepTime}</MetaItem>
          <MetaItem>{difficulty}</MetaItem>
        </MetaInfo>
      </Content>
    </Card>
  );
};

export default RecipeCard;
