import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiSearch,
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

// Styled Components
const IngredientSearchBar = styled.div`
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

const FilterContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
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

const IngredientGrid = styled(CardGrid)`
  margin-top: ${spacing.xl};
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`;

const IngredientCard = styled(Card)`
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }
`;

const IngredientImage = styled(CardImage)`
  height: 180px;
`;

const IngredientContent = styled(CardContent)`
  position: relative;
`;

const IngredientBadge = styled.span<{ $type: string }>`
  position: absolute;
  top: -12px;
  right: 12px;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.full};
  font-size: 0.8rem;
  background-color: ${(props) => {
    switch (props.$type) {
      case 'vegetable':
        return `${colors.emeraldGreen}`;
      case 'spice':
        return `${colors.darkPastelRed}`;
      case 'grain':
        return `${colors.sandDune}`;
      case 'protein':
        return `${colors.nightBlue}`;
      default:
        return colors.galaxyGrey;
    }
  }};
  color: ${colors.white};
`;

const IngredientTitle = styled(CardTitle)`
  margin-top: ${spacing.sm};
`;

const IngredientDetail = styled.div`
  display: flex;
  margin-top: ${spacing.sm};
  font-size: 0.85rem;
  color: ${colors.galaxyGrey};
`;

const DetailLabel = styled.div`
  width: 80px;
  font-weight: ${typography.fontWeights.medium};
`;

const IngredientDetailSection = styled.div`
  margin: ${spacing.lg} 0 ${spacing.xl};
`;

const AccordionContainer = styled.div`
  margin: ${spacing.md} 0;
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid ${colors.cosmicLatte};
  margin-bottom: ${spacing.md};
`;

const AccordionHeader = styled.button<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: ${spacing.md} 0;
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  background: none;
  border: none;
  cursor: pointer;

  svg {
    transition: transform 0.3s ease;
    transform: ${(props) => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0)')};
    color: ${colors.emeraldGreen};
  }
`;

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  padding: 0 0 ${spacing.lg} 0;
`;

const SeasonalityChart = styled.div`
  margin: ${spacing.xl} 0;
`;

const Months = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  margin-bottom: ${spacing.md};
`;

const Month = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: ${colors.deepSpace};
  padding: ${spacing.xs} 0;
`;

const IngredientSeasonality = styled.div`
  margin-bottom: ${spacing.md};
  display: flex;
  align-items: center;
`;

const IngredientName = styled.div`
  width: 150px;
  font-size: 0.9rem;
  color: ${colors.deepSpace};
  padding-right: ${spacing.md};

  @media (max-width: ${breakpoints.mobile}) {
    width: 100px;
  }
`;

const SeasonalityBars = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  flex: 1;
`;

const SeasonalityBar = styled.div<{ $inSeason: boolean }>`
  height: 20px;
  background-color: ${(props) =>
    props.$inSeason ? colors.emeraldGreen : colors.cosmicLatte};
  border: 1px solid ${colors.white};
`;

