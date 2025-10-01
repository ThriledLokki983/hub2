import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  FlexBox,
  Text,
  Heading,
  SubHeading,
  Card,
  Badge,
  CosmicAccent,
  Icon
} from '../../components/ui/CommonElements';
import { colors, spacing, breakpoints, borderRadius, shadows } from '../../theme/theme';

const PageContainer = styled.div`
  position: relative;
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  padding: ${spacing.xxl} ${spacing.lg};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/images/cosmic-bg.webp');
    background-size: cover;
    background-position: center;
    opacity: 0.15;
    z-index: -1;
  }
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const HeroContent = styled.div`
  max-width: 600px;
  animation: fadeIn 1s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: ${breakpoints.tablet}) {
    text-align: center;
    margin: 0 auto;
  }
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: ${p => p.theme.typography?.fontWeights.thin};
  letter-spacing: -0.05em;
  color: ${colors.white};
  line-height: 1.1;
  margin-bottom: ${spacing.lg};

  span {
    color: ${colors.primaryOrange};
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 100%;
      height: 4px;
      background: ${colors.primaryOrange};
      border-radius: ${borderRadius.round};
      opacity: 0.3;
    }
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 3rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: ${spacing.xl};
  max-width: 500px;
  line-height: 1.6;

  @media (max-width: ${breakpoints.tablet}) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const HeroButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.md};

  @media (max-width: ${breakpoints.tablet}) {
    justify-content: center;
  }

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const CategorySection = styled.section`
  padding: ${spacing.xxl} ${spacing.lg};
  position: relative;

  @media (max-width: ${breakpoints.mobile}) {
    padding: ${spacing.xl} ${spacing.md};
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryHeading = styled(SubHeading)`
  margin-bottom: ${spacing.xl};
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: ${colors.primaryOrange};
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${spacing.lg};
  margin-top: ${spacing.lg};
`;

const CategoryCard = styled(Link)`
  position: relative;
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: ${colors.white};
  box-shadow: ${shadows.medium};
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(10, 10, 10, 0.4);
    z-index: 1;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.cosmic};

    &::before {
      background: rgba(10, 10, 10, 0.2);
    }

    h3 {
      transform: scale(1.05);
    }
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const CategoryName = styled.h3`
  position: relative;
  z-index: 2;
  font-weight: 300;
  font-size: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const FeaturedSection = styled.section`
  padding: ${spacing.xxl} ${spacing.lg};
  position: relative;
  background: ${colors.cosmicGradient};

  @media (max-width: ${breakpoints.mobile}) {
    padding: ${spacing.xl} ${spacing.md};
  }
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${spacing.xl};
  margin-top: ${spacing.xl};
`;

const RecipeCard = styled(Card)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  background: rgba(46, 46, 46, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${shadows.cosmic};
  }
`;

const RecipeImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const RecipeContent = styled.div`
  padding: ${spacing.lg};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RecipeTitle = styled(Link)`
  font-size: 1.3rem;
  font-weight: 300;
  margin-bottom: ${spacing.sm};
  color: ${colors.white};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.primaryOrange};
  }
`;

const RecipeMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${spacing.md};
  padding-top: ${spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
`;

const RecipeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const JoinSection = styled.section`
  padding: ${spacing.xxl} ${spacing.lg};
  text-align: center;
  position: relative;

  @media (max-width: ${breakpoints.mobile}) {
    padding: ${spacing.xl} ${spacing.md};
  }
`;

const JoinContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const JoinHeading = styled(Heading)`
  margin-bottom: ${spacing.md};
`;

// Footer Styles
const FooterSection = styled.footer`
  background-color: #121212;
  padding: ${spacing.xxl} ${spacing.lg} ${spacing.xl};
  color: #fff;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.xxl};
  margin-top: ${spacing.xxl};

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div``;

const ColumnTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: ${spacing.lg};
  color: #fff;

  &::before {
    content: '• ';
    color: ${colors.primaryOrange};
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: ${spacing.md};

  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;

    &:hover {
      color: ${colors.primaryOrange};
    }

    &::before {
      content: '• ';
      color: ${colors.primaryOrange};
      margin-right: ${spacing.sm};
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover::before {
      opacity: 1;
    }
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${spacing.xxl};
  padding-top: ${spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    gap: ${spacing.md};
  }
`;

