import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiUsers, FiInfo, FiHeart, FiArrowRight } from 'react-icons/fi';
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
  PageSection,
  SectionTitle,
  SubSectionTitle,
  Paragraph,
  ImageContainer,
  StyledImage,
  CardGrid,
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardText,
  CardLink,
} from '../components/PageComponents';
import { kenteBackground } from '../components/KentePatterns';

// Styled components for the AboutPage
const AboutHero = styled.div`
  position: relative;
  width: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  margin-bottom: ${spacing.xxl};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  box-shadow: ${shadows.medium};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://example.com/about-hero.jpg');
    background-size: cover;
    background-position: center;
    filter: brightness(0.7);
    z-index: -1;
  }

  @media (min-width: ${breakpoints.tablet}) {
    min-height: 500px;
    padding: ${spacing.xxl};
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
`;

const HeroTitle = styled.h1`
  color: ${colors.white};
  font-size: 2.5rem;
  font-weight: ${typography.fontWeights.light};
  margin-bottom: ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  color: ${colors.antiqueWhite};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: ${spacing.lg};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 1.25rem;
  }
`;

const MissionContainer = styled.div`
  background-color: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  margin-bottom: ${spacing.xxl};
  ${kenteBackground}
`;

const MissionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.xl};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const MissionText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MissionValue = styled.div`
  margin-bottom: ${spacing.lg};
`;

const ValueTitle = styled.h3`
  color: ${colors.deepSpace};
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.medium};
  margin-bottom: ${spacing.sm};
  display: flex;
  align-items: center;

  svg {
    margin-right: ${spacing.sm};
    color: ${colors.emeraldGreen};
  }
`;

const ValueDescription = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const TeamSection = styled.div`
  margin-bottom: ${spacing.xxl};
`;

const TeamMemberCard = styled(Card)`
  text-align: center;
`;

const TeamMemberImage = styled(CardImage)`
  height: 220px;
`;

const TeamMemberName = styled(CardTitle)`
  margin-top: ${spacing.md};
`;

const TeamMemberRole = styled.p`
  color: ${colors.emeraldGreen};
  font-size: 0.9rem;
  margin-bottom: ${spacing.md};
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing.sm};
  margin-top: ${spacing.md};
`;

const SocialLink = styled.a`
  color: ${colors.deepSpace};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${colors.cosmicLatte};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.emeraldGreen};
    color: ${colors.white};
    transform: translateY(-2px);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.lg};
  margin: ${spacing.xl} 0;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatItem = styled.div`
  background-color: ${colors.white};
  padding: ${spacing.lg};
  border-radius: ${borderRadius.md};
  text-align: center;
  box-shadow: ${shadows.soft};
`;

const StatNumber = styled.div`
  color: ${colors.emeraldGreen};
  font-size: 2.5rem;
  font-weight: ${typography.fontWeights.light};
  margin-bottom: ${spacing.sm};
`;

const StatLabel = styled.div`
  color: ${colors.deepSpace};
  font-size: 0.9rem;
`;

const CTASection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${spacing.xl};
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  margin-bottom: ${spacing.xxl};
  ${kenteBackground}

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.xxl};
  }
`;

const CTATitle = styled.h2`
  color: ${colors.deepSpace};
  font-size: 1.8rem;
  font-weight: ${typography.fontWeights.light};
  margin-bottom: ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 2.2rem;
  }
`;

const CTADescription = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 800px;
  margin-bottom: ${spacing.xl};
`;

const CTAButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${spacing.md};
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: ${typography.fontWeights.light};
  letter-spacing: ${typography.letterSpacing};
  border-radius: ${borderRadius.md};
  background-color: ${(props) =>
    props.secondary ? 'transparent' : colors.emeraldGreen};
  color: ${(props) => (props.secondary ? colors.emeraldGreen : colors.white)};
  border: ${(props) =>
    props.secondary ? `1px solid ${colors.emeraldGreen}` : 'none'};
  box-shadow: ${(props) => (props.secondary ? 'none' : shadows.soft)};
  transition: all 0.2s ease;
  text-decoration: none;
  cursor: pointer;
  gap: ${spacing.sm};

  &:hover {
    background-color: ${(props) =>
      props.secondary ? colors.cosmicLatte : `${colors.emeraldGreen}ee`};
    transform: translateY(-2px);
    box-shadow: ${(props) => (props.secondary ? 'none' : shadows.medium)};
  }
`;

// Sample data
const teamMembers = [
  {
    id: 1,
    name: 'Akosua Mensah',
    role: 'Founder & Head Chef',
    image: 'https://example.com/akosua.jpg',
    bio: 'Akosua is a professional chef with over 15 years of experience in Ghanaian cuisine. She founded Aduanepafie to share authentic recipes from across Ghana.',
  },
  {
    id: 2,
    name: 'Kwame Osei',
    role: 'Food Photographer',
    image: 'https://example.com/kwame.jpg',
    bio: 'Kwame is an award-winning food photographer who captures the vibrant colors and textures of Ghanaian dishes in their full glory.',
  },
  {
    id: 3,
    name: 'Ama Darko',
    role: 'Culinary Researcher',
    image: 'https://example.com/ama.jpg',
    bio: 'Ama travels throughout Ghana documenting traditional cooking methods and uncovering rare regional recipes.',
  },
  {
    id: 4,
    name: 'Kofi Annor',
    role: 'Nutrition Specialist',
    image: 'https://example.com/kofi.jpg',
    bio: "Kofi provides nutritional analysis for all our recipes, ensuring they're both delicious and nutritionally balanced.",
  },
];

