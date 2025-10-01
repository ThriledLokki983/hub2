/**
 * Script to seed recipes data into the database
 * Run with: node src/scripts/seed-recipes.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
require('dotenv').config();

// Load environment variables for database connection
const { POSTGRES_HOST = 'localhost', POSTGRES_PORT = 5432, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

// Create a pool connection
const pool = new Pool({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD || undefined,
  database: POSTGRES_DB,
});

// Sample recipe data
const recipes = [
  {
    title: 'Classic Spaghetti Carbonara',
    description: 'A traditional Italian pasta dish with eggs, cheese, pancetta and black pepper.',
    chef: 'Mario Rossi',
    category: 'Italian',
    tags: ['pasta', 'dinner', 'italian', 'quick'],
    prep_time: 10,
    cook_time: 15,
    total_time: 25,
    servings: 4,
    difficulty: 'Intermediate',
    calories: 450,
    protein: 18,
    fat: 20,
    carbohydrates: 50,
    source: 'Traditional Italian Recipe',
    ingredients: [
      { name: 'Spaghetti', quantity: '400', unit: 'g' },
      { name: 'Eggs', quantity: '4', unit: 'large' },
      { name: 'Pecorino Romano cheese', quantity: '50', unit: 'g' },
      { name: 'Pancetta', quantity: '150', unit: 'g', notes: 'Cubed' },
      { name: 'Black pepper', quantity: '2', unit: 'tsp', notes: 'Freshly ground' },
      { name: 'Salt', quantity: '1', unit: 'tsp' },
    ],
    instructions: [
      { step_number: 1, instruction: 'Bring a large pot of salted water to boil and cook the spaghetti according to package instructions.' },
      { step_number: 2, instruction: 'While pasta is cooking, fry the pancetta in a large pan until crispy.' },
      { step_number: 3, instruction: 'In a bowl, whisk together the eggs, grated cheese, and black pepper.' },
      { step_number: 4, instruction: 'Drain the pasta, reserving about 1/2 cup of pasta water.' },
      { step_number: 5, instruction: 'Working quickly, add hot pasta to the pan with pancetta, remove from heat.' },
      { step_number: 6, instruction: 'Pour egg mixture over pasta, stirring quickly to create a creamy sauce. Add pasta water if needed.' },
      { step_number: 7, instruction: 'Season with salt if needed and serve immediately with extra grated cheese and black pepper.' },
    ],
  },
  {
    title: 'Healthy Quinoa Salad',
    description: 'A refreshing and nutritious salad with quinoa, vegetables, and feta cheese.',
    chef: 'Emma Green',
    category: 'Salad',
    tags: ['vegetarian', 'healthy', 'lunch', 'quinoa'],
    prep_time: 15,
    cook_time: 20,
    total_time: 35,
    servings: 6,
    difficulty: 'Easy',
    calories: 280,
    protein: 9,
    fat: 12,
    carbohydrates: 35,
    source: 'Healthy Eating Magazine',
    ingredients: [
      { name: 'Quinoa', quantity: '1', unit: 'cup' },
      { name: 'Water', quantity: '2', unit: 'cups' },
      { name: 'Cucumber', quantity: '1', unit: 'medium', notes: 'Diced' },
      { name: 'Cherry tomatoes', quantity: '1', unit: 'cup', notes: 'Halved' },
      { name: 'Red bell pepper', quantity: '1', unit: 'medium', notes: 'Diced' },
      { name: 'Red onion', quantity: '1/2', unit: '', notes: 'Finely chopped' },
      { name: 'Kalamata olives', quantity: '1/2', unit: 'cup', notes: 'Pitted and halved' },
      { name: 'Feta cheese', quantity: '100', unit: 'g', notes: 'Crumbled' },
      { name: 'Fresh parsley', quantity: '1/4', unit: 'cup', notes: 'Chopped' },
      { name: 'Fresh mint', quantity: '2', unit: 'tbsp', notes: 'Chopped' },
      { name: 'Olive oil', quantity: '3', unit: 'tbsp' },
      { name: 'Lemon juice', quantity: '2', unit: 'tbsp' },
      { name: 'Salt', quantity: '1/2', unit: 'tsp' },
      { name: 'Black pepper', quantity: '1/4', unit: 'tsp' },
    ],
    instructions: [
      { step_number: 1, instruction: 'Rinse quinoa under cold water using a fine mesh strainer.' },
      {
        step_number: 2,
        instruction:
          'In a medium saucepan, combine quinoa and water. Bring to a boil, then reduce heat to low and cover. Simmer for 15 minutes or until water is absorbed.',
      },
      { step_number: 3, instruction: 'Remove from heat and let stand for 5 minutes, then fluff with a fork and allow to cool completely.' },
      {
        step_number: 4,
        instruction: 'In a large bowl, combine cooled quinoa, cucumber, tomatoes, bell pepper, red onion, olives, feta cheese, parsley, and mint.',
      },
      { step_number: 5, instruction: 'In a small bowl, whisk together olive oil, lemon juice, salt, and pepper to make the dressing.' },
      { step_number: 6, instruction: 'Pour the dressing over the salad and toss gently to combine. Adjust seasoning if necessary.' },
      { step_number: 7, instruction: 'Refrigerate for at least 30 minutes before serving to allow flavors to meld together.' },
    ],
  },
  {
    title: 'Chocolate Brownie Delight',
    description: 'Rich, fudgy chocolate brownies that are perfect for dessert or a sweet treat.',
    chef: 'James Baker',
    category: 'Dessert',
    tags: ['chocolate', 'dessert', 'baking', 'sweet'],
    prep_time: 15,
    cook_time: 25,
    total_time: 40,
    servings: 16,
    difficulty: 'Easy',
    calories: 320,
    protein: 4,
    fat: 18,
    carbohydrates: 38,
    source: "Baker's Delight Cookbook",
    ingredients: [
      { name: 'Unsalted butter', quantity: '200', unit: 'g' },
      { name: 'Dark chocolate', quantity: '200', unit: 'g', notes: '70% cocoa solids' },
      { name: 'Granulated sugar', quantity: '250', unit: 'g' },
      { name: 'Eggs', quantity: '3', unit: 'large' },
      { name: 'Vanilla extract', quantity: '1', unit: 'tsp' },
      { name: 'All-purpose flour', quantity: '100', unit: 'g' },
      { name: 'Cocoa powder', quantity: '30', unit: 'g', notes: 'Unsweetened' },
      { name: 'Salt', quantity: '1/4', unit: 'tsp' },
      { name: 'Chocolate chips', quantity: '100', unit: 'g', notes: 'Optional' },
    ],
    instructions: [
      { step_number: 1, instruction: 'Preheat the oven to 350°F (180°C). Line an 8-inch square baking pan with parchment paper.' },
      {
        step_number: 2,
        instruction: 'In a heatproof bowl, melt the butter and dark chocolate together over a pan of simmering water, stirring occasionally.',
      },
      { step_number: 3, instruction: 'Once melted, remove from heat and whisk in the sugar until well combined.' },
      { step_number: 4, instruction: 'Add the eggs one at a time, whisking well after each addition. Stir in the vanilla extract.' },
      { step_number: 5, instruction: 'Sift in the flour, cocoa powder, and salt, then fold gently until just combined.' },
      { step_number: 6, instruction: 'If using, fold in the chocolate chips.' },
      { step_number: 7, instruction: 'Pour the batter into the prepared pan and smooth the top.' },
      { step_number: 8, instruction: 'Bake for 25-30 minutes, or until the top is cracked but the middle is still slightly gooey.' },
      { step_number: 9, instruction: 'Let cool completely in the pan before cutting into squares.' },
    ],
  },
  {
    title: 'Spicy Thai Green Curry',
    description: 'A fragrant and spicy Thai curry with coconut milk, vegetables and your choice of protein.',
    chef: 'Somboon Chai',
    category: 'Thai',
    tags: ['thai', 'curry', 'dinner', 'spicy', 'asian'],
    prep_time: 20,
    cook_time: 25,
    total_time: 45,
    servings: 4,
    difficulty: 'Intermediate',
    calories: 420,
    protein: 25,
    fat: 30,
    carbohydrates: 15,
    source: 'Traditional Thai Cooking',
    ingredients: [
      { name: 'Green curry paste', quantity: '3', unit: 'tbsp' },
      { name: 'Coconut milk', quantity: '400', unit: 'ml', notes: 'Full fat' },
      { name: 'Chicken breast', quantity: '500', unit: 'g', notes: 'Cut into bite-sized pieces (or use tofu for vegetarian)' },
      { name: 'Fish sauce', quantity: '2', unit: 'tbsp' },
      { name: 'Palm sugar or brown sugar', quantity: '2', unit: 'tsp' },
      { name: 'Kaffir lime leaves', quantity: '4', unit: '', notes: 'Torn' },
      { name: 'Thai basil leaves', quantity: '1', unit: 'handful' },
      { name: 'Bell pepper', quantity: '1', unit: '', notes: 'Sliced' },
      { name: 'Eggplant', quantity: '1', unit: 'small', notes: 'Cut into chunks' },
      { name: 'Green beans', quantity: '100', unit: 'g', notes: 'Trimmed' },
      { name: 'Bamboo shoots', quantity: '100', unit: 'g', notes: 'Drained if from a can' },
      { name: 'Coconut oil', quantity: '2', unit: 'tbsp' },
      { name: 'Thai red chilies', quantity: '2', unit: '', notes: 'Sliced (optional for extra heat)' },
    ],
    instructions: [
      { step_number: 1, instruction: 'Heat the coconut oil in a large pan or wok over medium heat.' },
      { step_number: 2, instruction: 'Add the curry paste and cook for 1-2 minutes until fragrant, stirring constantly.' },
      { step_number: 3, instruction: 'Add 1/3 of the coconut milk and simmer until the oil separates and rises to the surface.' },
      {
        step_number: 4,
        instruction: 'Add the chicken and stir to coat with the curry mixture. Cook for 5 minutes until the chicken starts to turn white.',
      },
      { step_number: 5, instruction: 'Add the remaining coconut milk, fish sauce, palm sugar, and kaffir lime leaves.' },
      { step_number: 6, instruction: 'Add the eggplant and simmer for 5 minutes.' },
      {
        step_number: 7,
        instruction:
          'Add the bell pepper, green beans, and bamboo shoots and cook for another 5-7 minutes until the vegetables are tender and chicken is cooked through.',
      },
      { step_number: 8, instruction: 'Taste and adjust seasoning with more fish sauce or sugar if needed.' },
      { step_number: 9, instruction: 'Stir in the Thai basil leaves and sliced chilies (if using) just before serving.' },
      { step_number: 10, instruction: 'Serve hot with steamed jasmine rice.' },
    ],
  },
  {
    title: 'Homemade Beef Burger',
    description: 'Juicy homemade beef burgers with all the trimmings.',
    chef: 'Bobby Grills',
    category: 'American',
    tags: ['burger', 'beef', 'dinner', 'american', 'barbecue'],
    prep_time: 20,
    cook_time: 15,
    total_time: 35,
    servings: 4,
    difficulty: 'Easy',
    calories: 550,
    protein: 32,
    fat: 35,
    carbohydrates: 28,
    source: 'Grillmaster Cookbook',
    ingredients: [
      { name: 'Ground beef', quantity: '800', unit: 'g', notes: '80% lean' },
      { name: 'Onion', quantity: '1', unit: 'small', notes: 'Finely diced' },
      { name: 'Garlic', quantity: '2', unit: 'cloves', notes: 'Minced' },
      { name: 'Worcestershire sauce', quantity: '2', unit: 'tbsp' },
      { name: 'Egg', quantity: '1', unit: 'large' },
      { name: 'Salt', quantity: '1', unit: 'tsp' },
      { name: 'Black pepper', quantity: '1/2', unit: 'tsp' },
      { name: 'Burger buns', quantity: '4', unit: '', notes: 'Split and lightly toasted' },
      { name: 'Cheese slices', quantity: '4', unit: '', notes: 'Cheddar or American' },
      { name: 'Lettuce leaves', quantity: '4', unit: 'large' },
      { name: 'Tomato', quantity: '1', unit: 'large', notes: 'Sliced' },
      { name: 'Red onion', quantity: '1', unit: 'small', notes: 'Sliced into rings' },
      { name: 'Pickles', quantity: '8', unit: 'slices' },
      { name: 'Ketchup', quantity: '', unit: 'to taste' },
      { name: 'Mustard', quantity: '', unit: 'to taste' },
      { name: 'Mayonnaise', quantity: '', unit: 'to taste' },
    ],
    instructions: [
      {
        step_number: 1,
        instruction:
          "In a large bowl, combine ground beef, diced onion, garlic, Worcestershire sauce, egg, salt, and pepper. Mix gently until just combined, don't overwork the meat.",
      },
      {
        step_number: 2,
        instruction:
          'Divide the mixture into 4 equal portions and form into patties, making them slightly larger than your buns as they will shrink when cooking.',
      },
      {
        step_number: 3,
        instruction: 'Press a small dimple in the center of each patty with your thumb to prevent it from puffing up during cooking.',
      },
      {
        step_number: 4,
        instruction: 'Preheat a grill or skillet to medium-high heat. Cook the patties for about 4-5 minutes per side for medium doneness.',
      },
      { step_number: 5, instruction: 'During the last minute of cooking, add a cheese slice to each patty and allow it to melt.' },
      { step_number: 6, instruction: 'Toast the burger buns lightly on the grill or in a toaster.' },
      {
        step_number: 7,
        instruction:
          'Spread condiments of your choice on the bottom bun, then layer with lettuce, burger patty with melted cheese, tomato slices, red onion, and pickles.',
      },
      { step_number: 8, instruction: 'Top with the other half of the bun and serve immediately.' },
    ],
  },
  {
    title: 'Fresh Guacamole',
    description: 'Classic Mexican guacamole with fresh avocados, lime, and cilantro.',
    chef: 'Miguel Rodriguez',
    category: 'Mexican',
    tags: ['appetizer', 'mexican', 'dip', 'vegetarian', 'vegan'],
    prep_time: 15,
    cook_time: 0,
    total_time: 15,
    servings: 6,
    difficulty: 'Easy',
    calories: 180,
    protein: 2,
    fat: 16,
    carbohydrates: 9,
    source: 'Authentic Mexican Cuisine',
    ingredients: [
      { name: 'Ripe avocados', quantity: '3', unit: 'large' },
      { name: 'Lime', quantity: '1', unit: '', notes: 'Juiced' },
      { name: 'Red onion', quantity: '1/4', unit: 'cup', notes: 'Finely diced' },
      { name: 'Fresh cilantro', quantity: '2', unit: 'tbsp', notes: 'Chopped' },
      { name: 'Jalapeño', quantity: '1', unit: 'small', notes: 'Seeds removed, finely diced' },
      { name: 'Garlic', quantity: '1', unit: 'clove', notes: 'Minced' },
      { name: 'Tomato', quantity: '1', unit: 'medium', notes: 'Diced, seeds removed' },
      { name: 'Salt', quantity: '1/2', unit: 'tsp', notes: 'Or to taste' },
      { name: 'Black pepper', quantity: '1/4', unit: 'tsp' },
      { name: 'Tortilla chips', quantity: '', unit: 'for serving' },
    ],
    instructions: [
      { step_number: 1, instruction: 'Cut the avocados in half, remove the pits, and scoop the flesh into a bowl.' },
      { step_number: 2, instruction: 'Add the lime juice and mash the avocados to your desired consistency using a fork or potato masher.' },
      { step_number: 3, instruction: 'Add the diced red onion, cilantro, jalapeño, garlic, and tomato to the mashed avocado.' },
      { step_number: 4, instruction: 'Season with salt and pepper, then gently stir to combine all ingredients.' },
      { step_number: 5, instruction: 'Taste and adjust seasoning as needed with more lime juice, salt, or pepper.' },
      {
        step_number: 6,
        instruction:
          'Serve immediately with tortilla chips or cover with plastic wrap pressed directly onto the surface to prevent browning if serving later.',
      },
    ],
  },
  {
    title: 'Japanese Chicken Katsu Curry',
    description: 'Crispy breaded chicken cutlets served with a savory curry sauce.',
    chef: 'Haruki Tanaka',
    category: 'Japanese',
    tags: ['japanese', 'curry', 'chicken', 'dinner', 'asian'],
    prep_time: 20,
    cook_time: 25,
    total_time: 45,
    servings: 4,
    difficulty: 'Intermediate',
    calories: 650,
    protein: 35,
    fat: 28,
    carbohydrates: 65,
    source: 'Modern Japanese Cooking',
    ingredients: [
      { name: 'Chicken breasts', quantity: '4', unit: '', notes: 'Boneless, skinless' },
      { name: 'Salt', quantity: '1', unit: 'tsp' },
      { name: 'Black pepper', quantity: '1/2', unit: 'tsp' },
      { name: 'All-purpose flour', quantity: '1/2', unit: 'cup' },
      { name: 'Eggs', quantity: '2', unit: '', notes: 'Beaten' },
      { name: 'Panko breadcrumbs', quantity: '2', unit: 'cups' },
      { name: 'Vegetable oil', quantity: '', unit: 'for frying' },
      { name: 'Onion', quantity: '1', unit: 'large', notes: 'Diced' },
      { name: 'Carrot', quantity: '2', unit: 'medium', notes: 'Diced' },
      { name: 'Potato', quantity: '2', unit: 'medium', notes: 'Peeled and diced' },
      { name: 'Garlic', quantity: '2', unit: 'cloves', notes: 'Minced' },
      { name: 'Ginger', quantity: '1', unit: 'tbsp', notes: 'Grated' },
      { name: 'Curry powder', quantity: '3', unit: 'tbsp' },
      { name: 'Garam masala', quantity: '1', unit: 'tsp' },
      { name: 'Chicken stock', quantity: '3', unit: 'cups' },
      { name: 'Soy sauce', quantity: '1', unit: 'tbsp' },
      { name: 'Honey or sugar', quantity: '2', unit: 'tsp' },
      { name: 'Cornstarch', quantity: '1', unit: 'tbsp', notes: 'Mixed with 2 tbsp water' },
      { name: 'Cooked rice', quantity: '4', unit: 'cups', notes: 'For serving' },
    ],
    instructions: [
      { step_number: 1, instruction: 'Place each chicken breast between plastic wrap and pound to an even thickness, about 1/2 inch thick.' },
      { step_number: 2, instruction: 'Season the chicken with salt and pepper on both sides.' },
      { step_number: 3, instruction: 'Set up a breading station with flour, beaten eggs, and panko breadcrumbs in separate shallow dishes.' },
      {
        step_number: 4,
        instruction: 'Dredge each chicken piece in flour, then dip in egg, and finally coat with panko breadcrumbs, pressing to adhere.',
      },
      {
        step_number: 5,
        instruction:
          'Heat oil in a large frying pan to 350°F (175°C). Fry the chicken for 4-5 minutes per side until golden brown and cooked through. Transfer to a wire rack to drain.',
      },
      {
        step_number: 6,
        instruction:
          'For the curry sauce, heat 2 tablespoons of oil in a large pot over medium heat. Add onion, carrot, and potato, and cook for 5 minutes until softened.',
      },
      { step_number: 7, instruction: 'Add garlic and ginger and cook for another minute until fragrant.' },
      { step_number: 8, instruction: 'Stir in curry powder and garam masala, cooking for 30 seconds until fragrant.' },
      {
        step_number: 9,
        instruction:
          'Pour in the chicken stock, soy sauce, and honey. Bring to a boil, then reduce heat and simmer for about 15 minutes until vegetables are tender.',
      },
      { step_number: 10, instruction: 'Stir in the cornstarch slurry and simmer until the sauce thickens, about 2-3 minutes.' },
      { step_number: 11, instruction: 'Slice the chicken katsu into strips and serve over rice with curry sauce poured over the top.' },
    ],
  },
  {
    title: 'Mediterranean Greek Salad',
    description: 'A fresh and simple Greek salad with feta cheese, olives, and a homemade dressing.',
    chef: 'Eleni Papadopoulos',
    category: 'Mediterranean',
    tags: ['salad', 'vegetarian', 'greek', 'healthy', 'lunch'],
    prep_time: 15,
    cook_time: 0,
    total_time: 15,
    servings: 4,
    difficulty: 'Easy',
    calories: 210,
    protein: 6,
    fat: 18,
    carbohydrates: 8,
    source: 'Greek Island Cooking',
    ingredients: [
      { name: 'Cucumber', quantity: '1', unit: 'large', notes: 'Cut into chunks' },
      { name: 'Tomatoes', quantity: '4', unit: 'medium', notes: 'Cut into wedges' },
      { name: 'Red onion', quantity: '1/2', unit: '', notes: 'Thinly sliced' },
      { name: 'Green bell pepper', quantity: '1', unit: '', notes: 'Sliced' },
      { name: 'Kalamata olives', quantity: '1/2', unit: 'cup', notes: 'Pitted' },
      { name: 'Feta cheese', quantity: '200', unit: 'g', notes: 'Cubed or crumbled' },
      { name: 'Extra virgin olive oil', quantity: '1/4', unit: 'cup' },
      { name: 'Red wine vinegar', quantity: '2', unit: 'tbsp' },
      { name: 'Dried oregano', quantity: '1', unit: 'tsp' },
      { name: 'Salt', quantity: '1/2', unit: 'tsp' },
      { name: 'Black pepper', quantity: '1/4', unit: 'tsp' },
    ],
    instructions: [
      { step_number: 1, instruction: 'In a large bowl, combine cucumber, tomatoes, red onion, bell pepper, and Kalamata olives.' },
      {
        step_number: 2,
        instruction: 'In a small bowl, whisk together olive oil, red wine vinegar, dried oregano, salt, and pepper to make the dressing.',
      },
      { step_number: 3, instruction: 'Pour the dressing over the salad and toss gently to combine.' },
      { step_number: 4, instruction: 'Add the feta cheese and give it one more light toss to incorporate.' },
      { step_number: 5, instruction: 'Serve immediately or refrigerate for up to 30 minutes before serving to allow flavors to meld.' },
    ],
  },
  {
    title: 'Classic French Crème Brûlée',
    description: 'A rich custard topped with a layer of hard caramelized sugar.',
    chef: 'Pierre Dubois',
    category: 'French',
    tags: ['dessert', 'french', 'custard', 'elegant'],
    prep_time: 20,
    cook_time: 35,
    total_time: 55,
    servings: 6,
    difficulty: 'Intermediate',
    calories: 380,
    protein: 6,
    fat: 32,
    carbohydrates: 18,
    source: 'French Patisserie Classics',
    ingredients: [
      { name: 'Heavy cream', quantity: '600', unit: 'ml' },
      { name: 'Vanilla bean', quantity: '1', unit: '', notes: 'Split and scraped (or 1 tsp vanilla extract)' },
      { name: 'Egg yolks', quantity: '6', unit: 'large' },
      { name: 'Granulated sugar', quantity: '100', unit: 'g', notes: 'Plus extra for topping' },
      { name: 'Salt', quantity: '1/4', unit: 'tsp' },
    ],
    instructions: [
      { step_number: 1, instruction: 'Preheat the oven to 325°F (165°C).' },
      {
        step_number: 2,
        instruction:
          'In a saucepan, heat the cream and vanilla bean (if using) over medium heat until it just begins to simmer. Remove from heat and let infuse for 10 minutes. If using vanilla extract, add it now.',
      },
      { step_number: 3, instruction: 'In a bowl, whisk together egg yolks, sugar, and salt until light and slightly thickened.' },
      { step_number: 4, instruction: 'Slowly pour the warm cream into the egg mixture, whisking constantly to prevent the eggs from cooking.' },
      { step_number: 5, instruction: 'Strain the mixture through a fine sieve to remove any lumps and the vanilla pod.' },
      { step_number: 6, instruction: 'Place six ramekins in a large baking dish and divide the custard mixture evenly among them.' },
      { step_number: 7, instruction: 'Fill the baking dish with hot water to reach halfway up the sides of the ramekins, creating a water bath.' },
      { step_number: 8, instruction: 'Bake for 30-35 minutes, or until the custards are just set but still slightly jiggly in the center.' },
      { step_number: 9, instruction: 'Remove from the water bath and cool completely, then refrigerate for at least 4 hours or overnight.' },
      { step_number: 10, instruction: 'Just before serving, sprinkle a thin, even layer of sugar over each custard.' },
      {
        step_number: 11,
        instruction:
          'Use a kitchen torch to caramelize the sugar until it bubbles and turns amber, or place under a broiler for 2-3 minutes, watching carefully.',
      },
      { step_number: 12, instruction: 'Allow the caramelized sugar to harden for a minute or two before serving.' },
    ],
  },
  {
    title: 'Traditional Indian Butter Chicken',
    description: 'Tender chicken in a rich, creamy tomato sauce flavored with Indian spices.',
    chef: 'Raj Patel',
    category: 'Indian',
    tags: ['indian', 'curry', 'chicken', 'dinner', 'spicy'],
    prep_time: 30,
    cook_time: 40,
    total_time: 70,
    servings: 6,
    difficulty: 'Intermediate',
    calories: 520,
    protein: 32,
    fat: 38,
    carbohydrates: 15,
    source: 'North Indian Gastronomy',
    ingredients: [
      { name: 'Boneless chicken thighs', quantity: '700', unit: 'g', notes: 'Cut into 2-inch pieces' },
      { name: 'Yogurt', quantity: '1/2', unit: 'cup', notes: 'Plain' },
      { name: 'Lemon juice', quantity: '1', unit: 'tbsp' },
      { name: 'Garam masala', quantity: '1', unit: 'tsp' },
      { name: 'Ground turmeric', quantity: '1/2', unit: 'tsp' },
      { name: 'Ground cumin', quantity: '1', unit: 'tsp' },
      { name: 'Chili powder', quantity: '1', unit: 'tsp', notes: 'Adjust to taste' },
      { name: 'Ginger paste', quantity: '1', unit: 'tbsp' },
      { name: 'Garlic paste', quantity: '1', unit: 'tbsp' },
      { name: 'Salt', quantity: '1', unit: 'tsp' },
      { name: 'Ghee or butter', quantity: '3', unit: 'tbsp' },
      { name: 'Onion', quantity: '1', unit: 'large', notes: 'Finely diced' },
      { name: 'Tomato puree', quantity: '400', unit: 'g' },
      { name: 'Tomato paste', quantity: '2', unit: 'tbsp' },
      { name: 'Heavy cream', quantity: '1', unit: 'cup' },
      { name: 'Kasuri methi (dried fenugreek leaves)', quantity: '1', unit: 'tbsp', notes: 'Crushed' },
      { name: 'Sugar', quantity: '1', unit: 'tsp' },
      { name: 'Fresh cilantro', quantity: '2', unit: 'tbsp', notes: 'Chopped, for garnish' },
      { name: 'Naan bread', quantity: '', unit: 'for serving' },
      { name: 'Basmati rice', quantity: '', unit: 'for serving' },
    ],
    instructions: [
      {
        step_number: 1,
        instruction: 'In a large bowl, mix yogurt, lemon juice, garam masala, turmeric, cumin, chili powder, ginger paste, garlic paste, and salt.',
      },
      {
        step_number: 2,
        instruction: 'Add chicken pieces and coat well with the marinade. Cover and refrigerate for at least 30 minutes, preferably 2-4 hours.',
      },
      {
        step_number: 3,
        instruction:
          'Preheat oven to 425°F (220°C). Place marinated chicken pieces on a baking sheet and bake for 15 minutes, or until partially cooked.',
      },
      {
        step_number: 4,
        instruction:
          'Meanwhile, heat ghee or butter in a large, deep pan over medium heat. Add diced onion and sauté until golden brown, about 5-6 minutes.',
      },
      {
        step_number: 5,
        instruction:
          'Add tomato puree and tomato paste, and cook for 10-15 minutes, stirring occasionally, until the sauce thickens and oil begins to separate.',
      },
      { step_number: 6, instruction: 'Reduce heat to low and add the partially cooked chicken pieces along with any juices from the baking sheet.' },
      { step_number: 7, instruction: 'Simmer for 10 minutes, then stir in the heavy cream and continue to cook for 5 more minutes.' },
      { step_number: 8, instruction: 'Crush the kasuri methi between your palms and add to the curry along with sugar. Stir well.' },
      { step_number: 9, instruction: 'Taste and adjust seasoning with salt as needed.' },
      { step_number: 10, instruction: 'Garnish with fresh cilantro and serve hot with naan bread and basmati rice.' },
    ],
  },
];

// Get a user ID from the database to associate with recipes
async function getUserId() {
  try {
    const { rows } = await pool.query('SELECT id FROM users LIMIT 1');

    if (rows.length === 0) {
      console.warn('No users found in the database. Creating a default user for recipes.');

      // Create a default user if none exists
      const { rows: newUser } = await pool.query(
        'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id',
        ['admin@example.com', '$2b$10$TBo.3LMeYRVaZmbxNReQBu5jO6HNVhRJ1gRPnJcCNxZMLUy1p.JZi'], // Default password is 'admin123'
      );

      return newUser[0].id;
    }

    return rows[0].id;
  } catch (error) {
    console.error('Error getting user ID:', error);
    throw error;
  }
}

// Insert a recipe and its related data into the database
async function insertRecipe(recipe, userId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Generate a slug from the title
    const slug = slugify(recipe.title, { lower: true });

    // Insert recipe
    const recipeInsert = {
      text: `
        INSERT INTO recipes(
          user_id, title, slug, description, chef, category, tags,
          prep_time, cook_time, total_time, servings, difficulty,
          calories, protein, fat, carbohydrates, status, is_public, source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING id
      `,
      values: [
        userId,
        recipe.title,
        slug,
        recipe.description,
        recipe.chef,
        recipe.category,
        recipe.tags,
        recipe.prep_time,
        recipe.cook_time,
        recipe.total_time,
        recipe.servings,
        recipe.difficulty,
        recipe.calories,
        recipe.protein,
        recipe.fat,
        recipe.carbohydrates,
        'published', // status
        true, // is_public
        recipe.source,
      ],
    };

    const recipeResult = await client.query(recipeInsert);
    const recipeId = recipeResult.rows[0].id;

    // Insert ingredients
    if (recipe.ingredients && recipe.ingredients.length) {
      for (let i = 0; i < recipe.ingredients.length; i++) {
        const ingredient = recipe.ingredients[i];
        await client.query(
          `
          INSERT INTO recipe_ingredients(recipe_id, name, quantity, unit, notes, order_index)
          VALUES ($1, $2, $3, $4, $5, $6)
          `,
          [recipeId, ingredient.name, ingredient.quantity, ingredient.unit, ingredient.notes, i],
        );
      }
    }

    // Insert instructions
    if (recipe.instructions && recipe.instructions.length) {
      for (const instruction of recipe.instructions) {
        await client.query(
          `
          INSERT INTO recipe_instructions(recipe_id, step_number, instruction)
          VALUES ($1, $2, $3)
          `,
          [recipeId, instruction.step_number, instruction.instruction],
        );
      }
    }

    await client.query('COMMIT');
    return recipeId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Main function to seed all recipes
async function seedRecipes() {
  try {
    console.log('Starting to seed recipes...');

    // Get a user ID to associate with the recipes
    const userId = await getUserId();
    console.log(`Found user ID: ${userId}`);

    // Insert each recipe
    for (const recipe of recipes) {
      try {
        const recipeId = await insertRecipe(recipe, userId);
        console.log(`Inserted recipe: ${recipe.title} (ID: ${recipeId})`);
      } catch (error) {
        console.error(`Failed to insert recipe "${recipe.title}":`, error);
      }
    }

    console.log('Recipe seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding recipes:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the seeding function
seedRecipes().catch(console.error);
