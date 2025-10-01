import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiInfo, FiAlertCircle } from 'react-icons/fi';
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
  ImageContainer,
  StyledImage,
  CardGrid,
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardText,
  CardLink,
} from '../../components/PageComponents';

// Styled components
const TipGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${spacing.xl};
  margin: ${spacing.xl} 0;
`;

const TipCard = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  padding: ${spacing.lg};
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.medium};
  }
`;

const TipIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${borderRadius.full};
  background-color: ${colors.emeraldGreen}20;
  color: ${colors.emeraldGreen};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: ${spacing.md};
`;

const TipTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const TipText = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
`;

const VideoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.xl};
  margin: ${spacing.xl} 0;

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 ratio */
  height: 0;
  overflow: hidden;
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.soft};
`;

const VideoPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${colors.cosmicLatte}50;
  color: ${colors.deepSpace};
  text-align: center;
`;

const VideoPreview = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const VideoTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const VideoDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.lg};
`;

const TipNote = styled.div`
  padding: ${spacing.md} ${spacing.lg};
  background-color: ${colors.cosmicLatte}50;
  border-left: 4px solid ${colors.emeraldGreen};
  border-radius: ${borderRadius.md};
  margin: ${spacing.lg} 0;
`;

const TipNoteTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const TipNoteText = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
`;

const IngredientSubstitution = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${spacing.md};
  padding-bottom: ${spacing.md};
  border-bottom: 1px solid ${colors.cosmicLatte};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const OriginalIngredient = styled.div`
  flex: 1;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
`;

const SubstituteIngredient = styled.div`
  flex: 1;
  color: ${colors.galaxyGrey};
`;

