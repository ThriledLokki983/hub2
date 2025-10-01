import React from 'react';
import styled from 'styled-components';
import {
  colors,
  typography,
  borderRadius,
  shadows,
  spacing,
  breakpoints,
} from '../../theme/theme';

interface ElegantCardProps {
  title: string;
  image: string;
  description: string;
  rating?: number;
  days?: number;
  region?: string;
  prepTime?: string;
  difficulty?: string;
  variant?: 'compact' | 'detailed';
  onReserve?: () => void;
}

const Card = styled.div<{ $variant: 'compact' | 'detailed' }>`
  background-color: ${colors.white};
  border-radius: ${(props) => (props.$variant === 'compact' ? '24px' : '32px')};
  overflow: hidden;
  box-shadow: ${shadows.soft};
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: ${(props) => (props.$variant === 'compact' ? '320px' : '380px')};
  min-height: ${(props) => (props.$variant === 'compact' ? '320px' : '530px')};
`;

const ImageContainer = styled.div<{ $variant: 'compact' | 'detailed' }>`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 12px;
  // height: ${(props) => (props.$variant === 'compact' ? '300px' : '530px')};
  border-radius: ${(props) => (props.$variant === 'compact' ? '24px' : '32px')};

  figure {
    height: 100%;
  }
`;

const PropertyImage = styled.img`
  border-radius: 12px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: bottom center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08), 0px 6px 3px rgba(0, 0, 0, 0.03),
    0px 3px 5px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1),
    0px 0px 0px 1px rgba(0, 0, 0, 0.01);
  transition: transform 0.3s ease-in, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1), 0px 4px 2px rgba(0, 0, 0, 0.05),
      0px 4px 6px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1),
      0px 0px 0px 1px rgba(0, 0, 0, 0.01);
  }
`;

const RegionTag = styled.span`
  position: absolute;
  top: calc(${spacing.sm} + 0.75rem);
  right: calc(${spacing.sm} + 0.75rem);
  background-color: ${colors.cosmicLatte}CC;
  backdrop-filter: blur(4px);
  color: ${colors.emeraldGreen};
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: calc(${borderRadius.sm} * 3);
  font-weight: ${typography.fontWeights.medium};
  letter-spacing: ${typography.letterSpacing};

  @media (min-width: ${breakpoints.tablet}) {
    top: calc(${spacing.sm} + 0.75rem);
    right: calc(${spacing.sm} + 0.75rem);
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
`;

const Content = styled.div<{ $variant: 'compact' | 'detailed' }>`
  padding: ${(props) =>
    props.$variant === 'compact' ? '8px 16px 12px 16px' : '0'};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CompactCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

const Title = styled.h3<{ $variant: 'compact' | 'detailed' }>`
  font-weight: ${typography.fontWeights.semiBold};
  color: ${(props) =>
    props.$variant === 'compact' ? colors.deepSpace : colors.white};
  font-size: ${(props) => (props.$variant === 'compact' ? '1.2rem' : '1.3rem')};
  margin: 0;
`;

const Description = styled.p<{ $variant: 'compact' | 'detailed' }>`
  color: ${(props) =>
    props.$variant === 'compact'
      ? colors.galaxyGrey
      : 'rgba(255, 255, 255, 0.9)'};
  font-size: ${(props) => (props.$variant === 'compact' ? '0.85rem' : '0.9rem')};
  font-weight: ${typography.fontWeights.light};
  margin: 0;
  line-height: 1.5;
`;

const MetaContainer = styled.div`
  display: flex;
  gap: 24px;
  margin-top: auto;
  margin-top: 16px;
`;

const MetaBox = styled.div`
  background: #f4f4f4;
  border-radius: 16px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const MetaLabel = styled.div`
  font-size: 0.6rem;
  color: ${colors.galaxyGrey};
`;

const MetaValue = styled.div<{ difficulty: string }>`
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.deepSpace};
  font-size: 0.8rem;

  &:before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${(props) =>
      props.difficulty === 'easy' ? colors.emeraldGreen : colors.darkPastelRed};
    margin-right: 6px;
    margin-bottom: 2px;
  }
`;

const RecipeViewButton = styled.button<{ $variant: 'compact' | 'detailed' }>`
  background-color: ${colors.emeraldGreen};
  color: ${colors.white};
  border: 2px solid ${colors.white};
  border-radius: ${(props) => (props.$variant === 'compact' ? '16px' : '24px')};
  padding: ${(props) => (props.$variant === 'compact' ? '16px 8px' : '16px')};
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.medium};
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;
  margin-top: 16px;
  box-shadow: ${shadows.soft};

  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${colors.white};
    color: ${colors.emeraldGreen};
    box-shadow: ${shadows.medium};
    border: ${colors.emeraldGreen} 2px solid;
  }
`;

const ElegantCard: React.FC<ElegantCardProps> = ({
  title,
  image,
  description,
  variant = 'compact',
  region,
  prepTime,
  difficulty,
  onReserve,
}) => {
  if (variant === 'compact') {
    return (
      <Card $variant='compact'>
        <ImageContainer $variant='compact'>
          <figure>
            <PropertyImage
              src={image}
              alt={title}
            />
            {region && <RegionTag>{region}</RegionTag>}
          </figure>
        </ImageContainer>
        <Content $variant='compact'>
          <CompactCardHeader>
            <Title $variant='compact'>{title}</Title>
          </CompactCardHeader>
          <Description $variant='compact'>{description}</Description>

          <MetaContainer>
            {prepTime && (
              <MetaBox>
                <MetaLabel>Duration</MetaLabel>
                <MetaValue difficulty='diff'>{prepTime}</MetaValue>
              </MetaBox>
            )}
            {difficulty && (
              <MetaBox>
                <MetaLabel>Difficulty</MetaLabel>
                <MetaValue difficulty='easy'>{difficulty}</MetaValue>
              </MetaBox>
            )}
          </MetaContainer>

          <RecipeViewButton
            $variant='compact'
            onClick={onReserve}>
            View Recipe
          </RecipeViewButton>
        </Content>
      </Card>
    );
  }
};

export default ElegantCard;
