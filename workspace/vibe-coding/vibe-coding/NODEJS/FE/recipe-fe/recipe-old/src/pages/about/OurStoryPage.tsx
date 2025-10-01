import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiCalendar, FiImage, FiBookOpen, FiArrowRight } from 'react-icons/fi';
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
  PageSection,
  SectionTitle,
  Paragraph,
  ImageContainer,
  StyledImage,
  FlexRow,
  FlexColumn,
} from '../../components/PageComponents';
import { kenteBackground } from '../../components/KentePatterns';

// Styled Components
const StoryHero = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${spacing.xl};
  box-shadow: ${shadows.medium};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://example.com/our-story-hero.jpg');
    background-size: cover;
    background-position: center;
    filter: brightness(0.7);
    z-index: -1;
  }

  @media (min-width: ${breakpoints.tablet}) {
    height: 500px;
    padding: ${spacing.xxl};
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  z-index: 1;
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

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 1.25rem;
  }
`;

const TimelineContainer = styled.div`
  position: relative;
  padding-left: ${spacing.xxl};
  margin: ${spacing.xxl} 0;

  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: ${colors.cosmicLatte};
    z-index: 1;
  }
`;

const TimelineItem = styled.div`
  position: relative;
  margin-bottom: ${spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: -${spacing.xxl};
    top: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${colors.emeraldGreen};
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TimelineDate = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.darkPastelRed};
  margin-bottom: ${spacing.sm};

  svg {
    margin-right: ${spacing.xs};
  }
`;

const TimelineTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const TimelineContent = styled.div`
  margin-bottom: ${spacing.lg};
`;

const QuoteContainer = styled.div`
  position: relative;
  padding: ${spacing.xl};
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  margin: ${spacing.xxl} 0;
  ${kenteBackground}

  &::before {
    content: '"';
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 5rem;
    color: ${colors.darkPastelRed}20;
    font-family: Georgia, serif;
    line-height: 1;
  }
`;

const Quote = styled.blockquote`
  font-size: 1.25rem;
  line-height: 1.8;
  color: ${colors.deepSpace};
  font-style: italic;
  margin-bottom: ${spacing.lg};
  position: relative;
  z-index: 1;
  padding-left: ${spacing.lg};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 1.5rem;
  }
`;

const QuoteAuthor = styled.div`
  font-size: 1rem;
  color: ${colors.galaxyGrey};
  font-weight: ${typography.fontWeights.medium};
  text-align: right;

  strong {
    color: ${colors.emeraldGreen};
    display: block;
    font-weight: ${typography.fontWeights.medium};
  }
`;

const StoryGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.md};
  margin: ${spacing.xl} 0;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
    gap: ${spacing.lg};
  }
`;

const GalleryImage = styled.div<{ $backgroundImage: string }>`
  aspect-ratio: 1;
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.soft};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }

  &:nth-child(3),
  &:nth-child(6) {
    grid-column: span 2;

    @media (min-width: ${breakpoints.tablet}) {
      grid-column: span 2;
    }
  }
`;

const MissionStatement = styled.div`
  padding: ${spacing.xl};
  background-color: ${colors.deepSpace};
  border-radius: ${borderRadius.lg};
  color: ${colors.white};
  margin-bottom: ${spacing.xxl};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 150px;
    background-color: ${colors.darkPastelRed}30;
    border-radius: 50%;
    transform: translate(50%, -50%);
    z-index: 0;
  }
`;

const MissionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: ${typography.fontWeights.light};
  margin-bottom: ${spacing.lg};
  position: relative;
  z-index: 1;
`;

const MissionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: ${spacing.lg};
  max-width: 800px;
  position: relative;
  z-index: 1;
`;

const MoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.maximumYellow};
  text-decoration: none;
  font-size: 1rem;
  position: relative;
  z-index: 1;

  &:hover {
    text-decoration: underline;

    svg {
      transform: translateX(3px);
    }
  }

  svg {
    transition: transform 0.2s ease;
  }
