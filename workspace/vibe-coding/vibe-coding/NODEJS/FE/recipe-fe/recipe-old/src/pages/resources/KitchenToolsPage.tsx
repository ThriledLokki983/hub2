import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiExternalLink,
  FiFilter,
  FiSearch,
  FiCheck,
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

// Styled Components
const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${spacing.lg};
  margin: ${spacing.xl} 0;
`;

const ToolCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
  border-radius: ${borderRadius.md};
  overflow: hidden;
  box-shadow: ${shadows.sm};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.md};
  }
`;

const ToolImage = styled.div<{ backgroundImage: string }>`
  height: 200px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ToolEssential = styled.div`
  position: absolute;
  top: ${spacing.md};
  right: ${spacing.md};
  background-color: ${colors.emeraldGreen};
  color: ${colors.white};
  font-size: 0.8rem;
  font-weight: ${typography.fontWeights.medium};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.full};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const ToolContent = styled.div`
  padding: ${spacing.md};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ToolTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: ${typography.fontWeights.medium};
  margin: 0 0 ${spacing.xs} 0;
  color: ${colors.deepSpace};
`;

const ToolLocalName = styled.div`
  font-style: italic;
  font-size: 0.9rem;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.sm};
`;

const ToolDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
  flex: 1;
`;

const ToolMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.xs} ${spacing.md};
  margin-bottom: ${spacing.md};
  font-size: 0.85rem;
`;

const ToolMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.galaxyGrey};

  strong {
    color: ${colors.deepSpace};
    font-weight: ${typography.fontWeights.medium};
  }
`;

const ToolLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 0.95rem;
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.emeraldGreen};
  text-decoration: none;
  margin-top: auto;

  &:hover {
    text-decoration: underline;
  }
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin: ${spacing.lg} 0;
`;

const SearchContainer = styled.div`
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

const FilterButtons = styled.div`
  display: flex;
  gap: ${spacing.xs};
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${(props) =>
    props.$active ? colors.emeraldGreen : colors.white};
  color: ${(props) => (props.$active ? colors.white : colors.deepSpace)};
  border: 1px solid
    ${(props) => (props.$active ? colors.emeraldGreen : colors.cosmicLatte)};
  border-radius: ${borderRadius.full};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.$active ? colors.emeraldGreen : colors.cosmicLatte};
  }
`;

const TipBox = styled.div`
  background-color: ${colors.lavenderMist};
  border-left: 4px solid ${colors.aubergine};
  border-radius: ${borderRadius.sm};
  padding: ${spacing.md};
  margin: ${spacing.lg} 0;
`;

const TipTitle = styled.h4`
  color: ${colors.aubergine};
  font-weight: ${typography.fontWeights.medium};
  margin: 0 0 ${spacing.xs} 0;
`;

const TipContent = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: ${spacing.lg} 0;
`;

const TableHead = styled.thead`
  background-color: ${colors.deepSpace};
  color: ${colors.white};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${colors.cosmicLatte}50;
  }
`;

const TableHeader = styled.th`
  padding: ${spacing.md};
  text-align: left;
  font-weight: ${typography.fontWeights.medium};
  font-size: 0.95rem;
`;

const TableCell = styled.td`
  padding: ${spacing.md};
  border-bottom: 1px solid ${colors.cosmicLatte};
  font-size: 0.95rem;
`;

