import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FiStar,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMapPin,
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
const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${spacing.xl};
  margin: ${spacing.xl} 0;
`;

const TestimonialCard = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  padding: ${spacing.lg};
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.medium};
  }
`;

const TestimonialQuote = styled.blockquote`
  font-size: 1rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.lg};
  flex-grow: 1;
  font-style: italic;
  position: relative;

  &:before {
    content: '"';
    font-size: 3rem;
    color: ${colors.cosmicLatte};
    position: absolute;
    top: -1rem;
    left: -0.5rem;
    font-family: serif;
    z-index: 0;
  }

  p {
    position: relative;
    z-index: 1;
  }
`;

const TestimonialFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const TestimonialUser = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
`;

const UserAvatar = styled.div<{ backgroundImage?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${borderRadius.circle};
  background-color: ${colors.cosmicLatte};
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.emeraldGreen};
  font-size: 1.2rem;
`;

const UserInfo = styled.div``;

const UserName = styled.div`
  font-size: 1rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.xs};
`;

const UserLocation = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 0.85rem;
  color: ${colors.galaxyGrey};
  margin-top: ${spacing.xs};

  svg {
    margin-right: ${spacing.xs};
    font-size: 0.8rem;
  }
`;

const TestimonialDate = styled.div`
  font-size: 0.85rem;
  color: ${colors.galaxyGrey};
`;

const TestimonialTag = styled.div`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  background-color: ${colors.cosmicLatte};
  color: ${colors.emeraldGreen};
  font-size: 0.8rem;
  border-radius: ${borderRadius.full};
  margin-right: ${spacing.xs};
  margin-bottom: ${spacing.xs};
`;

const TestimonialTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${spacing.sm};
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin-bottom: ${spacing.xl};
`;

const FilterWrapper = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  padding: ${spacing.sm} ${spacing.lg};
  background-color: ${colors.white};
  border: 1px solid ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  color: ${colors.deepSpace};
  cursor: pointer;
  transition: all 0.2s ease;
  gap: ${spacing.sm};
  font-size: 0.95rem;

  &:hover {
    background-color: ${colors.cosmicLatte};
  }
`;

const FilterDropdown = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  min-width: 180px;
  background-color: ${colors.white};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.medium};
  padding: ${spacing.md};
  margin-top: ${spacing.xs};
`;

const FilterOption = styled.div<{ $active?: boolean }>`
  padding: ${spacing.xs} ${spacing.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: ${borderRadius.md};
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.$active ? colors.cosmicLatte : 'transparent'};
  color: ${(props) => (props.$active ? colors.emeraldGreen : colors.deepSpace)};

  &:hover {
    background-color: ${colors.cosmicLatte};
    color: ${colors.emeraldGreen};
  }
`;

const RatingFilter = styled.div`
  display: flex;
  gap: ${spacing.xs};
  margin-top: ${spacing.sm};
  flex-wrap: wrap;
`;

const RatingButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${spacing.xs} ${spacing.sm};
  background-color: ${(props) =>
    props.$active ? colors.emeraldGreen : colors.white};
  color: ${(props) => (props.$active ? colors.white : colors.deepSpace)};
  border: 1px solid
    ${(props) => (props.$active ? colors.emeraldGreen : colors.cosmicLatte)};
  border-radius: ${borderRadius.full};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;

  &:hover {
    background-color: ${(props) =>
      props.$active ? colors.emeraldGreen : colors.cosmicLatte};
  }

  svg {
    color: ${(props) => (props.$active ? colors.white : colors.maximumYellow)};
    margin-right: ${spacing.xs};
  }
`;

const RatingStars = styled.div`
  display: flex;
  margin-bottom: ${spacing.sm};
`;

const Star = styled.span<{ $active?: boolean }>`
  color: ${(props) =>
    props.$active ? colors.maximumYellow : colors.cosmicLatte};
  margin-right: 2px;
`;

const SubmitTestimonialSection = styled.div`
  margin: ${spacing.xxl} 0;
  padding: ${spacing.xl};
  background-color: ${colors.cosmicLatte}50;
  border-radius: ${borderRadius.lg};
  text-align: center;