// Data
const ingredients = [
  {
    id: 1,
    name: 'Garden Eggs (Eggplant)',
    localName: 'Ntrowa',
    type: 'vegetable',
    image:
      'https://images.unsplash.com/photo-1605196560545-41004030e2ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description:
      'Small, egg-shaped eggplants with a slightly bitter taste. Used in stews, soups and sometimes eaten grilled.',
    selection: 'Choose firm fruits with smooth, shiny skin and no blemishes.',
    storage: 'Store in a cool, dry place for up to a week.',
    preparation:
      'Can be used whole or sliced. Often boiled before adding to recipes.',
    dishes: ['Garden Egg Stew', 'Abom Stew', 'Palaver Sauce'],
    seasonality: [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  },
  {
    id: 2,
    name: 'Scotch Bonnet Pepper',
    localName: 'Akweley Meko',
    type: 'spice',
    image:
      'https://images.unsplash.com/photo-1626203616309-0382cb785e8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80',
    description:
      'Extremely hot peppers that provide essential heat and flavor to Ghanaian cuisine.',
    selection:
      'Select bright, firm peppers. Color varies from green to yellow, red or orange.',
    storage: 'Refrigerate for up to 2 weeks or freeze for longer storage.',
    preparation: 'Use whole, sliced or blended. Remove seeds to reduce heat.',
    dishes: ['Shito (Hot Pepper Sauce)', 'Jollof Rice', 'Light Soup'],
    seasonality: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 3,
    name: 'Cocoyam Leaves',
    localName: 'Kontomire',
    type: 'vegetable',
    image:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description:
      'Broad, heart-shaped leaves with a flavor similar to spinach but more robust.',
    selection:
      'Choose fresh, bright green leaves without wilting or yellowing.',
    storage:
      'Keep wrapped in damp paper towels in the refrigerator for up to 3 days.',
    preparation:
      'Remove stems, wash thoroughly, and typically boil to remove calcium oxalate which causes itching.',
    dishes: ['Kontomire Stew', 'Palaver Sauce', 'Cocoyam Leaf Soup'],
    seasonality: [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  },
  {
    id: 4,
    name: 'Palm Oil',
    localName: 'Ngo',
    type: 'spice',
    image:
      'https://images.unsplash.com/photo-1597713330689-bf8c48caccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description:
      'Rich, red oil extracted from oil palm fruit. Gives color and distinct flavor to many dishes.',
    selection: 'Choose unrefined, bright red oil for authentic flavor.',
    storage: 'Store in a dark, cool place for up to a year.',
    preparation:
      'Often heated until color changes from red to orange before using in recipes.',
    dishes: ['Palm Oil Stew (Red Red)', 'Kontomire', 'Beans Stew'],
    seasonality: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 5,
    name: 'Fermented Corn Dough',
    localName: 'Mmore',
    type: 'grain',
    image:
      'https://images.unsplash.com/photo-1623227866882-904601d2bd2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description:
      'Ground corn that has been fermented, providing a sour taste and unique texture.',
    selection: 'Should have a pleasant sour smell with no mold or off odors.',
    storage:
      'Keep refrigerated for up to a week. Can be frozen for longer periods.',
    preparation:
      'Used as is or may be mixed with other ingredients depending on the recipe.',
    dishes: ['Banku', 'Kenkey', 'Akple'],
    seasonality: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 6,
    name: 'Smoked Fish',
    localName: 'Nsesaawa',
    type: 'protein',
    image:
      'https://images.unsplash.com/photo-1607623618478-da7b4140e305?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description:
      'Various fish smoked over wood fire, providing intense flavor to soups and stews.',
    selection: 'Choose pieces that are dry, firm and fragrant with no mold.',
    storage:
      'Keep in a cool, dry place for up to a month or refrigerate for longer storage.',
    preparation:
      'Typically soaked briefly, then flaked or added whole to dishes.',
    dishes: ['Light Soup', 'Palm Nut Soup', 'Okro Soup'],
    seasonality: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 7,
    name: 'Cassava',
    localName: 'Bankye',
    type: 'vegetable',
    image:
      'https://images.unsplash.com/photo-1587049693270-c07628c9a5bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    description:
      'Starchy root vegetable that is a staple in Ghanaian cuisine. Has a mild, slightly sweet flavor.',
    selection: 'Choose firm roots with no soft spots or discoloration.',
    storage:
      'Store in a cool, dry place and use within a week. Once peeled, cover with water and refrigerate.',
    preparation:
      'Must be peeled, and thoroughly cooked to remove natural toxins. Never eat raw.',
    dishes: ['Fufu', 'Gari', 'Ampesi'],
    seasonality: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 8,
    name: 'Dawadawa',
    localName: 'Dawadawa',
    type: 'spice',
    image:
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    description:
      'Fermented seeds of the locust bean tree, used as a flavoring similar to bouillon cubes.',
    selection: 'Should have a pungent smell and dark color.',
    storage: 'Keep in an airtight container in a cool, dry place.',
    preparation:
      'Typically dissolved in liquid or ground before adding to dishes.',
    dishes: ['Light Soup', 'Peanut Soup', 'Various stews'],
    seasonality: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
];

const IngredientGuidePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [selectedIngredient, setSelectedIngredient] = useState<number | null>(
    null
  );
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const filteredIngredients = ingredients.filter((ingredient) => {
    // Filter by search term
    const matchesSearch =
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.localName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by type
    const matchesType = activeType === 'all' || ingredient.type === activeType;

    return matchesSearch && matchesType;
  });

  const handleTypeFilter = (type: string) => {
    setActiveType(type);
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/resources'>Resources</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Ingredient Guide</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Ghanaian Ingredient Guide</PageTitle>
      <PageDescription>
        Discover the essential ingredients that form the foundation of Ghanaian
        cuisine. From garden eggs to dawadawa, learn how to select, store, and
        use these traditional ingredients to create authentic dishes at home.
      </PageDescription>

      <Banner>
        <BannerContent>
          <BannerTitle>New Ingredients Just Added</BannerTitle>
          <BannerDescription>
            Explore our expanded collection of hard-to-find Ghanaian ingredients
            now available in our online store. Get traditional, high-quality
            ingredients delivered to your door.
          </BannerDescription>
          <CardLink
            as={Link}
            to='/shop'>
            Shop Ingredients <FiArrowRight />
          </CardLink>
        </BannerContent>
        <BannerImage backgroundImage='https://images.unsplash.com/photo-1467453678174-768ec283a940?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80' />
      </Banner>

      <IngredientSearchBar>
        <SearchInputWrapper>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type='text'
            placeholder='Search ingredients...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInputWrapper>

        <FilterContainer>
          <FilterButton
            $active={activeType === 'all'}
            onClick={() => handleTypeFilter('all')}>
            All
          </FilterButton>
          <FilterButton
            $active={activeType === 'vegetable'}
            onClick={() => handleTypeFilter('vegetable')}>
            Vegetables
          </FilterButton>
          <FilterButton
            $active={activeType === 'spice'}
            onClick={() => handleTypeFilter('spice')}>
            Spices
          </FilterButton>
          <FilterButton
            $active={activeType === 'grain'}
            onClick={() => handleTypeFilter('grain')}>
            Grains
          </FilterButton>
          <FilterButton
            $active={activeType === 'protein'}
            onClick={() => handleTypeFilter('protein')}>
            Proteins
          </FilterButton>
        </FilterContainer>
      </IngredientSearchBar>

      <IngredientGrid>
        {filteredIngredients.length > 0 ? (
          filteredIngredients.map((ingredient) => (
            <IngredientCard key={ingredient.id}>
              <IngredientImage backgroundImage={ingredient.image} />
              <IngredientContent>
                <IngredientBadge $type={ingredient.type}>
                  {ingredient.type.charAt(0).toUpperCase() +
                    ingredient.type.slice(1)}
                </IngredientBadge>
                <IngredientTitle>{ingredient.name}</IngredientTitle>
                <CardText>
                  <em>Local name:</em> {ingredient.localName}
                </CardText>
                <CardText>{ingredient.description}</CardText>
                <CardLink
                  as='button'
                  onClick={() => setSelectedIngredient(ingredient.id)}>
                  Learn More <FiArrowRight />
                </CardLink>
              </IngredientContent>
            </IngredientCard>
          ))
        ) : (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: spacing.xl,
            }}>
            <h3>No ingredients match your search</h3>
            <p>Try using different keywords or removing filters</p>
          </div>
        )}
      </IngredientGrid>

      <PageSection>
        <SectionTitle>Seasonal Availability Chart</SectionTitle>
        <Paragraph>
          While many ingredients in Ghanaian cuisine are available year-round,
          particularly those that are dried or preserved, knowing when fresh
          ingredients are in season helps you choose the best time to make
          certain dishes. This chart shows when popular ingredients are at their
          peak in Ghana.
        </Paragraph>

        <SeasonalityChart>
          <Months>
            <Month>Jan</Month>
            <Month>Feb</Month>
            <Month>Mar</Month>
            <Month>Apr</Month>
            <Month>May</Month>
            <Month>Jun</Month>
            <Month>Jul</Month>
            <Month>Aug</Month>
            <Month>Sep</Month>
            <Month>Oct</Month>
            <Month>Nov</Month>
            <Month>Dec</Month>
          </Months>

          {ingredients.map((ingredient) => (
            <IngredientSeasonality key={ingredient.id}>
              <IngredientName>{ingredient.name}</IngredientName>
              <SeasonalityBars>
                {ingredient.seasonality.map((inSeason, index) => (
                  <SeasonalityBar
                    key={index}
                    $inSeason={Boolean(inSeason)}
                  />
                ))}
              </SeasonalityBars>
            </IngredientSeasonality>
          ))}
        </SeasonalityChart>
      </PageSection>

      <PageSection>
        <SectionTitle>Common Ingredient Questions</SectionTitle>
        <Paragraph>
          Find answers to frequently asked questions about Ghanaian ingredients,
          from substitutions to special preparations.
        </Paragraph>

        <AccordionContainer>
          <AccordionItem>
            <AccordionHeader
              $isOpen={openAccordion === 1}
              onClick={() => toggleAccordion(1)}>
              Where can I find Ghanaian ingredients outside of Ghana?
              {openAccordion === 1 ? <FiChevronUp /> : <FiChevronDown />}
            </AccordionHeader>
            <AccordionContent $isOpen={openAccordion === 1}>
              <Paragraph>
                Many Ghanaian ingredients can be found in African or Caribbean
                grocery stores in major cities. Online retailers specializing in
                African foods are also a great resource. For hard-to-find items,
                check our online shop or consider the substitutions listed in
                our cooking tips section.
              </Paragraph>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            <AccordionHeader
              $isOpen={openAccordion === 2}
              onClick={() => toggleAccordion(2)}>
              How do I prepare kontomire (cocoyam leaves) safely?
              {openAccordion === 2 ? <FiChevronUp /> : <FiChevronDown />}
            </AccordionHeader>
            <AccordionContent $isOpen={openAccordion === 2}>
              <Paragraph>
                Kontomire leaves contain calcium oxalate crystals that can cause
                itching if not properly prepared. To prepare safely, wear gloves
                when handling, remove all stems, wash thoroughly, then boil the
                leaves for 5-10 minutes before draining and using in your
                recipe. This initial boiling removes most of the irritants.
              </Paragraph>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            <AccordionHeader
              $isOpen={openAccordion === 3}
              onClick={() => toggleAccordion(3)}>
              Can I freeze fresh Ghanaian ingredients?
              {openAccordion === 3 ? <FiChevronUp /> : <FiChevronDown />}
            </AccordionHeader>
            <AccordionContent $isOpen={openAccordion === 3}>
              <Paragraph>
                Yes, many fresh Ghanaian ingredients freeze well. Garden eggs,
                scotch bonnet peppers, and herbs can be frozen. For garden eggs,
                slice and blanch them first. Peppers can be frozen whole or
                chopped. Kontomire leaves should be blanched before freezing.
                Ginger and garlic can be peeled, blended with a little water,
                and frozen in ice cube trays for convenient use in recipes.
              </Paragraph>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            <AccordionHeader
              $isOpen={openAccordion === 4}
              onClick={() => toggleAccordion(4)}>
              What's the difference between fermented corn dough and regular
              cornmeal?
              {openAccordion === 4 ? <FiChevronUp /> : <FiChevronDown />}
            </AccordionHeader>
            <AccordionContent $isOpen={openAccordion === 4}>
              <Paragraph>
                Fermented corn dough (mmore) has undergone a natural
                fermentation process, giving it a tangy, sour flavor and unique
                texture. Regular cornmeal is simply ground dried corn with no
                fermentation. The fermentation process also makes nutrients more
                bioavailable. While you can't directly substitute cornmeal, you
                can approximate the flavor by mixing cornmeal with a bit of
                plain yogurt and allowing it to sit for 24-48 hours.
              </Paragraph>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            <AccordionHeader
              $isOpen={openAccordion === 5}
              onClick={() => toggleAccordion(5)}>
              How can I reduce the heat from scotch bonnet peppers?
              {openAccordion === 5 ? <FiChevronUp /> : <FiChevronDown />}
            </AccordionHeader>
            <AccordionContent $isOpen={openAccordion === 5}>
              <Paragraph>
                Scotch bonnet peppers are extremely hot but provide essential
                flavor to Ghanaian dishes. To reduce heat while maintaining
                flavor, remove the seeds and white membrane before using. You
                can also use whole peppers in your cooking and remove them
                before serving. Another technique is to use only half a pepper
                and add additional bell pepper for bulk without the heat.
              </Paragraph>
            </AccordionContent>
          </AccordionItem>
        </AccordionContainer>
      </PageSection>

      <PageSection>
        <SectionTitle>Related Resources</SectionTitle>
        <CardGrid>
          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1556910633-5099dc3d3cde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
            <CardContent>
              <CardTitle>Cooking Techniques</CardTitle>
              <CardText>
                Learn essential techniques for preparing Ghanaian dishes with
                our step-by-step guides and video tutorials.
              </CardText>
              <CardLink
                as={Link}
                to='/cooking-tips'>
                View Techniques <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>

          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
            <CardContent>
              <CardTitle>Kitchen Tools</CardTitle>
              <CardText>
                Discover the essential tools and equipment needed to prepare
                authentic Ghanaian cuisine.
              </CardText>
              <CardLink
                as={Link}
                to='/kitchen-tools'>
                Explore Tools <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>

          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
            <CardContent>
              <CardTitle>Recipe Collection</CardTitle>
              <CardText>
                Browse our collection of authentic Ghanaian recipes that use
                these traditional ingredients.
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

export default IngredientGuidePage;
