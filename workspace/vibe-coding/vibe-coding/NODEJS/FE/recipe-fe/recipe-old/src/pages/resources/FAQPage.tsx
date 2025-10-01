import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiMail,
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
  CardGrid,
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardText,
  CardLink,
} from '../../components/PageComponents';
import Button from '../../components/Button';

// Styled components
const FAQContainer = styled.div`
  margin-bottom: ${spacing.xxl};
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin: ${spacing.xl} 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${spacing.md} ${spacing.md} ${spacing.md} 3rem;
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

const FAQCategoryTabs = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.xl};
  flex-wrap: wrap;
`;

const CategoryTab = styled.button<{ $active?: boolean }>`
  padding: ${spacing.sm} ${spacing.lg};
  background-color: ${(props) =>
    props.$active ? colors.emeraldGreen : colors.white};
  color: ${(props) => (props.$active ? colors.white : colors.deepSpace)};
  border: 1px solid
    ${(props) => (props.$active ? colors.emeraldGreen : colors.cosmicLatte)};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${typography.fontWeights.light};

  &:hover {
    background-color: ${(props) =>
      props.$active ? colors.emeraldGreen : colors.cosmicLatte};
  }
`;

const AccordionContainer = styled.div`
  margin-top: ${spacing.lg};
`;

const AccordionItem = styled.div`
  margin-bottom: ${spacing.md};
  border: 1px solid ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  overflow: hidden;
  box-shadow: ${shadows.soft};
  background-color: ${colors.white};
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: ${shadows.medium};
  }
`;

const AccordionHeader = styled.button<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: ${spacing.lg};
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.light};
  color: ${(props) => (props.$isOpen ? colors.emeraldGreen : colors.deepSpace)};
  background-color: ${colors.white};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${colors.emeraldGreen};
  }

  svg {
    transition: transform 0.3s ease;
    color: ${colors.emeraldGreen};
  }
`;

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  padding: 0 ${spacing.lg} ${spacing.lg};
  border-top: ${(props) =>
    props.$isOpen ? `1px solid ${colors.cosmicLatte}` : 'none'};
`;

const AnswerText = styled.div`
  color: ${colors.galaxyGrey};
  font-size: 1rem;
  line-height: 1.6;
`;

const HighlightedAnswer = styled.div`
  background-color: ${colors.lavenderMist};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  margin: ${spacing.md} 0;
  border-left: 4px solid ${colors.aubergine};
`;

const SuggestionList = styled.ul`
  margin: ${spacing.md} 0;
  padding-left: ${spacing.xl};

  li {
    margin-bottom: ${spacing.sm};
    color: ${colors.galaxyGrey};
    line-height: 1.6;
  }
`;

const LinksList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm};
  margin-top: ${spacing.md};
`;

const SmallButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.xs} ${spacing.sm};
  background-color: ${colors.cosmicLatte};
  color: ${colors.deepSpace};
  border-radius: ${borderRadius.full};
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.cosmicLatte}aa;
    transform: translateY(-2px);
  }
`;

