import { randomUUID } from 'crypto';
import client from '../database';
import { logger } from '../utils/logger';

// Ghanaian recipes data
const ghanaianRecipes = [
  {
    title: 'Jollof Rice',
    description:
      'A classic Ghanaian one-pot rice dish cooked in a flavorful tomato and pepper sauce.',
    image:
      'https://i0.wp.com/travelandmunchies.com/wp-content/uploads/2022/11/IMG_8133-scaled.jpg?fit=2560%2C1828&ssl=1',
    chef: 'Chef Kwame',
    cook_time: '45 minutes',
    prep_time: '15 minutes',
    total_time: '60 minutes',
    servings: 6,
    difficulty: 'Medium',
    region: 'Greater Accra',
    ingredients: [
      'Basmati rice|3 cups|Rinsed and drained',
      'Tomatoes|6 medium|Blended',
      'Red bell peppers|2|Blended with tomatoes',
      'Scotch bonnet pepper|1|Adjust to taste',
      'Onions|2 large|Finely chopped',
      'Vegetable oil|1/3 cup|',
      'Tomato paste|2 tablespoons|',
      'Chicken stock|3 cups|',
      'Bay leaves|2|',
      'Curry powder|1 tablespoon|',
      'Thyme|1 teaspoon|Dried',
      'Garlic|3 cloves|Minced',
      'Ginger|1 inch|Grated',
      'Salt|To taste|',
      'Black pepper|To taste|',
    ],
    instructions: [
      'In a blender, process tomatoes, red bell peppers, and scotch bonnet pepper until smooth.',
      'Heat oil in a large pot and sauté onions until translucent.',
      'Add tomato paste and fry for 2-3 minutes.',
      'Add the blended tomato mixture and cook on medium heat for 10-15 minutes until reduced.',
      'Add the garlic, ginger, curry powder, thyme, bay leaves, salt, and pepper. Cook for 2-3 minutes.',
      'Add the chicken stock and bring to a boil.',
      'Add the rice, stir, cover, and reduce heat to low.',
      'Cook for 25-30 minutes until rice is tender and the liquid is absorbed.',
      'Fluff with a fork before serving.',
    ],
  },
  {
    title: 'Waakye',
    description:
      'A traditional Ghanaian dish of rice and beans cooked together with dried millet leaves, giving it its characteristic color.',
    image:
      'https://i0.wp.com/www.azmerarestaurant.com/wp-content/uploads/2023/05/Azmera-Waakye-2-jpg.webp?fit=1000%2C1000&ssl=1',
    chef: 'Chef Adjoa',
    cook_time: '1 hour',
    prep_time: '30 minutes',
    total_time: '1 hour 30 minutes',
    servings: 8,
    difficulty: 'Medium',
    region: 'Northern Region',
    ingredients: [
      'Rice|2 cups|Long grain, rinsed',
      'Black-eyed peas|1 cup|Soaked overnight',
      'Dried millet leaves (waakye leaves)|6|',
      'Baking soda|1/2 teaspoon|Optional',
      'Onion|1 large|Chopped',
      'Salt|To taste|',
      'Water|4 cups|',
    ],
    instructions: [
      'Rinse the pre-soaked black-eyed peas and place in a large pot with water.',
      'Add the dried millet leaves (waakye leaves) and baking soda.',
      'Bring to a boil and cook for about 30 minutes until peas are halfway cooked.',
      'Add the rice, onion, and salt to the pot.',
      'Add more water if necessary to cover the rice.',
      'Cover and simmer on low heat until rice and beans are fully cooked (about 20-25 minutes).',
      'Remove the millet leaves before serving.',
      'Traditionally served with stew, spaghetti, garlic sauce, and fried plantain.',
    ],
  },
  {
    title: 'Banku and Tilapia',
    description:
      'Fermented corn and cassava dough balls served with grilled tilapia and hot pepper sauce.',
    image:
      'https://kumasiafricancousin.com/wp-content/uploads/2023/10/IMG-20231019-WA0034.jpg',
    chef: 'Chef Kofi',
    cook_time: '40 minutes',
    prep_time: '20 minutes',
    total_time: '1 hour',
    servings: 4,
    difficulty: 'Medium',
    region: 'Central Region',
    ingredients: [
      'Corn dough|2 cups|Fermented',
      'Cassava dough|1 cup|Fermented',
      'Water|2 cups|',
      'Salt|1 teaspoon|',
      'Whole tilapia|4|Cleaned and scaled',
      'Onion|1 large|Sliced',
      'Ginger|2 tablespoons|Minced',
      'Garlic|4 cloves|Minced',
      'Scotch bonnet pepper|2|Finely chopped',
      'Lemon juice|2 tablespoons|',
      'Vegetable oil|2 tablespoons|',
      'Salt and pepper|To taste|',
      'Fresh tomatoes|3|Chopped for pepper sauce',
      'Onion|1|For pepper sauce',
      'Scotch bonnet peppers|3-4|For pepper sauce',
    ],
    instructions: [
      'For the banku: Mix the corn dough and cassava dough in a bowl with water and salt.',
      'Transfer the mixture to a pot and cook over medium heat, stirring constantly.',
      'Continue stirring as the mixture thickens, for about 15-20 minutes, until it forms a smooth, thick paste.',
      'Form into balls and set aside.',
      'For the tilapia: Mix ginger, garlic, scotch bonnet pepper, lemon juice, oil, salt, and pepper for marinade.',
      'Slash the tilapia on both sides and rub with the marinade.',
      'Let marinate for at least 15 minutes.',
      'Grill the tilapia on a charcoal grill or oven for about 15 minutes, turning once.',
      'For the pepper sauce: Blend tomatoes, onion, and scotch bonnet peppers.',
      'Serve the banku with the grilled tilapia and pepper sauce.',
    ],
  },
  {
    title: 'Fufu and Light Soup',
    description:
      'Pounded cassava and plantain dumplings served with spicy light soup, a Ghanaian favorite.',
    image:
      'https://nyonyogh.com/wp-content/uploads/2024/01/d19188f6dcc876c7181db2797e951b70.jpg',
    chef: 'Chef Akosua',
    cook_time: '1 hour',
    prep_time: '30 minutes',
    total_time: '1 hour 30 minutes',
    servings: 4,
    difficulty: 'Hard',
    region: 'Ashanti Region',
    ingredients: [
      'Cassava|2 medium|Peeled and chopped',
      'Plantain|1 ripe|Peeled and chopped',
      'Goat meat or chicken|500g|Cut into pieces',
      'Tomatoes|3 medium|Chopped',
      'Onions|2 medium|Chopped',
      'Ginger|1 tablespoon|Grated',
      'Garlic|3 cloves|Minced',
      'Scotch bonnet pepper|1|Adjust to taste',
      'Garden eggs (African eggplant)|4|Chopped',
      'Fresh fish|300g|Optional',
      'Water|8 cups|',
      'Salt and pepper|To taste|',
    ],
    instructions: [
      'For the light soup: Boil meat in water with salt and half of the onions until tender.',
      'Add the garden eggs, tomatoes, remaining onions, ginger, garlic, and scotch bonnet pepper.',
      'Simmer for 15 minutes, then add fish if using and cook for another 10 minutes.',
      'Season with salt and pepper to taste.',
      'For the fufu: Boil cassava and plantain until very soft.',
      'Pound in a wooden mortar with a pestle until smooth and elastic.',
      'Alternatively, use a food processor to blend and then cook the blend on low heat, stirring until it forms a smooth dough.',
      'Shape the fufu into balls and serve in bowls with the hot light soup poured over.',
    ],
  },
  {
    title: 'Red Red (Bean Stew)',
    description:
      'A flavorful bean stew cooked in red palm oil, served with fried ripe plantain.',
    image: 'https://i.redd.it/4b754etxllka1.jpg',
    chef: 'Chef Emmanuel',
    cook_time: '50 minutes',
    prep_time: '10 minutes',
    total_time: '1 hour',
    servings: 6,
    difficulty: 'Easy',
    region: 'Volta Region',
    ingredients: [
      'Black-eyed peas|3 cups|Soaked overnight',
      'Palm oil|1/4 cup|',
      'Onions|2 medium|Finely chopped',
      'Tomatoes|3 large|Chopped',
      'Tomato paste|2 tablespoons|',
      'Ginger|1 tablespoon|Grated',
      'Garlic|2 cloves|Minced',
      'Scotch bonnet pepper|1|Finely chopped',
      'Smoked fish|1/2 cup|Flaked (optional)',
      'Bay leaf|1|',
      'Salt|To taste|',
      'Ripe plantains|4|For serving',
      'Vegetable oil|For frying plantains|',
    ],
    instructions: [
      'Rinse the soaked black-eyed peas and cook in water until tender, about 30-40 minutes.',
      'Heat palm oil in a pot and sauté onions until translucent.',
      'Add tomatoes, tomato paste, ginger, garlic, and scotch bonnet pepper.',
      'Cook for 10 minutes until the tomatoes break down.',
      'Add the cooked beans, smoked fish (if using), bay leaf, and salt.',
      'Simmer for 15 minutes, adding water if needed.',
      'For the plantains: Peel and slice ripe plantains diagonally.',
      'Fry in hot oil until golden brown on both sides.',
      'Serve the bean stew with the fried plantains.',
    ],
  },
  {
    title: 'Kelewele',
    description:
      'Spicy fried plantains seasoned with a blend of ginger, cayenne pepper, and other spices.',
    image: 'https://i.ytimg.com/vi/ZK-V07D_0Q4/maxresdefault.jpg',
    chef: 'Chef Abena',
    cook_time: '20 minutes',
    prep_time: '10 minutes',
    total_time: '30 minutes',
    servings: 4,
    difficulty: 'Easy',
    region: 'Greater Accra',
    ingredients: [
      'Ripe plantains|4|Firm but ripe',
      'Ginger|2 tablespoons|Freshly grated',
      'Garlic|3 cloves|Minced',
      'Cayenne pepper|1 teaspoon|',
      'Anise seeds|1/2 teaspoon|Ground',
      'Cloves|1/4 teaspoon|Ground',
      'Nutmeg|1/4 teaspoon|Ground',
      'Salt|1/2 teaspoon|',
      'Onion|1 small|Finely chopped',
      'Vegetable oil|For deep frying|',
    ],
    instructions: [
      'Peel and cut the plantains into small cubes (about 1 inch).',
      'In a bowl, mix ginger, garlic, cayenne pepper, anise seeds, cloves, nutmeg, salt, and onion.',
      'Add a little water to make a paste.',
      'Toss the plantain cubes in the spice mixture, ensuring they are well coated.',
      'Let marinate for 10 minutes.',
      'Heat oil in a deep pan for frying.',
      'Fry the plantain cubes in batches until golden brown and crispy.',
      'Drain on paper towels.',
      'Serve hot as a snack or side dish.',
    ],
  },
  {
    title: 'Tuo Zaafi (TZ)',
    description:
      'A northern Ghanaian dish made from millet or corn flour and served with soup.',
    image:
      'https://i0.wp.com/www.gbcghanaonline.com/wp-content/uploads/2022/03/Tuo-Zaafi.jpg',
    chef: 'Chef Ibrahim',
    cook_time: '45 minutes',
    prep_time: '15 minutes',
    total_time: '1 hour',
    servings: 6,
    difficulty: 'Medium',
    region: 'Northern Region',
    ingredients: [
      'Corn flour|2 cups|',
      'Millet flour|1 cup|',
      'Water|6 cups|',
      'For the soup:|',
      'Beef or goat meat|500g|Cut into pieces',
      'Tomatoes|3 medium|Chopped',
      'Onions|2 medium|Chopped',
      'Okra|10 pods|Sliced',
      'Dawadawa (fermented locust bean)|1 tablespoon|',
      'Ginger|1 tablespoon|Grated',
      'Garlic|2 cloves|Minced',
      'Scotch bonnet pepper|1|To taste',
      'Spinach or kale|2 cups|Chopped',
      'Salt|To taste|',
    ],
    instructions: [
      'For the soup: Boil meat with salt, half the onions, and water until tender.',
      'Add tomatoes, remaining onions, okra, dawadawa, ginger, garlic, and scotch bonnet.',
      'Simmer for 15-20 minutes, then add leafy greens for the last 5 minutes.',
      'For TZ: Bring 4 cups of water to a boil in a large pot.',
      'Mix 1 cup corn flour with 2 cups cold water and stir into the boiling water.',
      'Continue stirring until it thickens slightly.',
      'Add the remaining corn flour and millet flour gradually, stirring vigorously to prevent lumps.',
      'Cook for about 15-20 minutes, stirring frequently until it becomes thick and smooth.',
      'Shape into balls and serve with the soup.',
    ],
  },
  {
    title: 'Kontomire Stew (Palaver Sauce)',
    description:
      'A nutritious Ghanaian stew made from cocoyam leaves (taro leaves) and meats.',
    image: 'https://i.ytimg.com/vi/cM3FZAckOg8/maxresdefault.jpg',
    chef: 'Chef Nana',
    cook_time: '1 hour',
    prep_time: '30 minutes',
    total_time: '1 hour 30 minutes',
    servings: 6,
    difficulty: 'Medium',
    region: 'Eastern Region',
    ingredients: [
      'Cocoyam/taro leaves|2 bunches|Washed and finely chopped',
      'Palm oil|1/4 cup|',
      'Onions|2 medium|Chopped',
      'Tomatoes|3 medium|Chopped',
      'Tomato paste|2 tablespoons|',
      'Beef|300g|Cubed',
      'Smoked fish|200g|Flaked',
      'Crayfish|1/4 cup|Dried and ground',
      'Egusi (melon seeds)|1/2 cup|Ground',
      'Ginger|1 tablespoon|Grated',
      'Garlic|3 cloves|Minced',
      'Scotch bonnet pepper|1|To taste',
      'Salt|To taste|',
    ],
    instructions: [
      'Boil the chopped cocoyam leaves for 10 minutes, drain and set aside.',
      'Heat palm oil in a large pot and sauté onions until translucent.',
      'Add tomatoes, tomato paste, ginger, garlic, and scotch bonnet pepper. Cook for 10 minutes.',
      'Add beef and cook until browned.',
      'Add egusi and stir well, cooking for 5 minutes.',
      'Add the boiled cocoyam leaves, smoked fish, and crayfish.',
      'Simmer on low heat for about 30 minutes, stirring occasionally.',
      'Season with salt to taste.',
      'Serve hot with boiled plantains, yams, rice, or fufu.',
    ],
  },
  {
    title: 'Groundnut (Peanut) Soup',
    description:
      'A rich, creamy soup made with ground peanuts, often served with fufu or rice.',
    image:
      'https://www.seriouseats.com/thmb/RlxyVRR_JeCXwqZh7J3-RrntUB0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2017__06__20170511-groundnut-soup-vicky-wasik-2-2-e832005ef69c473f8f45a0a2a91f7775.jpg',
    chef: 'Chef Ama',
    cook_time: '1 hour',
    prep_time: '20 minutes',
    total_time: '1 hour 20 minutes',
    servings: 6,
    difficulty: 'Medium',
    region: 'Ashanti Region',
    ingredients: [
      'Unsalted peanut butter|1 cup|Natural, no sugar added',
      'Chicken|1kg|Cut into pieces',
      'Tomatoes|4 medium|Chopped',
      'Onions|2 large|Chopped',
      'Ginger|2 tablespoons|Grated',
      'Garlic|4 cloves|Minced',
      'Scotch bonnet pepper|1|To taste',
      'Tomato paste|2 tablespoons|',
      'Water or chicken stock|6 cups|',
      'Salt|To taste|',
      'Mushrooms|1 cup|Optional',
      'Smoked fish|200g|Flaked (optional)',
    ],
    instructions: [
      'Season chicken with salt and boil in water or stock until tender, about 30 minutes.',
      'In a blender, process tomatoes, onions, ginger, garlic, and scotch bonnet pepper.',
      'Add the blended mixture and tomato paste to the pot with chicken.',
      'Simmer for 10 minutes, then add the peanut butter.',
      'Stir well and simmer for another 20-30 minutes on low heat, stirring occasionally to prevent burning.',
      'Add mushrooms and smoked fish if using and cook for another 10 minutes.',
      'Adjust salt to taste.',
      'Serve hot with fufu, rice balls, or omo tuo (rice balls).',
    ],
  },
  {
    title: 'Kenkey and Fish',
    description:
      'Fermented corn dough dumplings wrapped in corn husks or banana leaves, served with fried fish and pepper sauce.',
    image:
      'https://141832043.cdn6.editmysite.com/uploads/1/4/1/8/141832043/S43GT3EOJPOM7XM4Q535AHIA.jpeg',
    chef: 'Chef Kojo',
    cook_time: '2 hours',
    prep_time: '24 hours',
    total_time: '26 hours',
    servings: 8,
    difficulty: 'Hard',
    region: 'Central Region',
    ingredients: [
      'Corn dough|4 cups|Fermented for 2-3 days',
      'Salt|1 tablespoon|',
      'Water|As needed|',
      'Corn husks or banana leaves|For wrapping|',
      'Tilapia or mackerel|4 whole fish|Cleaned and scaled',
      'Garlic|4 cloves|Minced',
      'Ginger|1 tablespoon|Grated',
      'Salt and pepper|To taste|',
      'Vegetable oil|For frying fish|',
      'For pepper sauce:|',
      'Fresh tomatoes|4|',
      'Onion|1 large|',
      'Scotch bonnet peppers|3-4|Adjust to taste',
      'Salt|To taste|',
    ],
    instructions: [
      'Divide the fermented corn dough into two equal parts.',
      'Cook one part in a pot with a little water, stirring constantly until it becomes a thick paste.',
      'Mix the cooked portion with the uncooked portion and add salt.',
      'Knead thoroughly until well combined.',
      'Divide into portions and wrap tightly in corn husks or banana leaves.',
      'Place the wrapped dough in a large pot with water and boil for about 1-2 hours.',
      'For the fish: Season fish with garlic, ginger, salt, and pepper.',
      'Deep fry until golden and crispy.',
      'For pepper sauce: Blend tomatoes, onion, and scotch bonnet peppers.',
      'Season with salt and set aside.',
      'Serve the kenkey with fried fish and pepper sauce.',
    ],
  },
];

