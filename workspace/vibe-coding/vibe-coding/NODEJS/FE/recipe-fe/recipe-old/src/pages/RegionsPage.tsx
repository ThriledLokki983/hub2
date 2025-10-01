import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowRight } from 'react-icons/fi';
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
  SectionTitle,
  PageSection,
  Banner,
  BannerContent,
  BannerTitle,
  BannerDescription,
  BannerImage,
} from '../components/PageComponents';
import { kenteBackground } from '../components/KentePatterns';

// Styled components
const RegionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RegionCard = styled(Card)`
  height: 340px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 40%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: 1;
    pointer-events: none;
  }
`;

const RegionImage = styled.div<{ backgroundImage: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(\${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;

  \${RegionCard}:hover & {
    transform: scale(1.05);
  }
`;

const RegionContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${spacing.lg};
  z-index: 2;
  color: white;
`;

const RegionCardTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  font-weight: ${typography.fontWeights.light};
  margin-bottom: ${spacing.sm};
`;

const RegionCardText = styled.p`
  color: ${colors.cosmicLatte};
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: ${spacing.md};
  opacity: 0.9;
`;

const ExploreLink = styled(Link)`
  color: ${colors.maximumYellow};
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 0.9rem;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  svg {
    transition: transform 0.2s;
  }

  &:hover svg {
    transform: translateX(3px);
  }
`;

const RegionCount = styled.span`
  background-color: ${colors.maximumYellow};
  color: ${colors.deepSpace};
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: ${typography.fontWeights.regular};
  margin-left: ${spacing.sm};
`;

const MapSection = styled.div`
  margin: ${spacing.xl} 0;
  padding: ${spacing.xl};
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  ${kenteBackground}
  position: relative;
  overflow: hidden;
`;

const MapTitle = styled(SectionTitle)`
  margin-top: 0;
`;

const MapDescription = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: ${spacing.xl};
  max-width: 800px;
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background-color: ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  overflow: hidden;

  @media (min-width: ${breakpoints.tablet}) {
    height: 500px;
  }
`;

const MapPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.galaxyGrey};
  font-size: 1rem;
`;

// Sample data
const regions = [
  {
    id: 1,
    name: 'Ashanti Region',
    image: 'https://example.com/ashanti.jpg',
    description:
      'Home of the Ashanti kingdom with rich culinary traditions featuring fufu with light soup and palm nut soup.',
    recipeCount: 24,
  },
  {
    id: 2,
    name: 'Greater Accra Region',
    image: 'https://example.com/accra.jpg',
    description:
      'The cosmopolitan capital region featuring diverse dishes like kenkey with fish, banku and waakye.',
    recipeCount: 32,
  },
  {
    id: 3,
    name: 'Northern Region',
    image: 'https://example.com/northern.jpg',
    description:
      'Known for unique dishes like tuo zaafi, ayoyo soup and spicy grilled meats.',
    recipeCount: 19,
  },
  {
    id: 4,
    name: 'Western Region',
    image: 'https://example.com/western.jpg',
    description:
      'Coastal region famous for seafood dishes and palm oil-based soups and stews.',
    recipeCount: 16,
  },
  {
    id: 5,
    name: 'Volta Region',
    image: 'https://example.com/volta.jpg',
    description:
      'Bordered by Togo, featuring distinctive dishes like akple with okro soup and flavored rice dishes.',
    recipeCount: 21,
  },
  {
    id: 6,
    name: 'Eastern Region',
    image: 'https://example.com/eastern.jpg',
    description:
      'Rich in agricultural produce, known for dishes incorporating fresh farm ingredients.',
    recipeCount: 18,
  },
];

const RegionsPage = () => {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Regions</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Ghana's Culinary Regions</PageTitle>
      <PageDescription>
        Explore the diverse regional cuisines of Ghana, each with unique
        ingredients, cooking methods, and traditional dishes that reflect local
        culture and history.
      </PageDescription>

      <Banner>
        <BannerContent>
          <BannerTitle>Discover Regional Delicacies</BannerTitle>
          <BannerDescription>
            Ghana's cuisine is as diverse as its culture, with each region
            offering unique flavors and cooking traditions. From the spicy
            dishes of the north to the seafood specialties of the coastal
            regions, embark on a culinary journey across Ghana.
          </BannerDescription>
        </BannerContent>
        <BannerImage backgroundImage='https://example.com/ghana-map.jpg' />
      </Banner>

      <RegionGrid>
        {regions.map((region) => (
          <RegionCard key={region.id}>
            <RegionImage backgroundImage={region.image} />
            <RegionContent>
              <RegionCardTitle>
                {region.name}
                <RegionCount>{region.recipeCount} Recipes</RegionCount>
              </RegionCardTitle>
              <RegionCardText>{region.description}</RegionCardText>
              <ExploreLink to={`/regional-cuisines/${region.id}`}>
                Explore recipes
                <FiArrowRight size={16} />
              </ExploreLink>
            </RegionContent>
          </RegionCard>
        ))}
      </RegionGrid>

      <MapSection>
        <MapTitle>Interactive Ghana Food Map</MapTitle>
        <MapDescription>
          Explore Ghana's culinary geography with our interactive map. Click on
          different regions to discover local specialties, traditional
          ingredients, and the cultural significance behind iconic dishes.
        </MapDescription>
        <MapContainer>
          <MapPlaceholder>
            Interactive map will be displayed here
          </MapPlaceholder>
        </MapContainer>
      </MapSection>

      <PageSection>
        <SectionTitle>The Cultural Significance of Regional Foods</SectionTitle>
        <PageDescription>
          Food in Ghana is more than just sustenance—it's a reflection of
          cultural heritage, social connection, and historical influences. Many
          dishes are tied to important ceremonies, festivals, and family
          traditions that have been passed down through generations.
        </PageDescription>

        <PageDescription>
          By exploring regional cuisines, you can gain insights into Ghana's
          diverse ethnic groups, colonial history, trade influences, and local
          agricultural practices. Each recipe tells a story of the people who
          created it and the environment that shaped its ingredients and
          preparation methods.
        </PageDescription>
      </PageSection>
    </>
  );
};

export default RegionsPage;
