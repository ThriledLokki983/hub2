import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';
import { CreateRecipeDtoType, UpdateRecipeDtoType } from '../dto/recipe.dto';
import { Routes } from '../interfaces/routes.interface';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { validateMiddleware } from '../middlewares/validation.middleware';
import {
  uploadPhotoMiddleware,
  uploadPhotosMiddleware,
} from '../middlewares/upload.middleware';

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipe management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the recipe
 *         title:
 *           type: string
 *           description: The title of the recipe
 *         description:
 *           type: string
 *           description: The description of the recipe
 *         image:
 *           type: string
 *           description: URL to the recipe image
 *         chef:
 *           type: string
 *           description: The name of the chef
 *         cook_time:
 *           type: string
 *           description: The cooking time
 *         prep_time:
 *           type: string
 *           description: The preparation time
 *         total_time:
 *           type: string
 *           description: The total time to prepare the recipe
 *         servings:
 *           type: number
 *           description: Number of servings
 *         difficulty:
 *           type: string
 *           description: Difficulty level (Easy, Medium, Hard)
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ingredient'
 *         instructions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Instruction'
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to recipe photos
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *
 *     Ingredient:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Ingredient ID
 *         recipe_id:
 *           type: string
 *           description: Recipe ID this ingredient belongs to
 *         name:
 *           type: string
 *           description: Ingredient name
 *         amount:
 *           type: string
 *           description: Amount of ingredient
 *         notes:
 *           type: string
 *           description: Additional notes about the ingredient
 *
 *     Instruction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Instruction ID
 *         recipe_id:
 *           type: string
 *           description: Recipe ID this instruction belongs to
 *         step_number:
 *           type: number
 *           description: Order of instruction steps
 *         text:
 *           type: string
 *           description: Text of the instruction
 */

class RecipeRoute implements Routes {
  public router = Router();
  public recipe = new RecipeController();
  public path = '/recipes';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /recipes:
     *   get:
     *     summary: Get all recipes
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of all recipes
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 count:
     *                   type: integer
     *                 recipes:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Recipe'
     *       401:
     *         description: Unauthorized - User not logged in
     */
    this.router.get(`${this.path}`, this.recipe.getAllRecipes);

    /**
     * @swagger
     * /recipes/featured:
     *   get:
     *     summary: Get a featured recipe
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: A featured recipe
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 data:
     *                   $ref: '#/components/schemas/Recipe'
     *       401:
     *         description: Unauthorized - User not logged in
     */
    this.router.get(`${this.path}/featured`, this.recipe.getFeaturedRecipe);

    /**
     * @swagger
     * /recipes/ingredients:
     *   get:
     *     summary: Get all ingredients from all recipes
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of all ingredients
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 count:
     *                   type: integer
     *                 ingredients:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Ingredient'
     *       401:
     *         description: Unauthorized - User not logged in
     */
    this.router.get(`${this.path}/ingredients`, this.recipe.getAllIngredients);

    /**
     * @swagger
     * /recipes/instructions:
     *   get:
     *     summary: Get all instructions from all recipes
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of all instructions
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 count:
     *                   type: integer
     *                 instructions:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Instruction'
     *       401:
     *         description: Unauthorized - User not logged in
     */
    this.router.get(
      `${this.path}/instructions`,
      this.recipe.getAllInstructions
    );

    /**
     * @swagger
     * /recipes/{id}:
     *   get:
     *     summary: Get a recipe by ID
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: Recipe ID
     *     responses:
     *       200:
     *         description: Recipe found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 data:
     *                   $ref: '#/components/schemas/Recipe'
     *       401:
     *         description: Unauthorized - User not logged in
     *       404:
     *         description: Recipe not found
     */
    this.router.get(`${this.path}/:id`, this.recipe.getRecipeById);

    /**
     * @swagger
     * /recipes/{id}/photos:
     *   get:
     *     summary: Get all photos for a recipe
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: Recipe ID
     *     responses:
     *       200:
     *         description: Photos retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 count:
     *                   type: integer
     *                 photos:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                       photo_url:
     *                         type: string
     *                       created_at:
     *                         type: string
     *                         format: date-time
     *       401:
     *         description: Unauthorized - User not logged in
     */
    this.router.get(`${this.path}/:id/photos`, AuthMiddleware, this.recipe.getRecipePhotos);

    /**
     * @swagger
     * /recipes:
     *   post:
     *     summary: Create a new recipe
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - description
     *             properties:
     *               title:
     *                 type: string
     *                 description: Recipe title
     *               description:
     *                 type: string
     *                 description: Recipe description
     *               image:
     *                 type: string
     *                 description: URL to recipe image
     *               chef:
     *                 type: string
     *                 description: Chef name
     *               cook_time:
     *                 type: string
     *                 description: Cooking time
     *               prep_time:
     *                 type: string
     *                 description: Preparation time
     *               total_time:
     *                 type: string
     *                 description: Total time
     *               servings:
     *                 type: number
     *                 description: Number of servings
     *               difficulty:
     *                 type: string
     *                 description: Difficulty level
     *               ingredients:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Ingredients in format "name|amount|notes"
     *               instructions:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Step-by-step instructions
     *     responses:
     *       201:
     *         description: Recipe created successfully
     *       400:
     *         description: Invalid input
     *       401:
     *         description: Unauthorized - User not logged in
     */
    this.router.post(
      `${this.path}`,
      AuthMiddleware,
      validateMiddleware(CreateRecipeDtoType, 'body'),
      this.recipe.createRecipe
    );

