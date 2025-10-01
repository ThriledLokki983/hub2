import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiMapPin,
  FiStar,
  FiChevronRight,
  FiInstagram,
  FiTwitter,
  FiGlobe,
  FiYoutube,
  FiClock,
  FiCalendar,
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
  PageSection,
} from '../../components/PageComponents';
import Button from '../../components/Button';

// Styled components
const ChefsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${spacing.xl};
  margin: ${spacing.xl} 0;

  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ChefCard = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  box-shadow: ${shadows.soft};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.medium};
  }
`;

const ChefImage = styled.div<{ backgroundImage: string }>`
  width: 100%;
  height: 300px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ChefCategory = styled.div`
  position: absolute;
  top: ${spacing.md};
  left: ${spacing.md};
  background-color: ${colors.emeraldGreen}80;
  color: ${colors.white};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${borderRadius.full};
  font-size: 0.8rem;
  backdrop-filter: blur(5px);
`;

const ChefInfo = styled.div`
  padding: ${spacing.lg};
`;

const ChefName = styled.h3`
  font-size: 1.4rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.xs};
`;

const ChefLocation = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 0.9rem;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.md};
`;

const ChefBio = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.md};
`;

const ChefSpecialties = styled.div`
  margin: ${spacing.md} 0;
`;

const ChefSpecialtyTitle = styled.div`
  font-size: 0.9rem;
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
`;

const SpecialtiesTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.xs};
`;

const SpecialtyTag = styled.div`
  background-color: ${colors.cosmicLatte};
  color: ${colors.emeraldGreen};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.full};
  font-size: 0.8rem;
`;

const ChefFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${spacing.lg};
  padding-top: ${spacing.md};
  border-top: 1px solid ${colors.cosmicLatte};
`;

const ChefSocial = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.full};
  background-color: ${colors.cosmicLatte};
  color: ${colors.deepSpace};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.emeraldGreen};
    color: ${colors.white};
    transform: translateY(-2px);
  }
`;

const RecipeBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 0.85rem;
  color: ${colors.galaxyGrey};
`;

const ViewProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.emeraldGreen};
  font-size: 0.95rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const FeaturedChefSection = styled.div`
  margin: ${spacing.xxl} 0;
`;

const FeaturedChef = styled.div`
  display: flex;
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  overflow: hidden;

  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
  }
`;

const FeaturedChefImage = styled.div<{ backgroundImage: string }>`
  width: 40%;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;

  @media (max-width: ${breakpoints.md}) {
    width: 100%;
    height: 300px;
  }
`;

const FeaturedChefInfo = styled.div`
  flex: 1;
  padding: ${spacing.xl};
`;

const FeaturedBadge = styled.div`
  display: inline-block;
  background-color: ${colors.maximumYellow}20;
  color: ${colors.deepSpace};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${borderRadius.full};
  font-size: 0.9rem;
  margin-bottom: ${spacing.md};

  span {
    color: ${colors.maximumYellow};
    margin-right: ${spacing.xs};
  }
`;

const FeaturedChefName = styled.h2`
  font-size: 2rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
`;

const FeaturedChefTitle = styled.div`
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
`;

const FeaturedChefBio = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: ${colors.galaxyGrey};
  margin: ${spacing.md} 0;

  p {
    margin-bottom: ${spacing.md};
  }
`;

const SignatureDishes = styled.div`
  margin-top: ${spacing.lg};
`;

const SignatureDishesTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const DishesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.md};

  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const DishItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background-color: ${colors.cosmicLatte}50;
  border-radius: ${borderRadius.md};
`;

const DishImage = styled.div<{ backgroundImage: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${borderRadius.md};
  flex-shrink: 0;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
`;

const DishInfo = styled.div`
  flex: 1;
`;

const DishName = styled.h4`
  font-size: 1rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.xs};
`;

const DishDescription = styled.p`
  font-size: 0.85rem;
  color: ${colors.galaxyGrey};
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin-bottom: ${spacing.xl};
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  background-color: ${(props) =>
    props.$active ? colors.emeraldGreen : colors.white};
  color: ${(props) => (props.$active ? colors.white : colors.deepSpace)};
  border: 1px solid
    ${(props) => (props.$active ? colors.emeraldGreen : colors.cosmicLatte)};
  border-radius: ${borderRadius.full};
  padding: ${spacing.sm} ${spacing.lg};
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.$active ? colors.emeraldGreen : colors.cosmicLatte};
    transform: translateY(-2px);
  }