const AboutPage = () => {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>About</BreadcrumbCurrent>
      </Breadcrumbs>

      <AboutHero>
        <HeroContent>
          <HeroTitle>Preserving Ghana's Culinary Heritage</HeroTitle>
          <HeroSubtitle>
            Aduanepafie is dedicated to documenting, preserving, and sharing
            authentic Ghanaian recipes for future generations while celebrating
            the rich culinary traditions of Ghana.
          </HeroSubtitle>
        </HeroContent>
      </AboutHero>

      <PageSection>
        <SectionTitle>Our Story</SectionTitle>
        <Paragraph>
          Aduanepafie (meaning "food home" in Twi) began in 2020 as a personal
          blog by Akosua Mensah, who wanted to preserve her grandmother's
          traditional recipes. What started as a family project quickly grew
          into a comprehensive resource for authentic Ghanaian cuisine.
        </Paragraph>
        <Paragraph>
          Today, our team of culinary experts, food historians, and
          nutritionists work together to document traditional dishes from all
          regions of Ghana. We travel to remote villages, urban centers, and
          everywhere in between to learn cooking techniques directly from
          experienced home cooks and professional chefs.
        </Paragraph>
        <Paragraph>
          Our mission is to make Ghanaian cuisine accessible to everyone while
          preserving the authenticity and cultural significance of each dish. We
          believe that food is a powerful connector that brings people together
          across cultures and generations.
        </Paragraph>
      </PageSection>

      <MissionContainer>
        <SectionTitle>Our Mission & Values</SectionTitle>
        <MissionGrid>
          <MissionText>
            <MissionValue>
              <ValueTitle>
                <FiHeart />
                Authenticity
              </ValueTitle>
              <ValueDescription>
                We are committed to presenting recipes that are true to their
                traditional roots, documenting cooking methods that have been
                passed down through generations.
              </ValueDescription>
            </MissionValue>

            <MissionValue>
              <ValueTitle>
                <FiInfo />
                Education
              </ValueTitle>
              <ValueDescription>
                We aim to educate people about the cultural context, history,
                and significance of Ghanaian dishes, going beyond just
                ingredients and methods.
              </ValueDescription>
            </MissionValue>

            <MissionValue>
              <ValueTitle>
                <FiUsers />
                Community
              </ValueTitle>
              <ValueDescription>
                We foster a community of food lovers who share our passion for
                Ghanaian cuisine, creating spaces for connection and cultural
                exchange.
              </ValueDescription>
            </MissionValue>
          </MissionText>

          <ImageContainer>
            <StyledImage
              src='https://example.com/mission-image.jpg'
              alt='A traditional Ghanaian cooking scene'
            />
          </ImageContainer>
        </MissionGrid>
      </MissionContainer>

      <TeamSection>
        <SectionTitle>Meet Our Team</SectionTitle>
        <Paragraph>
          The passionate individuals behind Aduanepafie bring diverse expertise
          in Ghanaian cuisine, food photography, cultural research, and digital
          technology to create a comprehensive resource for authentic recipes.
        </Paragraph>

        <CardGrid>
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id}>
              <TeamMemberImage backgroundImage={member.image} />
              <CardContent>
                <TeamMemberName>{member.name}</TeamMemberName>
                <TeamMemberRole>{member.role}</TeamMemberRole>
                <CardText>{member.bio}</CardText>
                <SocialLinks>
                  <SocialLink
                    href='#'
                    aria-label='Twitter'>
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='currentColor'>
                      <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' />
                    </svg>
                  </SocialLink>
                  <SocialLink
                    href='#'
                    aria-label='Instagram'>
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='currentColor'>
                      <rect
                        x='2'
                        y='2'
                        width='20'
                        height='20'
                        rx='5'
                        ry='5'
                      />
                      <path d='M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z' />
                      <line
                        x1='17.5'
                        y1='6.5'
                        x2='17.51'
                        y2='6.5'
                      />
                    </svg>
                  </SocialLink>
                  <SocialLink
                    href='#'
                    aria-label='LinkedIn'>
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='currentColor'>
                      <path d='M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z' />
                      <rect
                        x='2'
                        y='9'
                        width='4'
                        height='12'
                      />
                      <circle
                        cx='4'
                        cy='4'
                        r='2'
                      />
                    </svg>
                  </SocialLink>
                </SocialLinks>
              </CardContent>
            </TeamMemberCard>
          ))}
        </CardGrid>
      </TeamSection>

      <PageSection>
        <SectionTitle>Our Impact</SectionTitle>
        <Paragraph>
          Since our founding, we've been dedicated to preserving Ghana's
          culinary heritage while creating a global community of Ghanaian food
          enthusiasts.
        </Paragraph>

        <StatsContainer>
          <StatItem>
            <StatNumber>200+</StatNumber>
            <StatLabel>Authentic Recipes</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>16</StatNumber>
            <StatLabel>Regions Covered</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>50k+</StatNumber>
            <StatLabel>Monthly Visitors</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>30+</StatNumber>
            <StatLabel>Contributing Chefs</StatLabel>
          </StatItem>
        </StatsContainer>
      </PageSection>

      <CTASection>
        <CTATitle>Join Our Culinary Journey</CTATitle>
        <CTADescription>
          Whether you're a food enthusiast, a professional chef, or simply
          curious about Ghanaian cuisine, we invite you to join our community
          and be part of preserving Ghana's rich culinary heritage.
        </CTADescription>

        <CTAButtons>
          <CTAButton to='/contact'>
            <FiMail size={18} />
            Contact Us
          </CTAButton>
          <CTAButton
            to='/our-story'
            secondary='true'>
            Learn More
            <FiArrowRight size={18} />
          </CTAButton>
        </CTAButtons>
      </CTASection>
    </>
  );
};

export default AboutPage;
