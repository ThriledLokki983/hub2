import { randomUUID } from 'crypto';
import client from '../database';
import {
  Recipe,
  CreateRecipeDto,
  UpdateRecipeDto,
  RecipeInstruction,
  RecipeIngredient,
  IngredientInput,
  InstructionInput,
} from '../interfaces/recipe.interface';

export class RecipeService {
  // Track the current featured recipe ID to exclude from regular listings
  private featuredRecipeId: string | null = null;

  async getAllRecipes(): Promise<Recipe[]> {
    const recipesResult = await client.query(
      'SELECT * FROM recipes WHERE id != $1 ORDER BY created_at DESC',
      [this.featuredRecipeId || '00000000-0000-0000-0000-000000000000'] // Use a dummy UUID when no featured recipe
    );

    const recipes: Recipe[] = [];
    for (const recipe of recipesResult.rows) {
      const ingredients = await this.getIngredientsByRecipeId(recipe.id);
      const instructions = await this.getInstructionsByRecipeId(recipe.id);

      recipes.push({
        ...recipe,
        ingredients,
        instructions,
        created_at: new Date(recipe.created_at),
        updated_at: new Date(recipe.updated_at),
      });
    }

    return recipes;
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    const result = await client.query('SELECT * FROM recipes WHERE id = $1', [
      id,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    const recipe = result.rows[0];
    const ingredients = await this.getIngredientsByRecipeId(id);
    const instructions = await this.getInstructionsByRecipeId(id);

    // Get photos for this recipe
    const photoResult = await client.query(
      'SELECT photo_url FROM recipe_photos WHERE recipe_id = $1 ORDER BY created_at DESC',
      [id]
    );

    const photos = photoResult.rows.map((row) => row.photo_url);

    return {
      ...recipe,
      ingredients,
      instructions,
      photos,
      created_at: new Date(recipe.created_at),
      updated_at: new Date(recipe.updated_at),
    };
  }

  async createRecipe(recipeData: CreateRecipeDto): Promise<Recipe> {
    const id = randomUUID();
    const created_at = new Date();
    const updated_at = created_at;

    // Insert the main recipe with all the correct columns
    await client.query(
      `INSERT INTO recipes (
        id,
        title,
        description,
        created_at,
        updated_at,
        image,
        chef,
        cook_time,
        prep_time,
        total_time,
        servings,
        difficulty
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        id,
        recipeData.title,
        recipeData.description,
        created_at,
        updated_at,
        recipeData.image || '',
        recipeData.chef || '',
        recipeData.cook_time || '45 minutes',
        recipeData.prep_time || '20 minutes',
        recipeData.total_time || '65 minutes',
        recipeData.servings || 4,
        recipeData.difficulty || 'Medium',
      ]
    );

    // Insert ingredients if provided
    if (recipeData.ingredients && recipeData.ingredients.length > 0) {
      for (const ingredient of recipeData.ingredients) {
        // Parse the ingredient string into parts (format: "name|amount|notes")
        const parts = ingredient.split('|');
        const name = parts[0] || '';
        const amount = parts[1] || '';
        const notes = parts[2] || '';

        await client.query(
          'INSERT INTO ingredients (id, recipe_id, name, amount, notes) VALUES ($1, $2, $3, $4, $5)',
          [randomUUID(), id, name, amount, notes]
        );
      }
    }

    // Insert instructions if provided
    if (recipeData.instructions && recipeData.instructions.length > 0) {
      for (let i = 0; i < recipeData.instructions.length; i++) {
        await client.query(
          'INSERT INTO instructions (id, recipe_id, step_number, text) VALUES ($1, $2, $3, $4)',
          [randomUUID(), id, i + 1, recipeData.instructions[i]]
        );
      }
    }

    // Convert string arrays to proper object arrays to match Recipe interface
    const formattedIngredients: RecipeIngredient[] = recipeData.ingredients
      ? recipeData.ingredients.map((ingredient, index) => {
          const parts = ingredient.split('|');
          return {
            id: `temp-${index}`, // Temporary ID
            recipe_id: id,
            name: parts[0] || '',
            amount: parts[1] || '',
            notes: parts[2] || '',
          };
        })
      : [];

    const formattedInstructions: RecipeInstruction[] = recipeData.instructions
      ? recipeData.instructions.map((instruction, index) => ({
          id: `temp-${index}`, // Temporary ID
          recipe_id: id,
          step_number: index + 1,
          text: instruction,
        }))
      : [];

    return {
      id,
      title: recipeData.title,
      description: recipeData.description,
      image: recipeData.image || '',
      chef: recipeData.chef || '',
      cook_time: recipeData.cook_time || '45 minutes',
      prep_time: recipeData.prep_time || '20 minutes',
      total_time: recipeData.total_time || '65 minutes',
      servings: recipeData.servings || 4,
      difficulty: recipeData.difficulty || 'Medium',
      ingredients: formattedIngredients,
      instructions: formattedInstructions,
      photos: recipeData.photos || [], // Use provided photos or empty array
      created_at,
      updated_at,
    };
  }

  async updateRecipe(
    id: string,
    updateData: UpdateRecipeDto
  ): Promise<Recipe | null> {
    // Check if recipe exists
    const existingRecipe = await this.getRecipeById(id);
    if (!existingRecipe) {
      return null;
    }

    const updated_at = new Date();

    // Update recipe fields
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updateData.title !== undefined) {
      updateFields.push(`title = $${paramCount++}`);
      values.push(updateData.title);
    }

    if (updateData.description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      values.push(updateData.description);
    }

    if (updateData.image !== undefined) {
      updateFields.push(`image = $${paramCount++}`);
      values.push(updateData.image);
    }

    if (updateData.chef !== undefined) {
      updateFields.push(`chef = $${paramCount++}`);
      values.push(updateData.chef);
    }

    if (updateData.cook_time !== undefined) {
      updateFields.push(`cook_time = $${paramCount++}`);
      values.push(updateData.cook_time);
    }

    if (updateData.prep_time !== undefined) {
      updateFields.push(`prep_time = $${paramCount++}`);
      values.push(updateData.prep_time);
    }

    if (updateData.total_time !== undefined) {
      updateFields.push(`total_time = $${paramCount++}`);
      values.push(updateData.total_time);
    }

    if (updateData.servings !== undefined) {
      updateFields.push(`servings = $${paramCount++}`);
      values.push(updateData.servings);
    }

    if (updateData.difficulty !== undefined) {
      updateFields.push(`difficulty = $${paramCount++}`);
      values.push(updateData.difficulty);
    }

    updateFields.push(`updated_at = $${paramCount++}`);
    values.push(updated_at);

    // Only update recipe table if there are fields to update
    if (updateFields.length > 0) {
      values.push(id);
      await client.query(
        `UPDATE recipes SET ${updateFields.join(
          ', '
        )} WHERE id = $${paramCount}`,
        values
      );
    }

    // Update ingredients if included
    if (updateData.ingredients) {
      // Delete existing ingredients
      await client.query('DELETE FROM ingredients WHERE recipe_id = $1', [id]);

      // Insert new ingredients
      for (const ingredient of updateData.ingredients) {
        // Parse the ingredient string into parts (format: "name|amount|notes")
        const parts = ingredient.split('|');
        const name = parts[0] || '';
        const amount = parts[1] || '';
        const notes = parts[2] || '';

        await client.query(
          'INSERT INTO ingredients (id, recipe_id, name, amount, notes) VALUES ($1, $2, $3, $4, $5)',
          [randomUUID(), id, name, amount, notes]
        );
      }
    }

    // Update instructions if included
    if (updateData.instructions) {
      // Delete existing instructions
      await client.query('DELETE FROM instructions WHERE recipe_id = $1', [id]);

      // Insert new instructions
      for (let i = 0; i < updateData.instructions.length; i++) {
        await client.query(
          'INSERT INTO instructions (id, recipe_id, step_number, text) VALUES ($1, $2, $3, $4)',
          [randomUUID(), id, i + 1, updateData.instructions[i]]
        );
      }
    }

    // Return updated recipe
    return this.getRecipeById(id);
  }

  async deleteRecipe(id: string): Promise<boolean> {
    const result = await client.query(
      'DELETE FROM recipes WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows.length > 0;
  }

  async addIngredientsToRecipe(
    recipeId: string,
    ingredients: IngredientInput[]
  ): Promise<Recipe | null> {
    // First check if recipe exists
    const recipe = await this.getRecipeById(recipeId);
    if (!recipe) {
      return null;
    }

    // Insert new ingredients
    for (const ingredient of ingredients) {
      await client.query(
        'INSERT INTO ingredients (id, recipe_id, name, amount, notes) VALUES ($1, $2, $3, $4, $5)',
        [
          randomUUID(),
          recipeId,
          ingredient.name,
          ingredient.amount,
          ingredient.notes || '',
        ]
      );
    }

    // Update the updated_at timestamp for the recipe
    const updated_at = new Date();
    await client.query('UPDATE recipes SET updated_at = $1 WHERE id = $2', [
      updated_at,
      recipeId,
    ]);

    // Return the updated recipe
    return this.getRecipeById(recipeId);
  }

  async addInstructionsToRecipe(
    recipeId: string,
    instructions: InstructionInput[]
  ): Promise<Recipe | null> {
    // First check if recipe exists
    const recipe = await this.getRecipeById(recipeId);
    if (!recipe) {
      return null;
    }

    // Get the current highest step number
    const result = await client.query(
      'SELECT MAX(step_number) as max_step FROM instructions WHERE recipe_id = $1',
      [recipeId]
    );

    // Start with step number 1 if no instructions exist, otherwise use max + 1
    let nextStepNumber = 1;
    if (result.rows.length > 0 && result.rows[0].max_step) {
      nextStepNumber = result.rows[0].max_step + 1;
    }

    // Insert new instructions with correct step numbers
    for (const instruction of instructions) {
      const stepNumber = instruction.step_number || nextStepNumber++;

      await client.query(
        'INSERT INTO instructions (id, recipe_id, step_number, text) VALUES ($1, $2, $3, $4)',
        [randomUUID(), recipeId, stepNumber, instruction.text]
      );
    }

    // Update the updated_at timestamp for the recipe
    const updated_at = new Date();
    await client.query('UPDATE recipes SET updated_at = $1 WHERE id = $2', [
      updated_at,
      recipeId,
    ]);

    // Return the updated recipe
    return this.getRecipeById(recipeId);
  }

  async addPhotoToRecipe(
    recipeId: string,
    photoUrl: string
  ): Promise<Recipe | null> {
    // First check if recipe exists
    const recipe = await this.getRecipeById(recipeId);
    if (!recipe) {
      return null;
    }

    // Insert the photo
    const photoId = randomUUID();
    await client.query(
      'INSERT INTO recipe_photos (id, recipe_id, photo_url, created_at) VALUES ($1, $2, $3, $4)',
      [photoId, recipeId, photoUrl, new Date()]
    );

    // Update the updated_at timestamp for the recipe
    const updated_at = new Date();
    await client.query('UPDATE recipes SET updated_at = $1 WHERE id = $2', [
      updated_at,
      recipeId,
    ]);

    // Return the updated recipe
    return this.getRecipeById(recipeId);
  }

  async addPhotosToRecipe(
    recipeId: string,
    photoUrls: string[]
  ): Promise<Recipe | null> {
    // First check if recipe exists
    const recipe = await this.getRecipeById(recipeId);
    if (!recipe) {
      return null;
    }

    // Insert all photos
    for (const photoUrl of photoUrls) {
      const photoId = randomUUID();
      await client.query(
        'INSERT INTO recipe_photos (id, recipe_id, photo_url, created_at) VALUES ($1, $2, $3, $4)',
        [photoId, recipeId, photoUrl, new Date()]
      );
    }

    // Update the updated_at timestamp for the recipe
    const updated_at = new Date();
    await client.query('UPDATE recipes SET updated_at = $1 WHERE id = $2', [
      updated_at,
      recipeId,
    ]);

    // Return the updated recipe
    return this.getRecipeById(recipeId);
  }

  async getRecipePhotos(
    recipeId: string
  ): Promise<{ id: string; photo_url: string; created_at: Date }[] | null> {
    // First check if recipe exists
    const recipeExists = await client.query(
      'SELECT id FROM recipes WHERE id = $1',
      [recipeId]
    );
    if (recipeExists.rows.length === 0) {
      return null;
    }

    // Get all photos for the recipe
    const result = await client.query(
      'SELECT id, photo_url, created_at FROM recipe_photos WHERE recipe_id = $1 ORDER BY created_at DESC',
      [recipeId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      photo_url: row.photo_url,
      created_at: new Date(row.created_at),
    }));
  }

  async deleteRecipePhoto(recipeId: string, photoId: string): Promise<boolean> {
    const result = await client.query(
      'DELETE FROM recipe_photos WHERE id = $1 AND recipe_id = $2 RETURNING id',
      [photoId, recipeId]
    );

    if (result.rows.length > 0) {
      // Update the recipe's updated_at timestamp
      const updated_at = new Date();
      await client.query('UPDATE recipes SET updated_at = $1 WHERE id = $2', [
        updated_at,
        recipeId,
      ]);
      return true;
    }

    return false;
  }

  async getAllIngredients(): Promise<RecipeIngredient[]> {
    const result = await client.query(`
      SELECT i.id, i.recipe_id, i.name, i.amount, i.notes, r.title as recipe_name
      FROM ingredients i
      JOIN recipes r ON i.recipe_id = r.id
      ORDER BY r.title, i.name
    `);

    return result.rows.map((row) => ({
      id: row.id,
      recipe_id: row.recipe_id,
      name: row.name,
      amount: row.amount,
      notes: row.notes,
      recipe_name: row.recipe_name,
    }));
  }

  async getAllInstructions(): Promise<RecipeInstruction[]> {
    const result = await client.query(`
      SELECT i.id, i.recipe_id, i.step_number, i.text, r.title as recipe_title
      FROM instructions i
      JOIN recipes r ON i.recipe_id = r.id
      ORDER BY r.title, i.step_number
    `);

    return result.rows.map((row) => ({
      id: row.id,
      recipe_id: row.recipe_id,
      step_number: row.step_number,
      text: row.text,
      recipe_title: row.recipe_title,
    }));
  }

  async getFeaturedRecipe(): Promise<Recipe | null> {
    // Get a random recipe ID
    const result = await client.query(
      'SELECT id FROM recipes ORDER BY RANDOM() LIMIT 1'
    );

    if (result.rows.length === 0) {
      return null;
    }

    // Store the featured recipe ID to exclude from regular listings
    this.featuredRecipeId = result.rows[0].id;

    // Get the full recipe details
    if (!this.featuredRecipeId) {
      return null;
    }

    return this.getRecipeById(this.featuredRecipeId);
  }

  private async getIngredientsByRecipeId(
    recipeId: string
  ): Promise<Omit<RecipeIngredient, 'id' | 'recipe_id'>[]> {
    const result = await client.query(
      'SELECT name, amount, notes FROM ingredients WHERE recipe_id = $1',
      [recipeId]
    );
    return result.rows;
  }

  private async getInstructionsByRecipeId(
    recipeId: string
  ): Promise<Omit<RecipeInstruction, 'id' | 'recipe_id'>[]> {
    const result = await client.query(
      'SELECT step_number, text FROM instructions WHERE recipe_id = $1 ORDER BY step_number ASC',
      [recipeId]
    );
    return result.rows;
  }
}