`;

const ChefWorkshopsSection = styled.div`
  margin: ${spacing.xxl} 0;
  background-color: ${colors.cosmicLatte}30;
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
`;

const WorkshopsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.lg};
  margin-top: ${spacing.xl};

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const WorkshopCard = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  box-shadow: ${shadows.soft};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.medium};
  }
`;

const WorkshopImage = styled.div<{ backgroundImage: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const WorkshopDate = styled.div`
  position: absolute;
  bottom: ${spacing.md};
  left: ${spacing.md};
  background-color: ${colors.deepSpace}CC;
  color: ${colors.white};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: 0.8rem;
`;

const WorkshopContent = styled.div`
  padding: ${spacing.lg};
`;

const WorkshopTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
`;

const WorkshopMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
  font-size: 0.9rem;
  color: ${colors.galaxyGrey};
`;

const WorkshopChef = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const ChefAvatar = styled.div<{ backgroundImage: string }>`
  width: 24px;
  height: 24px;
  border-radius: ${borderRadius.full};
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
`;

const WorkshopDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.md};
`;

const JoinChefSection = styled.div`
  margin: ${spacing.xxl} 0;
  text-align: center;
  padding: ${spacing.xl};
  background: linear-gradient(
    45deg,
    ${colors.emeraldGreen}20,
    ${colors.maximumYellow}20
  );
  border-radius: ${borderRadius.lg};
`;

const JoinChefTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const JoinChefText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${colors.galaxyGrey};
  max-width: 700px;
  margin: 0 auto ${spacing.lg};
`;

// Mock data
const chefs = [
  {
    id: 1,
    name: 'Adjoa Mensah',
    location: 'Accra, Ghana',
    image:
      'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    category: 'Traditional',
    bio: 'Award-winning chef specializing in traditional Ghanaian cuisine with modern presentation. Known for bold flavors and innovative cooking techniques.',
    specialties: ['Jollof Rice', 'Waakye', 'Red Red', 'Kelewele'],
    recipeCount: 24,
    social: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      website: 'https://adjoa-mensah.com',
    },
  },
  {
    id: 2,
    name: 'Kwame Boateng',
    location: 'Kumasi, Ghana',
    image:
      'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80',
    category: 'Fusion',
    bio: 'Culinary innovator known for fusing Ghanaian flavors with international cuisines. Graduate of Le Cordon Bleu with 15 years of experience.',
    specialties: [
      'Groundnut Soup Ramen',
      'Jollof Risotto',
      'Sobolo-Infused Dishes',
    ],
    recipeCount: 18,
    social: {
      instagram: 'https://instagram.com',
      website: 'https://kwameboateng.com',
      youtube: 'https://youtube.com',
    },
  },
  {
    id: 3,
    name: 'Efua Owusu',
    location: 'Cape Coast, Ghana',
    image:
      'https://images.unsplash.com/photo-1592329347810-258afdd206bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80',
    category: 'Traditional',
    bio: 'Preserves authentic Central Region recipes passed down through generations. Specializes in seafood dishes and palm oil-based stews.',
    specialties: ['Fante Kenkey', 'Fish Stew', 'Mpotompoto', 'Fante Fante'],
    recipeCount: 32,
    social: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
    },
  },
  {
    id: 4,
    name: 'Kofi Asante',
    location: 'Tamale, Ghana',
    image:
      'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    category: 'Northern',
    bio: 'Specialist in Northern Ghanaian cuisine, celebrating the unique flavors of the region through traditional and contemporary preparations.',
    specialties: ['TZ (Tuo Zaafi)', 'Ayoyo Soup', 'Wasawasa', 'Bambara Beans'],
    recipeCount: 27,
    social: {
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
    },
  },
  {
    id: 5,
    name: 'Abena Nyarko',
    location: 'Takoradi, Ghana',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    category: 'Fusion',
    bio: 'Pastry chef blending European techniques with traditional Ghanaian ingredients to create innovative desserts and baked goods.',
    specialties: [
      'Tiger Nut Pudding',
      'Cocoa Pastries',
      'Sobolo Cake',
      'Plantain Tarts',
    ],
    recipeCount: 21,
    social: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      website: 'https://abenanyarko.com',
    },
  },
  {
    id: 6,
    name: 'Emmanuel Darko',
    location: 'Ho, Ghana',
    image:
      'https://images.unsplash.com/photo-1560787313-5dff3307e257?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    category: 'Volta',
    bio: 'Expert in Volta Region specialties, showcasing the rich cultural heritage through authentic recipes and cooking methods.',
    specialties: ['Akple & Fetri Detsi', 'Dzowe', 'Yakayake', 'Agbeli Kaklo'],
    recipeCount: 19,
    social: {
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
    },
  },
];