const Copyright = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
`;

const PolicyLinks = styled.div`
  display: flex;
  gap: ${spacing.lg};

  a {
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      color: ${colors.primaryOrange};
    }
  }
`;

// Mock data
const categories = [
  { id: 1, name: "Breakfast", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=400" },
  { id: 2, name: "Lunch", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=400" },
  { id: 3, name: "Dinner", image: "https://images.immediate.co.uk/production/volatile/sites/30/2017/08/crispy-sesame-lemon-chicken-8830c24.jpg?quality=90&resize=556,505" },
  { id: 4, name: "Desserts", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=400" },
  { id: 5, name: "Vegetarian", image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-1.2.1&auto=format&fit=crop&w=400" },
];

const featuredRecipes = [
  {
    id: 1,
    title: "Nebula Pasta with Star Dust Sauce",
    image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=400",
    cookTime: "30 min",
    difficulty: "Medium",
    category: "Dinner",
    description: "A cosmic twist on classic pasta, infused with vibrant colors and exotic flavors from across the universe."
  },
  {
    id: 2,
    title: "Supernova Smoothie Bowl",
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-1.2.1&auto=format&fit=crop&w=400",
    cookTime: "15 min",
    difficulty: "Easy",
    category: "Breakfast",
    description: "Start your day with an explosion of nutrients and cosmic colors that will energize your morning."
  },
  {
    id: 3,
    title: "Planetary Pizza Spheres",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=400",
    cookTime: "45 min",
    difficulty: "Hard",
    category: "Dinner",
    description: "These orbital delights combine the best pizza ingredients in perfect spherical harmony."
  },
  {
    id: 4,
    title: "Cosmic Chocolate Eclipse Cake",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400",
    cookTime: "90 min",
    difficulty: "Hard",
    category: "Dessert",
    description: "A decadent chocolate cake with layers resembling the phases of a lunar eclipse."
  },
];

const HomePage: React.FC = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <HeroTitle>
              Authentic <span>Ghana's</span> Culinary Heritage
            </HeroTitle>
            <HeroSubtitle>
            {/* Celebrating Ghana's culinary heritage with authentic recipes. "Aduane" (food) + "fie" (home) - Your home of delicious Ghanaian cuisine. */}
            Discover the authentic Ghana's culinary heritage with authentic recipes. "Aduane" (food) + "fie" (home) - Your home of delicious Ghanaian cuisine.
            </HeroSubtitle>
            <HeroButtonGroup>
              <Button size="large" as={Link} to="/recipes" style={{ textDecoration: 'none' }}>
                Explore Recipes
              </Button>
              <Button variant="outline" size="large" as={Link} to="/signup" style={{ textDecoration: 'none' }}>
                Join Cosmeat
              </Button>
            </HeroButtonGroup>
          </HeroContent>
        </HeroContainer>

        <CosmicAccent style={{ top: '10%', right: '10%', width: '400px', height: '400px' }} />
        <CosmicAccent style={{ bottom: '10%', left: '5%', width: '300px', height: '300px' }} />
      </HeroSection>

      {/* Categories Section */}
      <CategorySection>
        <SectionContainer>
          <CategoryHeading>Explore Categories</CategoryHeading>
          <Text style={{ maxWidth: '600px', opacity: 0.8, marginBottom: spacing.xl }}>
            Discover recipes organized by cosmic categories, each offering a unique culinary journey through the flavors of the universe
          </Text>

          <CategoryGrid>
            {categories.map(category => (
              <CategoryCard key={category.id} to={`/categories/${category.name.toLowerCase()}`}>
                <CategoryImage src={category.image} alt={category.name} />
                <CategoryName>{category.name}</CategoryName>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </SectionContainer>
      </CategorySection>

      {/* Featured Recipes Section */}
      <FeaturedSection>
        <SectionContainer>
          <FlexBox justify="space-between" align="center">
            <div>
              <CategoryHeading>Featured Cosmic Recipes</CategoryHeading>
              <Text style={{ maxWidth: '600px', opacity: 0.8 }}>
                Our most stellar recipes, handpicked from the cosmos
              </Text>
            </div>

            <Button variant="outline" as={Link} to="/recipes" style={{ textDecoration: 'none' }}>
              View All
            </Button>
          </FlexBox>

          <RecipeGrid>
            {featuredRecipes.map(recipe => (
              <RecipeCard key={recipe.id}>
                <RecipeImage $image={recipe.image}>
                  <Badge
                    style={{
                      position: 'absolute',
                      top: spacing.sm,
                      left: spacing.sm
                    }}
                  >
                    {recipe.category}
                  </Badge>
                </RecipeImage>
                <RecipeContent>
                  <RecipeTitle to={`/recipes/${recipe.id}`}>{recipe.title}</RecipeTitle>
                  <Text style={{ fontSize: '0.9rem', opacity: 0.8, flex: 1 }}>
                    {recipe.description}
                  </Text>
                  <RecipeMeta>
                    <RecipeInfo>⏱ {recipe.cookTime}</RecipeInfo>
                    <RecipeInfo>🔥 {recipe.difficulty}</RecipeInfo>
                  </RecipeMeta>
                </RecipeContent>
              </RecipeCard>
            ))}
          </RecipeGrid>
        </SectionContainer>
      </FeaturedSection>

      {/* Join Community Section */}
      <JoinSection>
        <JoinContainer>
          <JoinHeading>Join the Cosmic Culinary Community</JoinHeading>
          <Text style={{ marginBottom: spacing.xl, maxWidth: '500px', margin: '0 auto' }}>
            Create an account to save your favorite recipes, share your own cosmic creations, and connect with fellow space foodies
          </Text>
          <Button
            size="large"
            as={Link}
            to="/signup"
            style={{ textDecoration: 'none', minWidth: '200px' }}
          >
            Create Account
          </Button>
        </JoinContainer>

        <CosmicAccent style={{ top: '50%', left: '50%', width: '800px', height: '800px', transform: 'translate(-50%, -50%)', opacity: 0.3 }} />
      </JoinSection>

      {/* Footer Section */}
      <FooterSection>
        <FooterContainer>
          <FooterContent>
            <FooterColumn>
              <ColumnTitle>Explore</ColumnTitle>
              <FooterLinks>
                <FooterLink><Link to="/recipes">Recipes</Link></FooterLink>
                <FooterLink><Link to="/categories/regional-cuisines">Regional Cuisines</Link></FooterLink>
                <FooterLink><Link to="/categories/seasonal-dishes">Seasonal Dishes</Link></FooterLink>
                <FooterLink><Link to="/categories/special-occasions">Special Occasions</Link></FooterLink>
                <FooterLink><Link to="/chefs">Featured Chefs</Link></FooterLink>
              </FooterLinks>
            </FooterColumn>

            <FooterColumn>
              <ColumnTitle>About Us</ColumnTitle>
              <FooterLinks>
                <FooterLink><Link to="/about/story">Our Story</Link></FooterLink>
                <FooterLink><Link to="/about/team">Our Team</Link></FooterLink>
                <FooterLink><Link to="/testimonials">Testimonials</Link></FooterLink>
                <FooterLink><Link to="/careers">Careers</Link></FooterLink>
                <FooterLink><Link to="/contact">Contact Us</Link></FooterLink>
              </FooterLinks>
            </FooterColumn>

            <FooterColumn>
              <ColumnTitle>Resources</ColumnTitle>
              <FooterLinks>
                <FooterLink><Link to="/resources/cooking-tips">Cooking Tips</Link></FooterLink>
                <FooterLink><Link to="/resources/ingredient-guide">Ingredient Guide</Link></FooterLink>
                <FooterLink><Link to="/resources/kitchen-tools">Kitchen Tools</Link></FooterLink>
                <FooterLink><Link to="/blog">Blog</Link></FooterLink>
                <FooterLink><Link to="/faq">FAQ</Link></FooterLink>
              </FooterLinks>
            </FooterColumn>
          </FooterContent>

          <FooterBottom>
            <Copyright>© 2025 Aduanepafie. All rights reserved.</Copyright>
            <PolicyLinks>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
              <Link to="/cookie-policy">Cookie Policy</Link>
            </PolicyLinks>
          </FooterBottom>
        </FooterContainer>
      </FooterSection>
    </PageContainer>
  );
};

export default HomePage;