    /**
     * @swagger
     * /recipes/{id}:
     *   put:
     *     summary: Update a recipe
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: Recipe ID
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *               image:
     *                 type: string
     *               chef:
     *                 type: string
     *               cook_time:
     *                 type: string
     *               prep_time:
     *                 type: string
     *               total_time:
     *                 type: string
     *               servings:
     *                 type: number
     *               difficulty:
     *                 type: string
     *               ingredients:
     *                 type: array
     *                 items:
     *                   type: string
     *               instructions:
     *                 type: array
     *                 items:
     *                   type: string
     *     responses:
     *       200:
     *         description: Recipe updated successfully
     *       401:
     *         description: Unauthorized - User not logged in
     *       404:
     *         description: Recipe not found
     */
    this.router.put(
      `${this.path}/:id`,
      AuthMiddleware,
      validateMiddleware(UpdateRecipeDtoType, 'body'),
      this.recipe.updateRecipe
    );

    /**
     * @swagger
     * /recipes/{id}:
     *   delete:
     *     summary: Delete a recipe
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: Recipe ID
     *     responses:
     *       200:
     *         description: Recipe deleted successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Recipe not found
     */
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware,
      this.recipe.deleteRecipe
    );

    /**
     * @swagger
     * /recipes/{id}/ingredients:
     *   post:
     *     summary: Add ingredients to a recipe
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: Recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - ingredients
     *             properties:
     *               ingredients:
     *                 type: array
     *                 items:
     *                   type: object
     *                   required:
     *                     - name
     *                     - amount
     *                   properties:
     *                     name:
     *                       type: string
     *                     amount:
     *                       type: string
     *                     notes:
     *                       type: string
     *     responses:
     *       200:
     *         description: Ingredients added successfully
     *       401:
     *         description: Unauthorized - User not logged in
     *       404:
     *         description: Recipe not found
     */
    this.router.post(
      `${this.path}/:id/ingredients`,
      AuthMiddleware,
      this.recipe.addIngredientsToRecipe
    );

    /**
     * @swagger
     * /recipes/{id}/instructions:
     *   post:
     *     summary: Add instructions to a recipe
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: Recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - instructions
     *             properties:
     *               instructions:
     *                 type: array
     *                 items:
     *                   type: object
     *                   required:
     *                     - text
     *                   properties:
     *                     text:
     *                       type: string
     *                     step_number:
     *                       type: number
     *     responses:
     *       200:
     *         description: Instructions added successfully
     *       401:
     *         description: Unauthorized - User not logged in
     *       404:
     *         description: Recipe not found
     */
    this.router.post(
      `${this.path}/:id/instructions`,
      AuthMiddleware,
      this.recipe.addInstructionsToRecipe
    );

    /**
     * @swagger
     * /recipes/{id}/photo:
     *   post:
     *     summary: Upload a photo for a recipe
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: Recipe ID
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               photo:
     *                 type: string
     *                 format: binary
     *     responses:
     *       201:
     *         description: Photo uploaded successfully
     *       401:
     *         description: Unauthorized - User not logged in
     *       404:
     *         description: Recipe not found
     */
    this.router.post(
      `${this.path}/:id/photo`,
      AuthMiddleware,
      uploadPhotoMiddleware,
      this.recipe.uploadRecipePhoto
    );

    /**
     * @swagger
     * /recipes/{id}/photos:
     *   post:
     *     summary: Upload multiple photos for a recipe
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: Recipe ID
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               photos:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: binary
     *     responses:
     *       201:
     *         description: Photos uploaded successfully
     *       401:
     *         description: Unauthorized - User not logged in
     *       404:
     *         description: Recipe not found
     */
    this.router.post(
      `${this.path}/:id/photos`,
      AuthMiddleware,
      uploadPhotosMiddleware,
      this.recipe.uploadMultipleRecipePhotos
    );

    /**
     * @swagger
     * /recipes/{recipeId}/photos/{photoId}:
     *   delete:
     *     summary: Delete a photo from a recipe
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: recipeId
     *         schema:
     *           type: string
     *         required: true
     *         description: Recipe ID
     *       - in: path
     *         name: photoId
     *         schema:
     *           type: string
     *         required: true
     *         description: Photo ID
     *     responses:
     *       200:
     *         description: Photo deleted successfully
     *       401:
     *         description: Unauthorized - User not logged in
     *       404:
     *         description: Photo or recipe not found
     */
    this.router.delete(
      `${this.path}/:recipeId/photos/:photoId`,
      AuthMiddleware,
      this.recipe.deleteRecipePhoto
    );
  }
}

export default RecipeRoute;