/**
 * Script to clear all data from tables and populate with Ghanaian recipes
 */
async function clearAndPopulateTables() {
  try {
    // Connect to the database
    logger.info(
      'Starting to clear and populate tables with Ghanaian recipes...'
    );

    // Begin transaction
    await client.query('BEGIN');

    // Clear existing data
    logger.info('Clearing existing data from tables...');
    await client.query('DELETE FROM ingredients');
    await client.query('DELETE FROM instructions');
    await client.query('DELETE FROM recipes');

    logger.info('Tables cleared successfully.');

    // Add new Ghanaian recipes
    logger.info('Adding 10 Ghanaian recipes...');

    // Loop through each recipe and insert into database
    for (const recipe of ghanaianRecipes) {
      const recipeId = randomUUID();
      const currentDate = new Date();

      // Insert recipe
      await client.query(
        `INSERT INTO recipes (
          id, title, description, image, chef, cook_time, prep_time,
          total_time, servings, difficulty, created_at, updated_at, region
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          recipeId,
          recipe.title,
          recipe.description,
          recipe.image,
          recipe.chef,
          recipe.cook_time,
          recipe.prep_time,
          recipe.total_time,
          recipe.servings,
          recipe.difficulty,
          currentDate,
          currentDate,
          recipe.region,
        ]
      );

      // Insert ingredients
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        for (const ingredient of recipe.ingredients) {
          const parts = ingredient.split('|');
          const name = parts[0] || '';
          const amount = parts[1] || '';
          const notes = parts[2] || '';

          await client.query(
            'INSERT INTO ingredients (id, recipe_id, name, amount, notes, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [
              randomUUID(),
              recipeId,
              name,
              amount,
              notes,
              currentDate,
              currentDate,
            ]
          );
        }
      }

      // Insert instructions
      if (recipe.instructions && recipe.instructions.length > 0) {
        for (let i = 0; i < recipe.instructions.length; i++) {
          await client.query(
            'INSERT INTO instructions (id, recipe_id, step_number, text, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)',
            [
              randomUUID(),
              recipeId,
              i + 1,
              recipe.instructions[i],
              currentDate,
              currentDate,
            ]
          );
        }
      }

      logger.info(`Added recipe: ${recipe.title}`);
    }

    // Commit transaction
    await client.query('COMMIT');

    logger.info('Successfully added 10 Ghanaian recipes to the database.');
    return true;
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    logger.error(
      `Error populating database: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    return false;
  }
}

// Execute the function if this script is run directly
if (require.main === module) {
  clearAndPopulateTables()
    .then(() => {
      logger.info('Script execution completed.');
      process.exit(0);
    })
    .catch((error) => {
      logger.error(
        `Script execution failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      process.exit(1);
    });
}

export { clearAndPopulateTables };