`;

const SubmitTestimonialText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${colors.galaxyGrey};
  max-width: 700px;
  margin: 0 auto ${spacing.lg};
`;

// Mock data
const testimonials = [
  {
    id: 1,
    quote:
      "I've been searching for authentic Ghana recipes for years, and this platform is a treasure trove! The detailed instructions and cultural context make cooking these dishes so much more meaningful.",
    user: {
      name: 'Sarah Johnson',
      location: 'London, UK',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    },
    date: 'April 10, 2025',
    rating: 5,
    tags: ['Home Cook', 'International'],
  },
  {
    id: 2,
    quote:
      "As a Ghanaian living abroad, I've struggled to recreate the dishes from my childhood. The recipes here are spot-on authentic, and the ingredient substitution suggestions are incredibly helpful.",
    user: {
      name: 'Kwesi Owusu',
      location: 'Toronto, Canada',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    },
    date: 'March 28, 2025',
    rating: 5,
    tags: ['Diaspora', 'Traditional'],
  },
  {
    id: 3,
    quote:
      "The background information and history behind each dish makes this more than just a recipe site. I've learned so much about Ghanaian culture through the food!",
    user: {
      name: 'Maria Rodriguez',
      location: 'Barcelona, Spain',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    },
    date: 'March 15, 2025',
    rating: 4,
    tags: ['Food Enthusiast', 'International'],
  },
  {
    id: 4,
    quote:
      "I'm a professional chef researching West African cuisine, and this site has been an invaluable resource. The depth of information and regional variations of dishes is impressive.",
    user: {
      name: 'Jean-Pierre Dupont',
      location: 'Paris, France',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    },
    date: 'March 5, 2025',
    rating: 5,
    tags: ['Chef', 'Professional'],
  },
  {
    id: 5,
    quote:
      "The video tutorials alongside the recipes make it so much easier to learn the techniques. I've never been to Ghana but I feel like I'm learning from a local!",
    user: {
      name: 'John Smith',
      location: 'Sydney, Australia',
      avatar:
        'https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    },
    date: 'February 22, 2025',
    rating: 4,
    tags: ['Home Cook', 'Beginner'],
  },
  {
    id: 6,
    quote:
      'As someone with dietary restrictions, I appreciate the flexible recipe options. I can still enjoy the essence of Ghanaian cuisine while adapting it to my needs.',
    user: {
      name: 'Amina Khalid',
      location: 'Dubai, UAE',
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80',
    },
    date: 'February 15, 2025',
    rating: 5,
    tags: ['Food Enthusiast', 'Dietary Modifications'],
  },
  {
    id: 7,
    quote:
      'I host an international cooking club and we recently featured Ghana. Everyone was amazed by the flavors we created using recipes from this site. The jollof rice was a massive hit!',
    user: {
      name: 'Priya Sharma',
      location: 'Mumbai, India',
      avatar:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    },
    date: 'February 8, 2025',
    rating: 5,
    tags: ['Food Enthusiast', 'Group Cooking'],
  },
  {
    id: 8,
    quote:
      'The ingredient guide helped me navigate my local African market with confidence. Now I know exactly what to look for and how to use traditional Ghanaian ingredients.',
    user: {
      name: 'Michael Chen',
      location: 'San Francisco, USA',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    },
    date: 'January 30, 2025',
    rating: 4,
    tags: ['Home Cook', 'Beginner'],
  },
  {
    id: 9,
    quote:
      "The recipes have just the right amount of detail – enough to guide you but not overwhelming. I've impressed my Ghanaian friends with dishes that taste just like their mothers' cooking.",
    user: {
      name: 'Emily Taylor',
      location: 'Auckland, New Zealand',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
    date: 'January 18, 2025',
    rating: 5,
    tags: ['Home Cook', 'International'],
  },
];

// Get unique values for filters
const userTypes = [
  'All',
  ...new Set(
    testimonials.flatMap((testimonial) =>
      testimonial.tags.filter((tag) =>
        [
          'Home Cook',
          'Chef',
          'Food Enthusiast',
          'Diaspora',
          'Professional',
          'Beginner',
        ].includes(tag)
      )
    )
  ),
];

const regions = [
  'All',
  ...new Set(
    testimonials.map((testimonial) => {
      const location = testimonial.user.location.split(', ')[1];
      return location;
    })
  ),
];

const TestimonialsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  // Filter testimonials based on selected filters
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const categoryMatch =
      categoryFilter === 'All' || testimonial.tags.includes(categoryFilter);

    const regionMatch =
      regionFilter === 'All' ||
      testimonial.user.location.includes(regionFilter);

    const ratingMatch =
      ratingFilter === 0 || testimonial.rating >= ratingFilter;

    return categoryMatch && regionMatch && ratingMatch;
  });

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/about'>About</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Testimonials</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Testimonials</PageTitle>
      <PageDescription>
        Read what our community has to say about their experiences with our
        platform. From home cooks to professional chefs, people around the world
        are discovering and sharing Ghanaian cuisine with our help.
      </PageDescription>

      <PageSection>
        <SectionTitle>What Our Users Say</SectionTitle>

        <FilterContainer>
          <FilterWrapper>
            <FilterButton
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsRegionOpen(false);
              }}>
              <FiFilter /> User Type
              {isCategoryOpen ? <FiChevronUp /> : <FiChevronDown />}
            </FilterButton>
            <FilterDropdown $isOpen={isCategoryOpen}>
              {userTypes.map((type) => (
                <FilterOption
                  key={type}
                  $active={categoryFilter === type}
                  onClick={() => {
                    setCategoryFilter(type);
                    setIsCategoryOpen(false);
                  }}>
                  {type}
                </FilterOption>
              ))}
            </FilterDropdown>
          </FilterWrapper>

          <FilterWrapper>
            <FilterButton
              onClick={() => {
                setIsRegionOpen(!isRegionOpen);
                setIsCategoryOpen(false);
              }}>
              <FiMapPin /> Region
              {isRegionOpen ? <FiChevronUp /> : <FiChevronDown />}
            </FilterButton>
            <FilterDropdown $isOpen={isRegionOpen}>
              {regions.map((region) => (
                <FilterOption
                  key={region}
                  $active={regionFilter === region}
                  onClick={() => {
                    setRegionFilter(region);
                    setIsRegionOpen(false);
                  }}>
                  {region}
                </FilterOption>
              ))}
            </FilterDropdown>
          </FilterWrapper>

          <RatingFilter>
            {[0, 3, 4, 5].map((rating) => (
              <RatingButton
                key={rating}
                $active={ratingFilter === rating}
                onClick={() => setRatingFilter(rating)}>
                {rating === 0 ? (
                  'All Ratings'
                ) : (
                  <>
                    <FiStar /> {rating}+
                  </>
                )}
              </RatingButton>
            ))}
          </RatingFilter>
        </FilterContainer>

        <TestimonialsGrid>
          {filteredTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id}>
              <RatingStars>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    $active={testimonial.rating >= star}>
                    ★
                  </Star>
                ))}
              </RatingStars>

              <TestimonialQuote>
                <p>"{testimonial.quote}"</p>
              </TestimonialQuote>

              <TestimonialTagsContainer>
                {testimonial.tags.map((tag, index) => (
                  <TestimonialTag key={index}>{tag}</TestimonialTag>
                ))}
              </TestimonialTagsContainer>

              <TestimonialFooter>
                <TestimonialUser>
                  <UserAvatar backgroundImage={testimonial.user.avatar}>
                    {!testimonial.user.avatar && <FiUser />}
                  </UserAvatar>
                  <UserInfo>
                    <UserName>{testimonial.user.name}</UserName>
                    <UserLocation>
                      <FiMapPin /> {testimonial.user.location}
                    </UserLocation>
                  </UserInfo>
                </TestimonialUser>
                <TestimonialDate>{testimonial.date}</TestimonialDate>
              </TestimonialFooter>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </PageSection>

      <SubmitTestimonialSection>
        <SectionTitle>Share Your Experience</SectionTitle>
        <SubmitTestimonialText>
          Have you used our platform to explore Ghanaian cuisine? We'd love to
          hear about your experience! Your feedback helps us improve and
          inspires others to discover the rich flavors of Ghana.
        </SubmitTestimonialText>
        <Button $primary>Submit Your Testimonial</Button>
      </SubmitTestimonialSection>
    </>
  );
};

export default TestimonialsPage;