const CookingTipsPage = () => {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/resources'>Resources</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Cooking Tips</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Cooking Tips & Techniques</PageTitle>
      <PageDescription>
        Master the art of Ghanaian cooking with these essential tips and
        techniques. From achieving the perfect jollof rice to properly grinding
        fufu, these expert recommendations will enhance your culinary skills and
        help you create authentic Ghanaian flavors at home.
      </PageDescription>

      <Banner>
        <BannerContent>
          <BannerTitle>New Video Series: Cooking Basics</BannerTitle>
          <BannerDescription>
            Join Chef Adjoa as she demonstrates fundamental techniques for
            Ghanaian cooking in our new weekly video series. Perfect for
            beginners and those looking to refine their skills.
          </BannerDescription>
          <CardLink
            as={Link}
            to='/cooking-series'>
            Watch Now <FiArrowRight />
          </CardLink>
        </BannerContent>
        <BannerImage backgroundImage='https://images.unsplash.com/photo-1556910633-5099dc3d3cde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
      </Banner>

      <PageSection>
        <SectionTitle>Essential Ghanaian Cooking Techniques</SectionTitle>
        <Paragraph>
          Ghanaian cuisine relies on several key techniques that bring out the
          rich flavors and textures in traditional dishes. Mastering these
          methods will help you create authentic meals at home.
        </Paragraph>

        <TipGrid>
          <TipCard>
            <TipIcon>🔥</TipIcon>
            <TipTitle>Proper Heat Management</TipTitle>
            <TipText>
              Many Ghanaian dishes require precise heat control. Start with high
              heat when frying onions and spices (the base for many stews), then
              reduce to low-medium when simmering. This builds depth of flavor
              and ensures proteins remain tender.
            </TipText>
          </TipCard>

          <TipCard>
            <TipIcon>🥄</TipIcon>
            <TipTitle>Grinding & Pounding Techniques</TipTitle>
            <TipText>
              Traditional dishes like fufu require proper pounding techniques.
              Use a consistent rhythm and gradually add water while pounding to
              achieve the right elasticity. For grinding pepper and spices, a
              stone grinder (woma) produces better texture than electric
              grinders.
            </TipText>
          </TipCard>

          <TipCard>
            <TipIcon>🧅</TipIcon>
            <TipTitle>Preparing the Perfect Base</TipTitle>
            <TipText>
              The foundation of Ghanaian stews is a well-prepared base of
              onions, ginger, garlic, and peppers. Take time to properly sauté
              these ingredients until fragrant before adding other components.
              This creates the essential flavor profile that defines Ghanaian
              cuisine.
            </TipText>
          </TipCard>

          <TipCard>
            <TipIcon>🍚</TipIcon>
            <TipTitle>Rice Preparation</TipTitle>
            <TipText>
              For perfect jollof rice, rinse the rice thoroughly first to remove
              excess starch. Allow the seasoned tomato base to cook until oils
              separate before adding rice. Cook covered on low heat and resist
              stirring too frequently to achieve the signature separate grains
              and bottom crust (kanzo).
            </TipText>
          </TipCard>

          <TipCard>
            <TipIcon>🥘</TipIcon>
            <TipTitle>Palm Oil Usage</TipTitle>
            <TipText>
              When recipes call for palm oil, heat it separately first until it
              changes from bright red to a clear orange color. This reduces the
              strong flavor while maintaining its rich color and nutritional
              benefits. Use in moderation as it has a distinctive taste.
            </TipText>
          </TipCard>

          <TipCard>
            <TipIcon>⏱️</TipIcon>
            <TipTitle>Slow Cooking & Patience</TipTitle>
            <TipText>
              Many Ghanaian stews and soups develop their rich flavors through
              slow cooking. Don't rush the process—allow ingredients to simmer
              gently, especially when cooking tougher cuts of meat or dried
              fish. This patience results in the deep, complex flavors
              characteristic of Ghanaian cuisine.
            </TipText>
          </TipCard>
        </TipGrid>
      </PageSection>

      <PageSection>
        <SectionTitle>Video Tutorial: Perfect Jollof Rice</SectionTitle>
        <Paragraph>
          Jollof rice is perhaps Ghana's most famous dish, but achieving the
          perfect consistency, flavor, and signature smoky taste requires
          attention to detail. Watch Chef Kwame demonstrate his foolproof
          method.
        </Paragraph>

        <VideoSection>
          <VideoContainer>
            <VideoPlaceholder>
              <h3>Video: How to Make Perfect Jollof Rice</h3>
              <p>Click to watch</p>
            </VideoPlaceholder>
            <VideoPreview
              src='https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
              alt='Jollof Rice'
            />
          </VideoContainer>
          <VideoInfo>
            <VideoTitle>Chef Kwame's Perfect Jollof Rice</VideoTitle>
            <VideoDescription>
              In this 15-minute tutorial, Chef Kwame shares his secrets for
              achieving perfectly cooked jollof rice with separate grains, rich
              flavor, and the coveted smoky taste. Learn about the right rice
              variety to use, proper liquid ratios, and how to achieve the
              beloved crispy bottom layer (kanzo).
            </VideoDescription>
            <StyledList>
              <ListItem>Use long-grain rice for best results</ListItem>
              <ListItem>Properly parboil rice before adding to stew</ListItem>
              <ListItem>Achieve smoky flavor without burning</ListItem>
              <ListItem>Create the perfect crispy bottom (kanzo)</ListItem>
            </StyledList>
          </VideoInfo>
        </VideoSection>

        <TipNote>
          <TipNoteTitle>
            <FiInfo /> Chef's Tip
          </TipNoteTitle>
          <TipNoteText>
            For authentic jollof rice, the smoky flavor is essential. To achieve
            this without burning your rice, use a wooden spoon to gently scrape
            the bottom of the pot occasionally as it cooks, and cover with a
            tight-fitting lid to trap the steam. If cooking on an electric
            stove, finish the rice in an oven at 300°F (150°C) for the final 10
            minutes to encourage even cooking and develop the smoky notes.
          </TipNoteText>
        </TipNote>
      </PageSection>

      <PageSection>
        <SectionTitle>Ingredient Substitutions</SectionTitle>
        <Paragraph>
          Can't find traditional Ghanaian ingredients? Here are some common
          substitutions that will help you create authentic flavors using more
          widely available alternatives.
        </Paragraph>

        <Card>
          <CardContent>
            <CardTitle>Common Substitutions</CardTitle>
            <IngredientSubstitution>
              <OriginalIngredient>
                <strong>Garden Eggs (African Eggplant)</strong>
              </OriginalIngredient>
              <SubstituteIngredient>
                Small Thai eggplants or standard eggplant (reduce quantity)
              </SubstituteIngredient>
            </IngredientSubstitution>

            <IngredientSubstitution>
              <OriginalIngredient>
                <strong>Kontomire Leaves (Cocoyam Leaves)</strong>
              </OriginalIngredient>
              <SubstituteIngredient>
                Collard greens or spinach (adjust cooking time)
              </SubstituteIngredient>
            </IngredientSubstitution>

            <IngredientSubstitution>
              <OriginalIngredient>
                <strong>Palm Oil</strong>
              </OriginalIngredient>
              <SubstituteIngredient>
                Combination of vegetable oil with a little tomato paste and
                paprika
              </SubstituteIngredient>
            </IngredientSubstitution>

            <IngredientSubstitution>
              <OriginalIngredient>
                <strong>Scotch Bonnet Peppers</strong>
              </OriginalIngredient>
              <SubstituteIngredient>
                Habanero peppers or any hot chili (adjust to taste)
              </SubstituteIngredient>
            </IngredientSubstitution>

            <IngredientSubstitution>
              <OriginalIngredient>
                <strong>Fufu Flour (Plantain/Cassava)</strong>
              </OriginalIngredient>
              <SubstituteIngredient>
                Instant mashed potatoes mixed with semolina (texture will
                differ)
              </SubstituteIngredient>
            </IngredientSubstitution>

            <IngredientSubstitution>
              <OriginalIngredient>
                <strong>Fermented Corn Dough</strong>
              </OriginalIngredient>
              <SubstituteIngredient>
                Quick version: Cornmeal mixed with plain yogurt (1:2 ratio)
              </SubstituteIngredient>
            </IngredientSubstitution>
          </CardContent>
        </Card>

        <TipNote>
          <TipNoteTitle>
            <FiAlertCircle /> Important Note
          </TipNoteTitle>
          <TipNoteText>
            While substitutions can help create similar flavor profiles, they
            may alter the authentic taste and texture. When possible, search for
            African grocery stores or online retailers that ship traditional
            ingredients for the most authentic results.
          </TipNoteText>
        </TipNote>
      </PageSection>

      <PageSection>
        <SectionTitle>Seasonal Cooking Tips</SectionTitle>
        <Paragraph>
          Ghanaian cuisine traditionally follows seasonal availability of
          ingredients. Here are tips for adapting your cooking to make the most
          of seasonal produce, just as cooks in Ghana would.
        </Paragraph>

        <TipGrid>
          <TipCard>
            <TipTitle>Rainy Season (April-June, Sept-Oct)</TipTitle>
            <TipText>
              <StyledList>
                <ListItem>
                  This is the perfect time for fresh green soups like Abenkwan
                  (palm nut soup) with seasonal greens
                </ListItem>
                <ListItem>
                  Mushrooms are abundant—add them to light stews and soups
                </ListItem>
                <ListItem>
                  Fresh maize (corn) is available for Abolo and Kenkey
                </ListItem>
              </StyledList>
            </TipText>
          </TipCard>

          <TipCard>
            <TipTitle>Dry Season (Nov-March, July-Aug)</TipTitle>
            <TipText>
              <StyledList>
                <ListItem>
                  Ideal time for dishes using dried fish and preserved
                  ingredients
                </ListItem>
                <ListItem>
                  Root vegetables and hardier greens feature prominently
                </ListItem>
                <ListItem>
                  Perfect for slow-cooked stews that can be preserved longer in
                  the warm weather
                </ListItem>
              </StyledList>
            </TipText>
          </TipCard>

          <TipCard>
            <TipTitle>Year-Round Adaptations</TipTitle>
            <TipText>
              <StyledList>
                <ListItem>
                  Use frozen vegetables and imported produce when necessary
                </ListItem>
                <ListItem>
                  Preserve seasonal abundance through drying, freezing, or
                  fermentation
                </ListItem>
                <ListItem>
                  Adjust spice levels according to weather—more heat during cool
                  periods, lighter seasoning in warm weather
                </ListItem>
              </StyledList>
            </TipText>
          </TipCard>
        </TipGrid>
      </PageSection>

      <PageSection>
        <SectionTitle>Common Cooking Mistakes to Avoid</SectionTitle>
        <Paragraph>
          Even experienced cooks can make these common errors when preparing
          Ghanaian dishes. Avoid these pitfalls for more authentic results.
        </Paragraph>

        <StyledList>
          <ListItem>
            <strong>Rushing the onion base</strong> - The foundation of many
            Ghanaian stews requires patience. Properly sautéing onions, ginger,
            and garlic is crucial for depth of flavor.
          </ListItem>
          <ListItem>
            <strong>Adding too much water</strong> - Many traditional dishes are
            meant to be thick. Start with less water than you think you need—you
            can always add more later.
          </ListItem>
          <ListItem>
            <strong>Over-blending pepper mixtures</strong> - Traditional
            Ghanaian stews have some texture. Pulse rather than fully blend your
            pepper mixture for authentic consistency.
          </ListItem>
          <ListItem>
            <strong>Incorrect heat management</strong> - Many dishes require
            starting with high heat, then reducing to a gentle simmer. Cooking
            everything on high heat will burn spices and toughen proteins.
          </ListItem>
          <ListItem>
            <strong>Neglecting salt and seasoning adjustments</strong> - Always
            taste and adjust seasoning throughout the cooking process,
            especially after adding main ingredients like meat or fish.
          </ListItem>
          <ListItem>
            <strong>Overcooking vegetables</strong> - Traditional Ghanaian
            cooking often involves longer cooking times, but modern adaptations
            should be careful not to overcook vegetables, especially greens
            which can lose nutrients and color.
          </ListItem>
        </StyledList>
      </PageSection>

      <PageSection>
        <SectionTitle>More Cooking Resources</SectionTitle>
        <Paragraph>
          Explore these additional resources to enhance your Ghanaian cooking
          skills and knowledge.
        </Paragraph>

        <CardGrid>
          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
            <CardContent>
              <CardTitle>Essential Kitchen Tools</CardTitle>
              <CardText>
                Discover the traditional and modern tools that make Ghanaian
                cooking easier and more authentic.
              </CardText>
              <CardLink
                as={Link}
                to='/kitchen-tools'>
                Explore Tools <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>

          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
            <CardContent>
              <CardTitle>Ingredient Guide</CardTitle>
              <CardText>
                Learn about the key ingredients in Ghanaian cuisine, how to
                select them, and proper storage methods.
              </CardText>
              <CardLink
                as={Link}
                to='/ingredient-guide'>
                View Guide <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>

          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1616661227071-d742dd7f7a79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80' />
            <CardContent>
              <CardTitle>Cooking Classes</CardTitle>
              <CardText>
                Join our virtual and in-person cooking classes led by Ghanaian
                chefs to perfect your techniques.
              </CardText>
              <CardLink
                as={Link}
                to='/cooking-classes'>
                Find Classes <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>
        </CardGrid>
      </PageSection>
    </>
  );
};

export default CookingTipsPage;