// Data
const kitchenTools = [
  {
    id: 1,
    name: 'Asanka (Clay Pot)',
    localName: 'Asanka',
    description:
      'A traditional earthenware bowl used for serving fufu and other dishes. Has a rough interior that helps grind and mix ingredients.',
    image:
      'https://images.unsplash.com/photo-1590422749897-47c47673706a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80',
    material: 'Clay',
    usage: 'Grinding spices, serving fufu',
    maintenance: 'Hand wash only, avoid soap',
    modern: false,
    essential: true,
    category: 'serving',
    purchaseLink: 'https://example.com/shop/asanka',
  },
  {
    id: 2,
    name: 'Wooden Mortar and Pestle',
    localName: 'Waduro ne Woma',
    description:
      'Large wooden mortar and pestle set used for pounding fufu, yam, and other ingredients. Essential for traditional food preparation.',
    image:
      'https://images.unsplash.com/photo-1593759608142-2a0ce47acdc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    material: 'Wood',
    usage: 'Pounding fufu, yam, plantain',
    maintenance: 'Hand wash, oil occasionally',
    modern: false,
    essential: true,
    category: 'preparation',
    purchaseLink: 'https://example.com/shop/mortar-pestle',
  },
  {
    id: 3,
    name: 'Traditional Grater',
    localName: 'Twere',
    description:
      'Metal grater with small sharp holes used for processing cassava, coconut, and other ingredients.',
    image:
      'https://images.unsplash.com/photo-1589928181780-5115fa7062ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    material: 'Metal',
    usage: 'Grating cassava, coconut, ginger',
    maintenance: 'Wash and dry completely to prevent rust',
    modern: false,
    essential: true,
    category: 'preparation',
    purchaseLink: 'https://example.com/shop/grater',
  },
  {
    id: 4,
    name: 'Grinding Stone',
    localName: 'Tapoli',
    description:
      'Flat stone and smaller hand stone used for grinding peppers, spices, and other ingredients into paste.',
    image:
      'https://images.unsplash.com/photo-1627207743358-fcfda7a0e389?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    material: 'Stone',
    usage: 'Grinding spices, herbs, peppers',
    maintenance: 'Rinse with water, no soap',
    modern: false,
    essential: false,
    category: 'preparation',
    purchaseLink: 'https://example.com/shop/grinding-stone',
  },
  {
    id: 5,
    name: 'Cast Iron Pot',
    localName: 'Dadesen',
    description:
      'Heavy cast iron cooking pot ideal for slow-cooking stews and soups. Retains heat well and adds iron to food.',
    image:
      'https://images.unsplash.com/photo-1575382442464-aa2a9bc3964f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    material: 'Cast Iron',
    usage: 'Cooking soups, stews, sauces',
    maintenance: 'Season regularly, dry completely',
    modern: true,
    essential: true,
    category: 'cooking',
    purchaseLink: 'https://example.com/shop/cast-iron-pot',
  },
  {
    id: 6,
    name: 'Wooden Stirring Spoon',
    localName: 'Kwasea',
    description:
      'Long wooden spoon for stirring hot dishes without scratching pots or transferring heat.',
    image:
      'https://images.unsplash.com/photo-1580917081128-aa85eb41be91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    material: 'Wood',
    usage: 'Stirring soups, stews',
    maintenance: 'Hand wash, oil occasionally',
    modern: true,
    essential: true,
    category: 'utensil',
    purchaseLink: 'https://example.com/shop/wooden-spoon',
  },
  {
    id: 7,
    name: 'Calabash Ladle',
    localName: 'Akotwe',
    description:
      'Traditional ladle made from dried gourd used for serving soups and stews.',
    image:
      'https://images.unsplash.com/photo-1605242946148-a548651d7cfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    material: 'Dried Gourd',
    usage: 'Serving soups, stews',
    maintenance: 'Rinse with water, air dry',
    modern: false,
    essential: false,
    category: 'serving',
    purchaseLink: 'https://example.com/shop/calabash-ladle',
  },
  {
    id: 8,
    name: 'Wooden Fufu Paddle',
    localName: 'Eta',
    description:
      'Special wooden paddle designed specifically for turning and shaping fufu.',
    image:
      'https://images.unsplash.com/photo-1607635586278-6775adf2a44e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    material: 'Wood',
    usage: 'Turning and shaping fufu',
    maintenance: 'Hand wash, dry completely',
    modern: false,
    essential: false,
    category: 'preparation',
    purchaseLink: 'https://example.com/shop/fufu-paddle',
  },
  {
    id: 9,
    name: 'Electric Blender',
    localName: 'Blender',
    description:
      'Modern appliance that has become essential for quickly processing ingredients for Ghanaian dishes.',
    image:
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    material: 'Plastic/Metal',
    usage: 'Blending peppers, onions, tomatoes',
    maintenance: 'Follow manufacturer instructions',
    modern: true,
    essential: true,
    category: 'preparation',
    purchaseLink: 'https://example.com/shop/blender',
  },
  {
    id: 10,
    name: 'Jollof Pot',
    localName: 'Jollof Pot',
    description:
      'Wide, shallow pot specifically for cooking jollof rice to achieve the perfect texture and flavor.',
    image:
      'https://images.unsplash.com/photo-1586158291800-2665f07bba79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    material: 'Aluminum/Steel',
    usage: 'Cooking jollof rice',
    maintenance: 'Wash with warm soapy water',
    modern: true,
    essential: true,
    category: 'cooking',
    purchaseLink: 'https://example.com/shop/jollof-pot',
  },
];

const KitchenToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showModern, setShowModern] = useState(true);
  const [showTraditional, setShowTraditional] = useState(true);

  const filteredTools = kitchenTools.filter((tool) => {
    // Filter by search term
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.localName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory =
      activeCategory === 'all' || tool.category === activeCategory;

    // Filter by modern/traditional
    const matchesType =
      (tool.modern && showModern) || (!tool.modern && showTraditional);

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/resources'>Resources</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Kitchen Tools</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Essential Kitchen Tools</PageTitle>
      <PageDescription>
        Discover the traditional and modern kitchen tools used in Ghanaian
        cooking. From wooden mortars and pestles to specialized pots, learn
        which tools are essential for creating authentic Ghanaian dishes.
      </PageDescription>

      <Banner>
        <BannerContent>
          <BannerTitle>Shop Authentic Cooking Tools</BannerTitle>
          <BannerDescription>
            We've curated a selection of high-quality, authentic Ghanaian
            cooking tools available for purchase. Support artisans while
            equipping your kitchen for traditional cooking.
          </BannerDescription>
          <CardLink
            as={Link}
            to='/shop/tools'>
            Shop Tools <FiArrowRight />
          </CardLink>
        </BannerContent>
        <BannerImage backgroundImage='https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
      </Banner>

      <FilterBar>
        <SearchContainer>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type='text'
            placeholder='Search tools...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <FilterButtons>
          <FilterButton
            $active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}>
            All
          </FilterButton>
          <FilterButton
            $active={activeCategory === 'preparation'}
            onClick={() => setActiveCategory('preparation')}>
            Preparation
          </FilterButton>
          <FilterButton
            $active={activeCategory === 'cooking'}
            onClick={() => setActiveCategory('cooking')}>
            Cooking
          </FilterButton>
          <FilterButton
            $active={activeCategory === 'serving'}
            onClick={() => setActiveCategory('serving')}>
            Serving
          </FilterButton>
          <FilterButton
            $active={activeCategory === 'utensil'}
            onClick={() => setActiveCategory('utensil')}>
            Utensils
          </FilterButton>
        </FilterButtons>

        <FilterButtons>
          <FilterButton
            $active={showTraditional}
            onClick={() => setShowTraditional(!showTraditional)}>
            Traditional
          </FilterButton>
          <FilterButton
            $active={showModern}
            onClick={() => setShowModern(!showModern)}>
            Modern
          </FilterButton>
        </FilterButtons>
      </FilterBar>

      <ToolsGrid>
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <ToolCard key={tool.id}>
              <ToolImage backgroundImage={tool.image}>
                {tool.essential && (
                  <ToolEssential>
                    <FiCheck /> Essential
                  </ToolEssential>
                )}
              </ToolImage>
              <ToolContent>
                <ToolTitle>{tool.name}</ToolTitle>
                <ToolLocalName>Local name: {tool.localName}</ToolLocalName>
                <ToolDescription>{tool.description}</ToolDescription>

                <ToolMeta>
                  <ToolMetaItem>
                    <strong>Material:</strong> {tool.material}
                  </ToolMetaItem>
                  <ToolMetaItem>
                    <strong>Usage:</strong> {tool.usage}
                  </ToolMetaItem>
                </ToolMeta>

                <ToolLink
                  href={tool.purchaseLink}
                  target='_blank'
                  rel='noopener noreferrer'>
                  View in Shop <FiExternalLink />
                </ToolLink>
              </ToolContent>
            </ToolCard>
          ))
        ) : (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: spacing.xl,
            }}>
            <h3>No tools match your search</h3>
            <p>Try different keywords or filter options</p>
          </div>
        )}
      </ToolsGrid>

      <PageSection>
        <SectionTitle>Traditional vs Modern Tools</SectionTitle>
        <Paragraph>
          While traditional tools provide authenticity, modern alternatives can
          make Ghanaian cooking more accessible. This comparison helps you
          understand the key differences and decide which tools are right for
          your kitchen.
        </Paragraph>

        <ComparisonTable>
          <TableHead>
            <tr>
              <TableHeader>Traditional Tool</TableHeader>
              <TableHeader>Modern Alternative</TableHeader>
              <TableHeader>Impact on Flavor/Texture</TableHeader>
              <TableHeader>Recommendation</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            <TableRow>
              <TableCell>Wooden Mortar and Pestle</TableCell>
              <TableCell>Food Processor</TableCell>
              <TableCell>
                Traditional method releases more flavor and creates better
                texture for fufu
              </TableCell>
              <TableCell>
                Use traditional for authentic results, modern for convenience
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Grinding Stone</TableCell>
              <TableCell>Electric Blender</TableCell>
              <TableCell>
                Stone grinding creates more complex flavors but blending is
                faster
              </TableCell>
              <TableCell>Blender is acceptable for most home cooking</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Clay Pot (Asanka)</TableCell>
              <TableCell>Ceramic Bowl</TableCell>
              <TableCell>Clay pots impart subtle earthy flavors</TableCell>
              <TableCell>Authentic Asanka recommended for serving</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Calabash Ladle</TableCell>
              <TableCell>Plastic/Metal Ladle</TableCell>
              <TableCell>Minimal impact on flavor</TableCell>
              <TableCell>Either option is fine</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Traditional Grater</TableCell>
              <TableCell>Box Grater or Food Processor</TableCell>
              <TableCell>Traditional produces coarser texture</TableCell>
              <TableCell>Modern alternatives work well</TableCell>
            </TableRow>
          </tbody>
        </ComparisonTable>
      </PageSection>

      <TipBox>
        <TipTitle>Care Tip: Wooden Utensils</TipTitle>
        <TipContent>
          To maintain your wooden mortar, pestle, and other wooden utensils,
          wash them with warm water (no soap), dry immediately, and occasionally
          rub with food-grade mineral oil. This prevents drying, cracking, and
          helps your tools last for generations.
        </TipContent>
      </TipBox>

      <PageSection>
        <SectionTitle>The Starter Kit</SectionTitle>
        <Paragraph>
          If you're just beginning your journey into Ghanaian cooking, here are
          the essential tools we recommend for your kitchen:
        </Paragraph>

        <StyledList>
          <ListItem>
            <strong>Electric Blender</strong> - For quickly processing
            ingredients
          </ListItem>
          <ListItem>
            <strong>Cast Iron Pot</strong> - For cooking stews and sauces
          </ListItem>
          <ListItem>
            <strong>Jollof Pot</strong> - For the perfect jollof rice
          </ListItem>
          <ListItem>
            <strong>Long Wooden Spoon</strong> - For stirring without scratching
          </ListItem>
          <ListItem>
            <strong>Asanka</strong> - For authentic serving (if available)
          </ListItem>
        </StyledList>
      </PageSection>

      <PageSection>
        <SectionTitle>Related Resources</SectionTitle>
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
                View Ingredients <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>

          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1607877742574-1a5631561e3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2048&q=80' />
            <CardContent>
              <CardTitle>Cooking Techniques</CardTitle>
              <CardText>
                Master the essential cooking techniques used in Ghanaian
                cuisine.
              </CardText>
              <CardLink
                as={Link}
                to='/cooking-tips'>
                Learn Techniques <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>

          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
            <CardContent>
              <CardTitle>Recipe Collection</CardTitle>
              <CardText>
                Browse our collection of authentic Ghanaian recipes.
              </CardText>
              <CardLink
                as={Link}
                to='/recipes'>
                View Recipes <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>
        </CardGrid>
      </PageSection>
    </>
  );
};

export default KitchenToolsPage;
