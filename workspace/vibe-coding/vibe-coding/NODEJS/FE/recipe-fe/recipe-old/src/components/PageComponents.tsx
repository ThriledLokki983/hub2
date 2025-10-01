import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  breakpoints,
} from '../theme/theme';
import { kenteAccentHorizontal, kenteBackground } from './KentePatterns';

// Base page components
export const PageTitle = styled.h1`
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.light};
  font-size: 2.5rem;
  margin-bottom: ${spacing.lg};
  position: relative;
  display: inline-block;
  ${kenteAccentHorizontal}

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

export const PageSection = styled.section`
  margin-bottom: ${spacing.xxl};
`;

export const SectionTitle = styled.h2`
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.light};
  font-size: 1.8rem;
  margin-bottom: ${spacing.lg};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: ${colors.darkPastelRed};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

export const SubSectionTitle = styled.h3`
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.medium};
  font-size: 1.4rem;
  margin-bottom: ${spacing.md};
`;

export const Paragraph = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: ${spacing.md};
  font-weight: ${typography.fontWeights.light};
  max-width: 800px;
`;

export const PageDescription = styled(Paragraph)`
  font-size: 1.1rem;
  margin-bottom: ${spacing.xl};
`;

// Card and Grid components
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${spacing.lg};
`;

export const Card = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  ${kenteBackground}

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.medium};
  }
`;

export const CardImage = styled.div<{ $backgroundImage?: string }>`
  height: 200px;
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
`;

export const CardContent = styled.div`
  padding: ${spacing.lg};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CardTitle = styled.h3`
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.light};
  font-size: 1.3rem;
  margin-bottom: ${spacing.sm};
`;

export const CardText = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: ${spacing.md};
`;

export const CardLink = styled(Link)`
  color: ${colors.emeraldGreen};
  font-size: 0.9rem;
  text-decoration: none;
  margin-top: auto;
  display: inline-flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-left: ${spacing.xs};
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(3px);
  }
`;

// Banner components
export const Banner = styled.div`
  width: 100%;
  background-color: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  margin-bottom: ${spacing.xl};
  display: flex;
  flex-direction: column;
  ${kenteBackground}
  position: relative;
  overflow: hidden;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
  }
`;

export const BannerContent = styled.div`
  flex: 2;

  @media (min-width: ${breakpoints.tablet}) {
    padding-right: ${spacing.lg};
  }
`;

export const BannerImage = styled.div<{ $backgroundImage?: string }>`
  flex: 1;
  min-height: 200px;
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  border-radius: ${borderRadius.md};
  margin-top: ${spacing.lg};

  @media (min-width: ${breakpoints.tablet}) {
    margin-top: 0;
  }
`;

export const BannerTitle = styled.h2`
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.light};
  font-size: 1.8rem;
  margin-bottom: ${spacing.sm};
`;

export const BannerDescription = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: ${spacing.lg};
`;

// List components
export const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: ${spacing.lg};
`;

export const ListItem = styled.li`
  position: relative;
  padding-left: ${spacing.lg};
  margin-bottom: ${spacing.md};
  color: ${colors.galaxyGrey};
  line-height: 1.6;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${colors.darkPastelRed};
  }
`;

// Image components
export const ImageContainer = styled.div`
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${spacing.lg};
  box-shadow: ${shadows.soft};
`;

export const StyledImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

// Button components
export const PageButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: ${typography.fontWeights.light};
  letter-spacing: ${typography.letterSpacing};
  border-radius: ${borderRadius.md};
  background-color: ${colors.emeraldGreen};
  color: ${colors.white};
  border: none;
  box-shadow: ${shadows.soft};
  transition: all 0.2s ease;
  text-decoration: none;
  cursor: pointer;
  margin-right: ${spacing.md};
  margin-bottom: ${spacing.md};

  &:hover {
    background-color: ${colors.emeraldGreen}ee;
    transform: translateY(-2px);
    box-shadow: ${shadows.medium};
  }

  &:active {
    transform: translateY(0);
  }
`;

// Breadcrumbs component
export const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing.lg};
  flex-wrap: wrap;
`;

export const BreadcrumbItem = styled(Link)`
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    color: ${colors.emeraldGreen};
    text-decoration: underline;
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: ${colors.galaxyGrey};
  margin: 0 ${spacing.xs};
  font-size: 0.9rem;
`;

export const BreadcrumbCurrent = styled.span`
  color: ${colors.darkPastelRed};
  font-size: 0.9rem;
`;

// Flex layout helpers
export const FlexRow = styled.div`
  display: flex;
  gap: ${spacing.lg};
  flex-wrap: wrap;
  margin-bottom: ${spacing.lg};
`;

export const FlexColumn = styled.div<{ flex?: number }>`
  flex: ${(props) => props.flex || 1};
  min-width: 250px;
`;
