import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCalendar,
  FiUser,
  FiTag,
  FiSearch,
  FiClock,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
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
  SubSectionTitle,
  Paragraph,
  PageSection,
  Banner,
  BannerContent,
  BannerTitle,
  BannerDescription,
  BannerImage,
  StyledList,
  ListItem,
  CardGrid,
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardText,
  CardLink,
} from '../../components/PageComponents';
import Button from '../../components/Button';

// Styled Components
const BlogSearchBar = styled.div`
  display: flex;
  margin: ${spacing.lg} 0;
  gap: ${spacing.md};
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${spacing.md} ${spacing.md} ${spacing.md} 2.8rem;
  border: 1px solid ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${colors.emeraldGreen};
    box-shadow: 0 0 0 2px ${colors.emeraldGreen}20;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: ${colors.galaxyGrey};
  pointer-events: none;
`;

const CategoryFilters = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;

const CategoryButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.full};
  font-size: 0.9rem;
  background-color: ${(props) =>
    props.$active ? colors.emeraldGreen : colors.white};
  color: ${(props) => (props.$active ? colors.white : colors.deepSpace)};
  border: 1px solid
    ${(props) => (props.$active ? colors.emeraldGreen : colors.cosmicLatte)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.$active ? colors.emeraldGreen : colors.cosmicLatte};
  }
`;

const FeaturedPost = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xxl};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 1.4fr 1fr;
  }
`;

const FeaturedImage = styled.div<{ backgroundImage: string }>`
  height: 400px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  border-radius: ${borderRadius.lg};
  position: relative;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
  }
`;

const FeaturedContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.soft};
  height: 100%;
`;

const FeaturedCategory = styled.div`
  display: inline-block;
  background-color: ${colors.cosmicLatte};
  color: ${colors.deepSpace};
  font-size: 0.85rem;
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${borderRadius.full};
  margin-bottom: ${spacing.md};
`;

const FeaturedTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
  line-height: 1.3;
`;

const FeaturedMeta = styled.div`
  display: flex;
  gap: ${spacing.lg};
  margin-bottom: ${spacing.md};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.galaxyGrey};
  font-size: 0.85rem;

  svg {
    color: ${colors.emeraldGreen};
  }
`;

const FeaturedExcerpt = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.lg};
`;

const BlogGrid = styled(CardGrid)`
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
`;

const BlogCard = styled(Card)`
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }
`;

const BlogImage = styled(CardImage)`
  height: 200px;
`;

const PostDate = styled.div`
  font-size: 0.85rem;
  color: ${colors.galaxyGrey};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  margin-bottom: ${spacing.sm};
`;

const BlogContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const BlogCategory = styled.div`
  display: inline-block;
  background-color: ${colors.cosmicLatte};
  color: ${colors.deepSpace};
  font-size: 0.75rem;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.full};
  margin-bottom: ${spacing.sm};
  align-self: flex-start;
`;

const BlogTitle = styled(CardTitle)`
  margin-bottom: ${spacing.sm};
`;

const ReadMoreLink = styled(CardLink)`
  margin-top: ${spacing.md};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${spacing.xl} 0;
`;

const PageNumber = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 ${spacing.xs};
  border-radius: ${borderRadius.sm};
  background-color: ${(props) =>
    props.$active ? colors.emeraldGreen : colors.white};
  color: ${(props) => (props.$active ? colors.white : colors.deepSpace)};
  border: 1px solid
    ${(props) => (props.$active ? colors.emeraldGreen : colors.cosmicLatte)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.$active ? colors.emeraldGreen : colors.cosmicLatte};
  }
`;

const PageArrow = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 ${spacing.xs};
  border-radius: ${borderRadius.sm};
  background-color: ${colors.white};
  color: ${colors.deepSpace};
  border: 1px solid ${colors.cosmicLatte};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.cosmicLatte};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SubscriptionSection = styled.div`
  background-color: ${colors.lavenderMist};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
  text-align: center;
  margin: ${spacing.xxl} 0;
`;

const SubscriptionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const SubscriptionText = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto ${spacing.lg};
`;

const EmailForm = styled.form`
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: ${spacing.sm};
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: ${spacing.md};
  border: 1px solid ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: ${colors.emeraldGreen};
  }
`;

// Sample data for the blog page
const blogPosts = [
  {
    id: 1,
    title: "The Art of Making Perfect Jollof Rice: Tips from Ghana's Top Chefs",
    category: 'Cooking Tips',
    excerpt:
      "Learn the secrets to making the perfect Jollof rice with these expert tips from Ghana's most celebrated chefs.",
    image:
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    author: 'Kwame Mensah',
    date: 'April 15, 2025',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: 2,
    title: 'Exploring Regional Variations of Fufu Across Ghana',
    category: 'Regional Cuisine',
    excerpt:
      'Discover how fufu preparation and serving traditions vary across different regions of Ghana.',
    image:
      'https://images.unsplash.com/photo-1608835291093-394b0c943a75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
    author: 'Abena Owusu',
    date: 'April 10, 2025',
    readTime: '6 min read',
  },
  {
    id: 3,
    title: 'Traditional Cooking Tools That Every Ghanaian Kitchen Needs',
    category: 'Kitchen Tools',
    excerpt:
      'Essential traditional tools that help create authentic Ghanaian flavors and textures in your cooking.',
    image:
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80',
    author: 'Kofi Adjei',
    date: 'April 5, 2025',
    readTime: '5 min read',
  },
  {
    id: 4,
    title: 'The Health Benefits of Traditional Ghanaian Spices',
    category: 'Nutrition',
    excerpt:
      'Explore the medicinal and nutritional properties of spices commonly used in Ghanaian cuisine.',
    image:
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80',
    author: 'Dr. Ama Boateng',
    date: 'March 28, 2025',
    readTime: '7 min read',
  },
  {
    id: 5,
    title: 'Celebrating Ghanaian Cuisine: Festival Foods and Their History',
    category: 'Culture',
    excerpt:
      "Learn about the traditional foods prepared during Ghana's most important cultural festivals.",
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    author: 'Yaw Darko',
    date: 'March 20, 2025',
    readTime: '9 min read',
  },
  {
    id: 6,
    title: 'Modern Twists on Classic Ghanaian Dishes',
    category: 'Recipes',
    excerpt:
      'Contemporary interpretations of beloved Ghanaian recipes that honor tradition while embracing innovation.',
    image:
      'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    author: 'Efua Mensah',
    date: 'March 15, 2025',
    readTime: '6 min read',
  },
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  const filteredPosts = regularPosts.filter((post) => {
    // Filter by search term
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory =
      activeCategory === 'all' ||
      post.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    'all',
    ...new Set(blogPosts.map((post) => post.category.toLowerCase())),
  ];

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/resources'>Resources</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Blog</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Ghanaian Cuisine Blog</PageTitle>
      <PageDescription>
        Explore articles, stories, and insights about Ghanaian cooking
        traditions, ingredients, and culture. Our blog celebrates the rich
        culinary heritage of Ghana through expert tips, regional explorations,
        and modern interpretations.
      </PageDescription>

      <BlogSearchBar>
        <SearchInputWrapper>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type='text'
            placeholder='Search articles...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInputWrapper>

        <CategoryFilters>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              $active={activeCategory === category}
              onClick={() => handleCategoryFilter(category)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </CategoryButton>
          ))}
        </CategoryFilters>
      </BlogSearchBar>

      {featuredPost && activeCategory === 'all' && !searchTerm && (
        <PageSection>
          <SectionTitle>Featured Article</SectionTitle>
          <FeaturedPost>
            <FeaturedImage backgroundImage={featuredPost.image} />
            <FeaturedContent>
              <FeaturedCategory>{featuredPost.category}</FeaturedCategory>
              <FeaturedTitle>{featuredPost.title}</FeaturedTitle>
              <FeaturedMeta>
                <MetaItem>
                  <FiUser /> {featuredPost.author}
                </MetaItem>
                <MetaItem>
                  <FiCalendar /> {featuredPost.date}
                </MetaItem>
                <MetaItem>
                  <FiClock /> {featuredPost.readTime}
                </MetaItem>
              </FeaturedMeta>
              <FeaturedExcerpt>{featuredPost.excerpt}</FeaturedExcerpt>
              <Button primary>Read Full Article</Button>
            </FeaturedContent>
          </FeaturedPost>
        </PageSection>
      )}

      <PageSection>
        <SectionTitle>Latest Articles</SectionTitle>
        {filteredPosts.length > 0 ? (
          <BlogGrid>
            {filteredPosts.map((post) => (
              <BlogCard key={post.id}>
                <BlogImage backgroundImage={post.image} />
                <BlogContent>
                  <BlogCategory>{post.category}</BlogCategory>
                  <BlogTitle>{post.title}</BlogTitle>
                  <PostDate>
                    <FiCalendar /> {post.date} • <FiClock /> {post.readTime}
                  </PostDate>
                  <CardText>{post.excerpt}</CardText>
                  <ReadMoreLink as='button'>
                    Read More <FiArrowRight />
                  </ReadMoreLink>
                </BlogContent>
              </BlogCard>
            ))}
          </BlogGrid>
        ) : (
          <div style={{ textAlign: 'center', padding: spacing.xl }}>
            <h3>No articles match your search</h3>
            <p>Try different keywords or categories</p>
          </div>
        )}

        {filteredPosts.length > 6 && (
          <PaginationContainer>
            <PageArrow disabled={currentPage === 1}>&lt;</PageArrow>
            {[1, 2, 3].map((page) => (
              <PageNumber
                key={page}
                $active={currentPage === page}
                onClick={() => setCurrentPage(page)}>
                {page}
              </PageNumber>
            ))}
            <PageArrow disabled={currentPage === 3}>&gt;</PageArrow>
          </PaginationContainer>
        )}
      </PageSection>

      <SubscriptionSection>
        <SubscriptionTitle>Subscribe to Our Newsletter</SubscriptionTitle>
        <SubscriptionText>
          Stay updated with our latest recipes, cooking tips, and cultural
          insights about Ghanaian cuisine. Get special content delivered
          directly to your inbox.
        </SubscriptionText>
        <EmailForm>
          <EmailInput
            type='email'
            placeholder='Enter your email address'
            required
          />
          <Button primary>Subscribe</Button>
        </EmailForm>
      </SubscriptionSection>

      <PageSection>
        <SectionTitle>Explore More Resources</SectionTitle>
        <CardGrid>
          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80' />
            <CardContent>
              <CardTitle>Ingredient Guide</CardTitle>
              <CardText>
                Learn about the essential ingredients used in traditional
                Ghanaian cuisine.
              </CardText>
              <CardLink
                as={Link}
                to='/ingredient-guide'>
                View Guide <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>

          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1594318809502-bc2a01d63094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80' />
            <CardContent>
              <CardTitle>Kitchen Tools</CardTitle>
              <CardText>
                Discover the traditional and modern tools essential for Ghanaian
                cooking.
              </CardText>
              <CardLink
                as={Link}
                to='/kitchen-tools'>
                Explore Tools <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>

          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1556910633-5099dc3d3cde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
            <CardContent>
              <CardTitle>Cooking Tips</CardTitle>
              <CardText>
                Master essential techniques for preparing authentic Ghanaian
                dishes.
              </CardText>
              <CardLink
                as={Link}
                to='/cooking-tips'>
                View Tips <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>
        </CardGrid>
      </PageSection>
    </>
  );
};

export default BlogPage;