const featuredChef = {
  id: 1,
  name: 'Adjoa Mensah',
  title: 'Master Chef & Culinary Educator',
  location: 'Accra, Ghana',
  image:
    'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
  bio: (
    <>
      <p>
        Adjoa Mensah is one of Ghana's most respected culinary talents,
        combining traditional cooking methods with modern techniques to create
        exceptional dishes that honor her heritage. With over 15 years of
        experience in prestigious restaurants across West Africa and Europe, she
        brings a unique perspective to Ghanaian cuisine.
      </p>
      <p>
        After training at the Culinary Institute of Accra and Le Cordon Bleu in
        Paris, Adjoa worked in Michelin-starred restaurants before returning to
        Ghana to focus on highlighting local ingredients and traditional
        recipes. She now runs her acclaimed restaurant "Aduane Pa" in Accra and
        teaches at the Ghana Culinary Academy.
      </p>
    </>
  ),
  signatureDishes: [
    {
      name: 'Reinvented Jollof Rice',
      image:
        'https://images.unsplash.com/photo-1644478211890-83595ae1db73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1898&q=80',
      description:
        'Her award-winning version featuring smoked Ghana rice, house-made tomato base, and aromatics with crispy bottom.',
    },
    {
      name: 'Modern Kelewele',
      image:
        'https://images.unsplash.com/photo-1610680355407-76d80d835a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      description:
        'Spicy plantain cubes with a custom blend of 12 spices, served with a groundnut foam and mango chutney.',
    },
    {
      name: 'Red Red Reimagined',
      image:
        'https://images.unsplash.com/photo-1568625365131-079e026a927d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80',
      description:
        'Bean stew with palm oil, served with crispy plantain discs, micro greens, and a touch of smoked fish powder.',
    },
    {
      name: 'Sobolo Sorbet',
      image:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1814&q=80',
      description:
        'Refreshing sorbet made from hibiscus tea, spices, and seasonal fruits, garnished with crystallized ginger.',
    },
  ],
};

const workshops = [
  {
    id: 1,
    title: 'Mastering Jollof Rice',
    chef: 'Adjoa Mensah',
    chefImage:
      'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    date: 'May 15, 2025',
    image:
      'https://images.unsplash.com/photo-1644478211890-83595ae1db73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1898&q=80',
    description:
      'Learn the secrets to perfect Jollof rice in this hands-on workshop, including techniques for achieving the perfect texture and that smoky flavor.',
  },
  {
    id: 2,
    title: 'Northern Ghana Cuisine',
    chef: 'Kofi Asante',
    chefImage:
      'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    date: 'May 22, 2025',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80',
    description:
      'Discover traditional Northern Ghanaian dishes like TZ, Ayoyo soup, and Bambara beans in this immersive culinary experience.',
  },
  {
    id: 3,
    title: 'Modern Ghanaian Desserts',
    chef: 'Abena Nyarko',
    chefImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    date: 'June 5, 2025',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1814&q=80',
    description:
      'Explore innovative desserts that blend European techniques with Ghanaian ingredients for unique and delicious sweet treats.',
  },
];