const ContactSection = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  padding: ${spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const ContactTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const ContactText = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 1rem;
  margin-bottom: ${spacing.lg};
  max-width: 600px;
`;

const ContactButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.md} ${spacing.xl};
  background-color: ${colors.emeraldGreen};
  color: ${colors.white};
  border-radius: ${borderRadius.md};
  text-decoration: none;
  font-weight: ${typography.fontWeights.light};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.medium};
  }
`;

// FAQ data organized by category
const faqData = {
  general: [
    {
      id: 'g1',
      question: 'What makes Ghanaian cuisine unique?',
      answer: (
        <AnswerText>
          <p>
            Ghanaian cuisine is distinguished by its rich flavors, vibrant
            colors, and diverse ingredients. It features:
          </p>
          <SuggestionList>
            <li>
              <strong>Bold Spices:</strong> Liberal use of scotch bonnet
              peppers, ginger, and garlic creates distinctive flavors.
            </li>
            <li>
              <strong>Starchy Staples:</strong> Foods like fufu, banku, and
              kenkey form the foundation of many meals.
            </li>
            <li>
              <strong>One-pot Tradition:</strong> Many dishes are cooked as
              complete one-pot meals, combining proteins, vegetables, and
              spices.
            </li>
            <li>
              <strong>Regional Diversity:</strong> Each of Ghana's 16 regions
              has its own culinary specialties and variations.
            </li>
          </SuggestionList>
          <p>
            This unique combination of ingredients, techniques, and cultural
            influences makes Ghanaian food both distinctive and flavorful.
          </p>
        </AnswerText>
      ),
    },
    {
      id: 'g2',
      question: 'Is Ghanaian food spicy?',
      answer: (
        <AnswerText>
          <p>
            Yes, traditional Ghanaian cuisine tends to be spicy, though the heat
            level can vary significantly between dishes and regional
            preparations. Scotch bonnet peppers (locally known as "akweley
            meko") are a staple ingredient in many Ghanaian dishes, providing
            both heat and flavor.
          </p>
          <HighlightedAnswer>
            <strong>Heat Management:</strong> When cooking Ghanaian dishes at
            home, you can easily adjust the spice level by reducing the amount
            of peppers used or removing the seeds (which contain most of the
            heat). Some dishes are served with additional pepper sauce on the
            side, allowing each person to customize the spiciness according to
            their preference.
          </HighlightedAnswer>
          <p>
            Non-spicy options like plain rice dishes, boiled yams, or milder
            stews are also common in Ghanaian cuisine, making it accessible to
            those who prefer less heat.
          </p>
        </AnswerText>
      ),
    },
    {
      id: 'g3',
      question: 'What are the most popular Ghanaian dishes?',
      answer: (
        <AnswerText>
          <p>
            Ghana offers a wide variety of delicious dishes. Here are some of
            the most popular and beloved Ghanaian foods:
          </p>
          <SuggestionList>
            <li>
              <strong>Jollof Rice:</strong> A flavorful one-pot rice dish cooked
              with tomatoes, peppers, and aromatic spices.
            </li>
            <li>
              <strong>Fufu with Light Soup:</strong> Pounded cassava and
              plantain dough served with a spicy, clear soup often containing
              meat or fish.
            </li>
            <li>
              <strong>Waakye:</strong> Rice and beans cooked together with dried
              millet leaves, giving it a distinctive reddish color.
            </li>
            <li>
              <strong>Banku with Okro Stew:</strong> Fermented corn and cassava
              dough served with slimy okra stew.
            </li>
            <li>
              <strong>Red-Red:</strong> Black-eyed peas stewed in palm oil with
              plantains, a popular vegetarian option.
            </li>
            <li>
              <strong>Kelewele:</strong> Spiced, fried plantains seasoned with
              ginger, cayenne pepper, and other spices.
            </li>
          </SuggestionList>
          <LinksList>
            <SmallButton to='/recipes'>
              Popular Recipes <FiArrowRight />
            </SmallButton>
            <SmallButton to='/regional-cuisines'>
              Regional Variations <FiArrowRight />
            </SmallButton>
          </LinksList>
        </AnswerText>
      ),
    },
  ],
  ingredients: [
    {
      id: 'i1',
      question: 'Where can I find Ghanaian ingredients outside of Ghana?',
      answer: (
        <AnswerText>
          <p>
            Finding authentic Ghanaian ingredients outside Ghana is becoming
            increasingly easier. Here are the best places to look:
          </p>
          <SuggestionList>
            <li>
              <strong>African Grocery Stores:</strong> Most major cities have
              specialized African grocery stores that stock essential Ghanaian
              ingredients like palm oil, garden eggs, and fermented corn dough.
            </li>
            <li>
              <strong>Caribbean Markets:</strong> These often carry similar
              ingredients used in West African cooking.
            </li>
            <li>
              <strong>International Sections:</strong> Larger supermarket chains
              increasingly stock basic West African ingredients in their
              international foods section.
            </li>
            <li>
              <strong>Online Retailers:</strong> Websites specializing in
              African foods ship worldwide and offer hard-to-find Ghanaian
              ingredients.
            </li>
          </SuggestionList>
          <HighlightedAnswer>
            <strong>Substitutions:</strong> If you can't find specific
            ingredients, check our{' '}
            <Link to='/ingredient-guide'>Ingredient Guide</Link> for suitable
            substitutions. For example, regular eggplant can substitute for
            garden eggs, and habanero peppers work well in place of scotch
            bonnets.
          </HighlightedAnswer>
        </AnswerText>
      ),
    },
    {
      id: 'i2',
      question: 'How do I prepare kontomire (cocoyam leaves) safely?',
      answer: (
        <AnswerText>
          <p>
            Kontomire (cocoyam leaves) contain calcium oxalate crystals that can
            cause itching and irritation if not properly prepared. Follow these
            steps to prepare them safely:
          </p>
          <SuggestionList>
            <li>
              <strong>Use protection:</strong> Wear gloves when handling raw
              kontomire to prevent skin irritation.
            </li>
            <li>
              <strong>Thorough washing:</strong> Rinse the leaves multiple times
              under running water to remove dirt and surface irritants.
            </li>
            <li>
              <strong>Remove stems:</strong> Cut off the tough stems and veins,
              which contain higher concentrations of irritants.
            </li>
            <li>
              <strong>Pre-cooking:</strong> Blanch the leaves in boiling water
              for 5-10 minutes, then drain before using in your recipe. This
              crucial step breaks down the irritants.
            </li>
            <li>
              <strong>Complete cooking:</strong> Always ensure kontomire is
              fully cooked before consuming, as heat neutralizes the remaining
              irritants.
            </li>
          </SuggestionList>
          <p>
            When properly prepared, kontomire is not only safe but also highly
            nutritious, containing high levels of iron, vitamin A, and other
            essential nutrients.
          </p>
        </AnswerText>
      ),
    },
    {
      id: 'i3',
      question: 'What can I substitute for palm oil?',
      answer: (
        <AnswerText>
          <p>
            Palm oil provides a distinctive color and flavor to many Ghanaian
            dishes, but if you need a substitute, consider these options:
          </p>
          <SuggestionList>
            <li>
              <strong>Red Palm Oil Alternatives:</strong> For dishes where the
              red color is important, try a combination of regular cooking oil
              mixed with a small amount of paprika or tomato paste for color.
            </li>
            <li>
              <strong>Health-Conscious Option:</strong> Unrefined coconut oil
              provides a rich tropical flavor, though it won't replicate the
              color of palm oil.
            </li>
            <li>
              <strong>Neutral Substitutes:</strong> For basic cooking functions,
              canola oil, sunflower oil, or olive oil can work, but will not
              replicate the distinctive flavor.
            </li>
          </SuggestionList>
          <HighlightedAnswer>
            <strong>Note:</strong> If sustainability concerns are your reason
            for avoiding palm oil, look for sustainable or organic palm oil that
            is certified by the Roundtable on Sustainable Palm Oil (RSPO).
          </HighlightedAnswer>
          <p>
            While substitutes can work in many recipes, some traditional dishes
            like Red-Red (black-eyed pea stew) rely heavily on palm oil's unique
            properties for their authentic character.
          </p>
        </AnswerText>
      ),
    },
  ],
  cooking: [
    {
      id: 'c1',
      question: 'How do I make perfect fufu?',
      answer: (
        <AnswerText>
          <p>
            Making perfect fufu requires practice, but following these
            guidelines will help:
          </p>
          <SuggestionList>
            <li>
              <strong>Traditional Method:</strong> Boil equal parts cassava and
              plantain until tender. Pound them together in a wooden mortar with
              a pestle, turning and adding water occasionally until smooth and
              elastic (10-15 minutes).
            </li>
            <li>
              <strong>Modern Alternative:</strong> Use a stand mixer with a
              dough hook attachment on medium-low speed. Boil and mash the
              cassava and plantain first, then mix, adding small amounts of
              water until the desired consistency is reached.
            </li>
            <li>
              <strong>Quick Method:</strong> Use store-bought fufu powder.
              Follow the instructions on the package, which typically involves
              mixing with water and heating.
            </li>
          </SuggestionList>
          <HighlightedAnswer>
            <strong>The Perfect Texture:</strong> Good fufu should be smooth,
            slightly elastic, and hold its shape when formed into balls. It
            shouldn't be sticky or grainy. When placing a ball in soup, it
            should maintain its form without dissolving.
          </HighlightedAnswer>
          <p>
            Practice makes perfect with fufu. The texture improves with
            experience, so don't be discouraged if your first attempts aren't
            ideal. You'll develop a feel for the right consistency over time.
          </p>
          <LinksList>
            <SmallButton to='/cooking-tips'>
              Cooking Tips <FiArrowRight />
            </SmallButton>
          </LinksList>
        </AnswerText>
      ),
    },
    {
      id: 'c2',
      question: 'Why does my jollof rice get soggy?',
      answer: (
        <AnswerText>
          <p>
            Soggy jollof rice is a common challenge. Here are the main causes
            and solutions:
          </p>
          <SuggestionList>
            <li>
              <strong>Too much liquid:</strong> The ideal liquid-to-rice ratio
              is about 2:1 for jollof rice. Measure your stock or water
              carefully.
            </li>
            <li>
              <strong>Opening the pot too frequently:</strong> Every time you
              lift the lid, steam escapes and disrupts the cooking process. Try
              to resist checking until the recommended cooking time has passed.
            </li>
            <li>
              <strong>Wrong rice type:</strong> Use long-grain rice varieties
              like jasmine or basmati, which hold their shape better than
              short-grain varieties.
            </li>
            <li>
              <strong>Not parboiling:</strong> For party-style jollof, parboil
              the rice first, drain it, then finish cooking it in the sauce.
            </li>
            <li>
              <strong>Overcrowding the pot:</strong> Use a wide pot with good
              heat distribution rather than a deep, narrow pot.
            </li>
          </SuggestionList>
          <p>
            If your rice is already looking soggy during cooking, remove the
            lid, reduce heat to low, and allow some moisture to evaporate. You
            can also spread it on a baking sheet and dry it in a low oven for a
            few minutes as a rescue method.
          </p>
        </AnswerText>
      ),
    },
    {
      id: 'c3',
      question: 'What tools do I need to start cooking Ghanaian food?',
      answer: (
        <AnswerText>
          <p>
            You can start cooking Ghanaian food with basic kitchen equipment,
            but these specific tools will help create more authentic results:
          </p>
          <SuggestionList>
            <li>
              <strong>Essential Tools:</strong>
              <ul>
                <li>
                  A heavy-bottomed pot or Dutch oven for stews and one-pot
                  dishes
                </li>
                <li>
                  A good blender for processing peppers, onions, tomatoes, and
                  spices
                </li>
                <li>A wooden spatula with a long handle for stirring</li>
              </ul>
            </li>
            <li>
              <strong>Traditional Tools (nice to have):</strong>
              <ul>
                <li>Asanka (clay bowl) for serving and grinding</li>
                <li>Wooden mortar and pestle for making fufu</li>
                <li>Cast iron pot for slow-cooking stews</li>
              </ul>
            </li>
          </SuggestionList>
          <p>
            Most Ghanaian dishes can be made with standard Western kitchen
            equipment, so don't let a lack of traditional tools stop you from
            trying the recipes. As you become more experienced, you might want
            to invest in some authentic tools.
          </p>
          <LinksList>
            <SmallButton to='/kitchen-tools'>
              Kitchen Tools Guide <FiArrowRight />
            </SmallButton>
          </LinksList>
        </AnswerText>
      ),
    },
  ],
  dietary: [
    {
      id: 'd1',
      question: 'Are there vegetarian or vegan Ghanaian dishes?',
      answer: (
        <AnswerText>
          <p>
            Yes! While traditional Ghanaian cuisine often incorporates meat and
            fish, there are several delicious vegetarian and vegan options:
          </p>
          <SuggestionList>
            <li>
              <strong>Red-Red:</strong> A bean stew made with black-eyed peas,
              palm oil, and fried plantains (completely vegan).
            </li>
            <li>
              <strong>Aboboi:</strong> Bambara bean stew, often made with just
              beans and spices.
            </li>
            <li>
              <strong>Vegetable Groundnut (Peanut) Soup:</strong> Can be made
              with just vegetables and peanut paste.
            </li>
            <li>
              <strong>Kontomire Stew:</strong> Cocoyam leaf stew that can be
              made without meat or fish.
            </li>
            <li>
              <strong>Waakye:</strong> Rice and beans dish that's vegetarian by
              nature (check that no meat stock is used).
            </li>
            <li>
              <strong>Kelewele:</strong> Spiced fried plantains that are
              naturally vegan.
            </li>
          </SuggestionList>
          <HighlightedAnswer>
            <strong>Adaptations:</strong> Many other Ghanaian dishes can be
            adapted by simply omitting the meat or fish, or substituting with
            mushrooms, tofu, or tempeh. Just note that traditionally, even
            "vegetable" stews often use fish or meat stock as a base, so when
            dining out, always check about the stock used.
          </HighlightedAnswer>
        </AnswerText>
      ),
    },
    {
      id: 'd2',
      question: 'Is Ghanaian food gluten-free?',
      answer: (
        <AnswerText>
          <p>
            Traditional Ghanaian cuisine is largely gluten-free by nature, as it
            relies on naturally gluten-free staples:
          </p>
          <SuggestionList>
            <li>
              <strong>Naturally Gluten-Free Staples:</strong> Rice, cassava,
              plantain, yam, millet, and corn are the foundation of most
              Ghanaian meals.
            </li>
            <li>
              <strong>Traditional Staple Foods:</strong> Fufu (cassava and
              plantain), banku (fermented corn), kenkey (fermented corn), and
              rice dishes are all naturally gluten-free.
            </li>
            <li>
              <strong>Watch Out For:</strong> Modern adaptations might
              incorporate wheat flour or bouillon cubes/powder that could
              contain gluten. Always check packaged ingredients like:
              <ul>
                <li>Bouillon cubes or powder (may contain wheat)</li>
                <li>Processed sauces or marinades</li>
                <li>Commercially packaged seasonings</li>
              </ul>
            </li>
          </SuggestionList>
          <p>
            When preparing Ghanaian food at home, it's easy to ensure it's
            completely gluten-free by using pure spices and avoiding
            pre-packaged seasoning mixes. When eating out, inquire about
            bouillon cubes and commercial seasonings used in preparation.
          </p>
        </AnswerText>
      ),
    },
    {
      id: 'd3',
      question: 'How spicy is Ghanaian food and can I adjust the heat level?',
      answer: (
        <AnswerText>
          <p>
            Ghanaian food typically ranges from moderately to very spicy, but
            the heat level can easily be adjusted:
          </p>
          <SuggestionList>
            <li>
              <strong>Control the Heat:</strong> When cooking at home, you have
              complete control over the spiciness:
              <ul>
                <li>Reduce the quantity of scotch bonnet peppers</li>
                <li>
                  Remove seeds and membranes from peppers (where most heat
                  resides)
                </li>
                <li>
                  Add peppers whole to stews and remove before serving for
                  flavor without intense heat
                </li>
                <li>
                  Substitute milder peppers like bell peppers for some or all of
                  the hot peppers
                </li>
              </ul>
            </li>
            <li>
              <strong>Balance with Cooling Elements:</strong> Serve spicy dishes
              with cooling sides like avocado or cucumber salad
            </li>
            <li>
              <strong>Less Spicy Options:</strong> Some Ghanaian dishes are
              naturally less spicy, such as plain rice dishes, omo tuo (rice
              balls), and simple fried plantains
            </li>
          </SuggestionList>
          <p>
            In Ghana, it's common practice to serve shito (hot pepper sauce) on
            the side, allowing each person to add heat according to their
            preference. You can adopt this practice at home for family members
            with different spice tolerances.
          </p>
        </AnswerText>
      ),
    },
  ],
  cultural: [
    {
      id: 'cu1',
      question: 'What is the proper way to eat fufu?',
      answer: (
        <AnswerText>
          <p>
            Eating fufu the traditional Ghanaian way is an experience in itself:
          </p>
          <SuggestionList>
            <li>
              <strong>Use your right hand:</strong> In Ghanaian culture, eating
              is traditionally done with the right hand only.
            </li>
            <li>
              <strong>Pinch, don't scoop:</strong> Take a small portion of fufu
              with the tips of your fingers (thumb, index, and middle finger),
              creating a slight depression with your thumb.
            </li>
            <li>
              <strong>Dip into soup:</strong> Dip the pinched fufu into the
              accompanying soup or stew.
            </li>
            <li>
              <strong>Don't chew:</strong> Traditionally, fufu is swallowed
              without chewing. The smooth texture allows it to slide down
              easily.
            </li>
            <li>
              <strong>Swallow gently:</strong> The proper technique is to use
              your tongue to guide the fufu to the back of your throat and
              swallow.
            </li>
          </SuggestionList>
          <HighlightedAnswer>
            <strong>Modern adaptations:</strong> While the traditional method is
            to swallow without chewing, many people today (especially those new
            to fufu) do chew it. This is perfectly acceptable, especially in
            non-traditional settings.
          </HighlightedAnswer>
          <p>
            Remember that it's completely fine to use cutlery if you prefer,
            especially when eating in a formal setting or if you're still
            getting comfortable with hand-eating techniques.
          </p>
        </AnswerText>
      ),
    },
    {
      id: 'cu2',
      question: 'What is the significance of food in Ghanaian culture?',
      answer: (
        <AnswerText>
          <p>Food holds profound cultural significance in Ghanaian society:</p>
          <SuggestionList>
            <li>
              <strong>Community Bonding:</strong> Sharing meals is a fundamental
              way of strengthening family and community bonds. The tradition of
              eating from a communal bowl symbolizes unity and togetherness.
            </li>
            <li>
              <strong>Celebrations and Ceremonies:</strong> Specific foods are
              associated with important life events and festivals. For example,
              Jollof rice is essential at celebrations, and Tuo Zaafi features
              prominently in northern Ghanaian ceremonies.
            </li>
            <li>
              <strong>Expression of Identity:</strong> Regional cuisines reflect
              the history, environment, and cultural identity of Ghana's diverse
              ethnic groups.
            </li>
            <li>
              <strong>Hospitality:</strong> Offering food to guests is
              considered essential Ghanaian hospitality. Refusing offered food
              can be seen as rejecting someone's goodwill.
            </li>
            <li>
              <strong>Traditional Medicine:</strong> Many ingredients used in
              cooking are also valued for their medicinal properties, blurring
              the line between food and medicine.
            </li>
          </SuggestionList>
          <p>
            Food preparation and consumption in Ghana are guided by customs that
            show respect for the food itself and the effort that went into
            preparing it. For example, it's customary to wash hands before and
            after meals, especially when eating with hands from communal bowls.
          </p>
        </AnswerText>
      ),
    },
    {
      id: 'cu3',
      question: 'What are common food etiquette rules in Ghana?',
      answer: (
        <AnswerText>
          <p>
            When enjoying Ghanaian food, especially in traditional or cultural
            settings, these etiquette practices are important:
          </p>
          <SuggestionList>
            <li>
              <strong>Hand usage:</strong> Use only your right hand for eating.
              The left hand is traditionally considered unclean.
            </li>
            <li>
              <strong>Hand washing:</strong> Always wash your hands before and
              after meals. Often, a bowl of water and soap will be provided
              specifically for this purpose.
            </li>
            <li>
              <strong>Elder respect:</strong> Wait for elders to start eating
              before you begin, and don't leave the table before they do.
            </li>
            <li>
              <strong>Communal eating:</strong> When eating from a shared bowl,
              only take food from the portion of the bowl directly in front of
              you.
            </li>
            <li>
              <strong>Food appreciation:</strong> Complimenting the food is
              welcome, but making negative comments about the food is considered
              disrespectful to the host.
            </li>
            <li>
              <strong>Food acceptance:</strong> It's polite to accept food when
              offered. Declining may be interpreted as an insult.
            </li>
          </SuggestionList>
          <HighlightedAnswer>
            <strong>Guest customs:</strong> As a guest, you might be offered the
            first choice of meat or fish (the most valued part of the meal).
            Accepting this honor graciously is expected, though you can take a
            modest portion.
          </HighlightedAnswer>
          <p>
            Remember that these customs may vary between different ethnic groups
            and urban versus rural settings in Ghana. In modern urban settings,
            especially in restaurants, Western dining customs are often
            followed.
          </p>
        </AnswerText>
      ),
    },
  ],
};

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openAccordion, setOpenAccordion] = useState<string | null>('g1'); // Open first question by default
  const [searchTerm, setSearchTerm] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  // Filter FAQs based on search term
  const searchResults = searchTerm
    ? Object.entries(faqData).flatMap(([category, questions]) =>
        questions.filter(
          (item) =>
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            React.Children.toArray(item.answer.props.children).some(
              (child) =>
                typeof child === 'string' &&
                child.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
      )
    : [];

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/resources'>Resources</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>FAQ</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Frequently Asked Questions</PageTitle>
      <PageDescription>
        Find answers to common questions about Ghanaian cuisine, ingredients,
        cooking techniques, and cultural food practices. Browse by category or
        use the search to find specific information.
      </PageDescription>

      <SearchContainer>
        <SearchIcon>
          <FiSearch />
        </SearchIcon>
        <SearchInput
          type='text'
          placeholder='Search questions or keywords...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      {!searchTerm ? (
        <FAQContainer>
          <FAQCategoryTabs>
            <CategoryTab
              $active={activeCategory === 'general'}
              onClick={() => setActiveCategory('general')}>
              General
            </CategoryTab>
            <CategoryTab
              $active={activeCategory === 'ingredients'}
              onClick={() => setActiveCategory('ingredients')}>
              Ingredients
            </CategoryTab>
            <CategoryTab
              $active={activeCategory === 'cooking'}
              onClick={() => setActiveCategory('cooking')}>
              Cooking Techniques
            </CategoryTab>
            <CategoryTab
              $active={activeCategory === 'dietary'}
              onClick={() => setActiveCategory('dietary')}>
              Dietary Concerns
            </CategoryTab>
            <CategoryTab
              $active={activeCategory === 'cultural'}
              onClick={() => setActiveCategory('cultural')}>
              Cultural Practices
            </CategoryTab>
          </FAQCategoryTabs>

          <AccordionContainer>
            {faqData[activeCategory as keyof typeof faqData].map((item) => (
              <AccordionItem key={item.id}>
                <AccordionHeader
                  $isOpen={openAccordion === item.id}
                  onClick={() => toggleAccordion(item.id)}>
                  {item.question}
                  {openAccordion === item.id ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </AccordionHeader>
                <AccordionContent $isOpen={openAccordion === item.id}>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </AccordionContainer>
        </FAQContainer>
      ) : (
        <FAQContainer>
          <SectionTitle>Search Results</SectionTitle>
          {searchResults.length > 0 ? (
            <AccordionContainer>
              {searchResults.map((item) => (
                <AccordionItem key={item.id}>
                  <AccordionHeader
                    $isOpen={openAccordion === item.id}
                    onClick={() => toggleAccordion(item.id)}>
                    {item.question}
                    {openAccordion === item.id ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </AccordionHeader>
                  <AccordionContent $isOpen={openAccordion === item.id}>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </AccordionContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: spacing.xl }}>
              <h3>No FAQs match your search</h3>
              <p>Try different keywords or browse by category</p>
            </div>
          )}
        </FAQContainer>
      )}

      <PageSection>
        <ContactSection>
          <ContactTitle>Didn't find an answer to your question?</ContactTitle>
          <ContactText>
            Our team is here to help with any specific questions about Ghanaian
            cuisine, ingredient sourcing, recipe adaptations, or cultural
            practices around food.
          </ContactText>
          <ContactButton to='/contact'>
            <FiMail /> Contact Us
          </ContactButton>
        </ContactSection>
      </PageSection>

      <PageSection>
        <SectionTitle>Related Resources</SectionTitle>
        <CardGrid>
          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1607635586280-6775adf2a44e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
            <CardContent>
              <CardTitle>Cooking Tips</CardTitle>
              <CardText>
                Master essential techniques for preparing authentic Ghanaian
                dishes with our step-by-step guides.
              </CardText>
              <CardLink
                as={Link}
                to='/cooking-tips'>
                View Tips <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>

          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1575382442464-aa2a9bc3964f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
            <CardContent>
              <CardTitle>Ingredient Guide</CardTitle>
              <CardText>
                Learn about the key ingredients in Ghanaian cooking and how to
                select, store, and prepare them.
              </CardText>
              <CardLink
                as={Link}
                to='/ingredient-guide'>
                Explore Ingredients <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>

          <Card>
            <CardImage backgroundImage='https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' />
            <CardContent>
              <CardTitle>Blog</CardTitle>
              <CardText>
                Discover articles, stories, and insights about Ghanaian cooking
                traditions and culinary practices.
              </CardText>
              <CardLink
                as={Link}
                to='/blog'>
                Read Articles <FiArrowRight />
              </CardLink>
            </CardContent>
          </Card>
        </CardGrid>
      </PageSection>
    </>
  );
};

export default FAQPage;