`;

// Component
const OurStoryPage = () => {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/about'>About</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Our Story</BreadcrumbCurrent>
      </Breadcrumbs>

      <StoryHero>
        <HeroContent>
          <HeroTitle>From Grandmother's Kitchen to Digital Archive</HeroTitle>
          <HeroSubtitle>
            The journey of Aduanepafie from a personal collection of family
            recipes to Ghana's premier culinary resource.
          </HeroSubtitle>
        </HeroContent>
      </StoryHero>

      <PageSection>
        <SectionTitle>The Genesis</SectionTitle>
        <FlexRow>
          <FlexColumn flex={3}>
            <Paragraph>
              Aduanepafie began as a personal project by our founder, Akosua
              Mensah. After her grandmother passed away in 2019, Akosua realized
              that many of the traditional recipes that had been passed down
              through generations might be lost if they weren't properly
              documented.
            </Paragraph>
            <Paragraph>
              "My grandmother never wrote down a single recipe," Akosua recalls.
              "She cooked by intuition, adjusting ingredients based on
              availability, season, and who she was cooking for. I grew up
              watching her in the kitchen, but I realized that many of the
              nuances of her cooking might be lost without proper
              documentation."
            </Paragraph>
            <Paragraph>
              With this realization, Akosua began a journey to preserve not just
              her grandmother's recipes, but also the stories, techniques, and
              cultural significance behind each dish. What started as a personal
              blog quickly grew as friends, family members, and eventually
              strangers began contributing their own family recipes and culinary
              knowledge.
            </Paragraph>
          </FlexColumn>
          <FlexColumn flex={2}>
            <ImageContainer>
              <StyledImage
                src='https://example.com/founder-and-grandmother.jpg'
                alt='Akosua and her grandmother cooking together'
              />
            </ImageContainer>
          </FlexColumn>
        </FlexRow>
      </PageSection>

      <TimelineContainer>
        <TimelineItem>
          <TimelineDate>
            <FiCalendar />
            November 2019
          </TimelineDate>
          <TimelineTitle>The First Collection</TimelineTitle>
          <TimelineContent>
            <Paragraph>
              Akosua begins documenting her grandmother's recipes, creating
              detailed instructions, ingredient lists, and noting regional
              variations. The initial collection includes 15 recipes, focusing
              primarily on Ashanti Region dishes.
            </Paragraph>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineDate>
            <FiCalendar />
            March 2020
          </TimelineDate>
          <TimelineTitle>The Blog Launch</TimelineTitle>
          <TimelineContent>
            <Paragraph>
              The first version of Aduanepafie launches as a simple blog,
              allowing Akosua to share her grandmother's recipes with friends
              and family. The site quickly gains attention beyond her immediate
              circle.
            </Paragraph>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineDate>
            <FiCalendar />
            September 2020
          </TimelineDate>
          <TimelineTitle>Expanding the Team</TimelineTitle>
          <TimelineContent>
            <Paragraph>
              Kwame Osei, a food photographer, and Ama Darko, a culinary
              researcher, join the project. The trio begins traveling throughout
              Ghana to document regional recipes and cooking techniques.
            </Paragraph>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineDate>
            <FiCalendar />
            February 2021
          </TimelineDate>
          <TimelineTitle>Website Relaunch</TimelineTitle>
          <TimelineContent>
            <Paragraph>
              Aduanepafie relaunches as a comprehensive recipe archive with
              improved functionality, professional photography, and detailed
              cultural context for each dish. The collection now includes over
              100 recipes from various regions of Ghana.
            </Paragraph>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineDate>
            <FiCalendar />
            Present
          </TimelineDate>
          <TimelineTitle>Growing Community</TimelineTitle>
          <TimelineContent>
            <Paragraph>
              Today, Aduanepafie continues to grow with contributions from home
              cooks, professional chefs, and food historians across Ghana and
              the diaspora. The site now features over 200 authentic recipes,
              educational resources, and a vibrant community of Ghanaian food
              enthusiasts.
            </Paragraph>
          </TimelineContent>
        </TimelineItem>
      </TimelineContainer>

      <QuoteContainer>
        <Quote>
          Food is more than sustenance—it's our history, our culture, our
          community. Every recipe tells a story of the people who created it,
          the environment that shaped it, and the traditions that preserved it.
          This is what we're fighting to document and protect.
        </Quote>
        <QuoteAuthor>
          <strong>Akosua Mensah</strong>
          Founder, Aduanepafie
        </QuoteAuthor>
      </QuoteContainer>

      <PageSection>
        <SectionTitle>Documenting Ghana's Culinary Heritage</SectionTitle>
        <Paragraph>
          Our research team travels throughout Ghana to learn directly from
          experienced home cooks, village elders, and local food experts. We
          document not just ingredient lists and cooking methods, but also the
          cultural context, regional variations, and historical significance of
          each dish.
        </Paragraph>
        <Paragraph>
          "Many traditional recipes are at risk of being lost as younger
          generations move to cities and adopt more international eating
          habits," explains Ama Darko, our culinary researcher. "We're racing
          against time to preserve these cooking techniques and recipes that
          have been passed down through generations."
        </Paragraph>
      </PageSection>

      <SectionTitle>
        <FiImage style={{ marginRight: spacing.sm }} />
        Gallery: Our Journey
      </SectionTitle>

      <StoryGallery>
        <GalleryImage $backgroundImage='https://example.com/gallery1.jpg' />
        <GalleryImage $backgroundImage='https://example.com/gallery2.jpg' />
        <GalleryImage $backgroundImage='https://example.com/gallery3.jpg' />
        <GalleryImage $backgroundImage='https://example.com/gallery4.jpg' />
        <GalleryImage $backgroundImage='https://example.com/gallery5.jpg' />
        <GalleryImage $backgroundImage='https://example.com/gallery6.jpg' />
      </StoryGallery>

      <MissionStatement>
        <MissionTitle>Our Mission</MissionTitle>
        <MissionText>
          We believe that preserving culinary traditions is essential to
          maintaining cultural identity. Our mission is to document, celebrate,
          and share Ghana's rich food heritage, making it accessible to future
          generations while adapting to the modern world.
        </MissionText>
        <MoreLink to='/about'>
          Learn more about our values
          <FiArrowRight size={16} />
        </MoreLink>
      </MissionStatement>

      <PageSection>
        <SectionTitle>
          <FiBookOpen style={{ marginRight: spacing.sm }} />
          Looking Ahead
        </SectionTitle>
        <Paragraph>
          As we continue to grow, our vision is to create the most comprehensive
          archive of Ghanaian cuisine available anywhere, serving as both a
          practical cooking resource and a cultural preservation project. We're
          developing new features including cooking classes, community recipe
          submissions, and educational programs for schools.
        </Paragraph>
        <Paragraph>
          We invite you to join us on this journey by exploring our recipes,
          sharing your own family traditions, and supporting our mission to
          preserve Ghana's culinary heritage for generations to come.
        </Paragraph>
      </PageSection>
    </>
  );
};

export default OurStoryPage;