// Component
const FeaturedChefsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filter chefs by category
  const filteredChefs =
    categoryFilter === 'All'
      ? chefs
      : chefs.filter((chef) => chef.category === categoryFilter);

  // Get unique categories for filter buttons
  const categories = ['All', ...new Set(chefs.map((chef) => chef.category))];

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/explore'>Explore</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Featured Chefs</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Featured Chefs</PageTitle>
      <PageDescription>
        Meet the talented culinary experts sharing their knowledge and passion
        for Ghanaian cuisine. From traditional recipes to innovative fusion
        dishes, these chefs are preserving and elevating Ghana's rich food
        heritage.
      </PageDescription>

      <FeaturedChefSection>
        <SectionTitle>Chef of the Month</SectionTitle>
        <FeaturedChef>
          <FeaturedChefImage backgroundImage={featuredChef.image} />
          <FeaturedChefInfo>
            <FeaturedBadge>
              <span>★</span> Featured Chef
            </FeaturedBadge>
            <FeaturedChefName>{featuredChef.name}</FeaturedChefName>
            <FeaturedChefTitle>{featuredChef.title}</FeaturedChefTitle>
            <ChefLocation>
              <FiMapPin /> {featuredChef.location}
            </ChefLocation>
            <FeaturedChefBio>{featuredChef.bio}</FeaturedChefBio>
            <SignatureDishes>
              <SignatureDishesTitle>Signature Dishes</SignatureDishesTitle>
              <DishesGrid>
                {featuredChef.signatureDishes.map((dish, index) => (
                  <DishItem key={index}>
                    <DishImage backgroundImage={dish.image} />
                    <DishInfo>
                      <DishName>{dish.name}</DishName>
                      <DishDescription>{dish.description}</DishDescription>
                    </DishInfo>
                  </DishItem>
                ))}
              </DishesGrid>
            </SignatureDishes>
            <Button
              $primary
              style={{ marginTop: spacing.lg }}>
              View Full Profile
            </Button>
          </FeaturedChefInfo>
        </FeaturedChef>
      </FeaturedChefSection>

      <PageSection>
        <SectionTitle>Our Culinary Experts</SectionTitle>
        <Paragraph>
          Discover chefs from different regions of Ghana, each bringing their
          unique expertise and regional specialties to our platform.
        </Paragraph>

        <CategoryFilter>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              $active={category === categoryFilter}
              onClick={() => setCategoryFilter(category)}>
              {category}
            </CategoryButton>
          ))}
        </CategoryFilter>

        <ChefsGrid>
          {filteredChefs.map((chef) => (
            <ChefCard key={chef.id}>
              <ChefImage backgroundImage={chef.image}>
                <ChefCategory>{chef.category}</ChefCategory>
              </ChefImage>
              <ChefInfo>
                <ChefName>{chef.name}</ChefName>
                <ChefLocation>
                  <FiMapPin /> {chef.location}
                </ChefLocation>
                <ChefBio>{chef.bio}</ChefBio>

                <ChefSpecialties>
                  <ChefSpecialtyTitle>Specialties</ChefSpecialtyTitle>
                  <SpecialtiesTags>
                    {chef.specialties.map((specialty, index) => (
                      <SpecialtyTag key={index}>{specialty}</SpecialtyTag>
                    ))}
                  </SpecialtiesTags>
                </ChefSpecialties>

                <ChefFooter>
                  <ChefSocial>
                    {chef.social.website && (
                      <SocialLink
                        href={chef.social.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Website'>
                        <FiGlobe />
                      </SocialLink>
                    )}
                    {chef.social.instagram && (
                      <SocialLink
                        href={chef.social.instagram}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Instagram'>
                        <FiInstagram />
                      </SocialLink>
                    )}
                    {chef.social.twitter && (
                      <SocialLink
                        href={chef.social.twitter}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Twitter'>
                        <FiTwitter />
                      </SocialLink>
                    )}
                    {chef.social.youtube && (
                      <SocialLink
                        href={chef.social.youtube}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='YouTube'>
                        <FiYoutube />
                      </SocialLink>
                    )}
                  </ChefSocial>

                  <RecipeBadge>
                    <FiStar /> {chef.recipeCount} Recipes
                  </RecipeBadge>
                </ChefFooter>

                <ViewProfileLink to={`/chef/${chef.id}`}>
                  View Full Profile <FiChevronRight />
                </ViewProfileLink>
              </ChefInfo>
            </ChefCard>
          ))}
        </ChefsGrid>
      </PageSection>

      <ChefWorkshopsSection>
        <SectionTitle>Upcoming Cooking Workshops</SectionTitle>
        <Paragraph>
          Learn directly from our featured chefs in hands-on workshops exploring
          different aspects of Ghanaian cuisine.
        </Paragraph>

        <WorkshopsGrid>
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop.id}>
              <WorkshopImage backgroundImage={workshop.image}>
                <WorkshopDate>
                  <FiCalendar /> {workshop.date}
                </WorkshopDate>
              </WorkshopImage>
              <WorkshopContent>
                <WorkshopTitle>{workshop.title}</WorkshopTitle>
                <WorkshopMeta>
                  <WorkshopChef>
                    <ChefAvatar backgroundImage={workshop.chefImage} />
                    {workshop.chef}
                  </WorkshopChef>
                </WorkshopMeta>
                <WorkshopDescription>
                  {workshop.description}
                </WorkshopDescription>
                <Button>Register Now</Button>
              </WorkshopContent>
            </WorkshopCard>
          ))}
        </WorkshopsGrid>
      </ChefWorkshopsSection>

      <JoinChefSection>
        <JoinChefTitle>Share Your Culinary Expertise</JoinChefTitle>
        <JoinChefText>
          Are you a chef specializing in Ghanaian cuisine? Join our platform to
          share your recipes, cooking techniques, and culinary wisdom with food
          enthusiasts around the world.
        </JoinChefText>
        <Button $primary>Apply to Join as a Chef</Button>
      </JoinChefSection>
    </>
  );
};

export default FeaturedChefsPage;
