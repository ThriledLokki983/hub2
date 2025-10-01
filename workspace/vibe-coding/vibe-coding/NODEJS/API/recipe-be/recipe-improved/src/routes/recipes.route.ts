import { Router } from 'express';
import { RecipeController } from '@controllers/recipes.controller';
import {
  CreateRecipeDto,
  CreateIngredientDto,
  CreateInstructionDto,
  RecipeQueryDto,
  UpdateRecipeDto,
  CreateTagDto,
  UpdateTagDto,
  TagRecipeDto,
  CreateRegionDto,
  UpdateRegionDto,
  RecipeRegionDto,
  CreateRatingDto,
  CreateCommentDto,
  UpdateCommentDto,
} from '@dtos/recipes.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@middlewares/auth.middleware';

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipe management endpoints
 */
export class RecipesRoute implements Routes {
  public path = '/recipes';
  public router = Router();
  public recipeController = new RecipeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /recipes:
     *   get:
     *     summary: Returns a list of recipes
     *     tags: [Recipes]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         description: Page number for pagination
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *           default: 10
     *         description: Number of recipes per page
     *       - in: query
     *         name: category
     *         schema:
     *           type: string
     *         description: Filter recipes by category
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Search term to find in title or description
     *       - in: query
     *         name: tags
     *         schema:
     *           type: string
     *         description: Comma-separated list of tags to filter by
     *       - in: query
     *         name: sort
     *         schema:
     *           type: string
     *           default: created_at
     *         description: Field to sort by
     *       - in: query
     *         name: sort_direction
     *         schema:
     *           type: string
     *           enum: [ASC, DESC]
     *           default: DESC
     *         description: Sort direction
     *       - in: query
     *         name: max_prep_time
     *         schema:
     *           type: integer
     *           minimum: 0
     *         description: Maximum preparation time in minutes
     *       - in: query
     *         name: max_cook_time
     *         schema:
     *           type: integer
     *           minimum: 0
     *         description: Maximum cooking time in minutes
     *       - in: query
     *         name: max_total_time
     *         schema:
     *           type: integer
     *           minimum: 0
     *         description: Maximum total time in minutes
     *       - in: query
     *         name: min_calories
     *         schema:
     *           type: integer
     *           minimum: 0
     *         description: Minimum calories per serving
     *       - in: query
     *         name: max_calories
     *         schema:
     *           type: integer
     *           minimum: 0
     *         description: Maximum calories per serving
     *       - in: query
     *         name: min_protein
     *         schema:
     *           type: integer
     *           minimum: 0
     *         description: Minimum protein in grams
     *       - in: query
     *         name: max_protein
     *         schema:
     *           type: integer
     *           minimum: 0
     *         description: Maximum protein in grams
     *       - in: query
     *         name: min_fat
     *         schema:
     *           type: integer
     *           minimum: 0
     *         description: Minimum fat in grams
     *       - in: query
     *         name: max_fat
     *         schema:
     *           type: integer
     *           minimum: 0
     *         description: Maximum fat in grams
     *       - in: query
     *         name: min_carbs
     *         schema:
     *           type: integer
     *           minimum: 0
     *         description: Minimum carbohydrates in grams
     *       - in: query
     *         name: max_carbs
     *         schema:
     *           type: integer
     *           minimum: 0
     *         description: Maximum carbohydrates in grams
     *       - in: query
     *         name: exclude_ingredients
     *         schema:
     *           type: string
     *         description: Comma-separated list of ingredients to exclude (e.g., for allergies or preferences)
     *     responses:
     *       200:
     *         description: List of recipes
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Recipe'
     *                 total:
     *                   type: integer
     *                 page:
     *                   type: integer
     *                 limit:
     *                   type: integer
     */
    this.router.get(`${this.path}`, ValidationMiddleware(RecipeQueryDto, 'query', true), this.recipeController.getRecipes);

    /**
     * @swagger
     * /recipes/{id}:
     *   get:
     *     summary: Get a recipe by ID
     *     tags: [Recipes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     responses:
     *       200:
     *         description: Recipe details including ingredients, instructions and photos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/RecipeWithDetails'
     *       404:
     *         description: Recipe not found
     */
    this.router.get(`${this.path}/:id`, this.recipeController.getRecipeById);

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
     *             $ref: '#/components/schemas/CreateRecipeDto'
     *     responses:
     *       201:
     *         description: Recipe created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/Recipe'
     *       401:
     *         description: Unauthorized
     *       400:
     *         description: Invalid input
     */
    this.router.post(`${this.path}`, AuthMiddleware, ValidationMiddleware(CreateRecipeDto, 'body'), this.recipeController.createRecipe);

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
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateRecipeDto'
     *     responses:
     *       200:
     *         description: Recipe updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/Recipe'
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe not found
     */
    this.router.put(`${this.path}/:id`, AuthMiddleware, ValidationMiddleware(UpdateRecipeDto, 'body', true), this.recipeController.updateRecipe);

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
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     responses:
     *       200:
     *         description: Recipe deleted successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe not found
     */
    this.router.delete(`${this.path}/:id`, AuthMiddleware, this.recipeController.deleteRecipe);

    /**
     * @swagger
     * /recipes/{id}/ingredients:
     *   post:
     *     summary: Add an ingredient to a recipe
     *     tags: [Recipe Ingredients]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             oneOf:
     *               - $ref: '#/components/schemas/CreateIngredientDto'
     *               - type: object
     *                 properties:
     *                   ingredients:
     *                     type: array
     *                     items:
     *                       $ref: '#/components/schemas/CreateIngredientDto'
     *     responses:
     *       201:
     *         description: Ingredient added successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/RecipeIngredient'
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe not found
     */
    this.router.post(
      `${this.path}/:id/ingredients`,
      AuthMiddleware,
      ValidationMiddleware(CreateIngredientDto, 'body'),
      this.recipeController.addIngredient,
    );

    /**
     * @swagger
     * /recipes/{id}/ingredients/batch:
     *   post:
     *     summary: Add multiple ingredients to a recipe
     *     tags: [Recipe Ingredients]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               ingredients:
     *                 type: array
     *                 items:
     *                   $ref: '#/components/schemas/CreateIngredientDto'
     *     responses:
     *       201:
     *         description: Ingredients added successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/RecipeIngredient'
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe not found
     */
    this.router.post(`${this.path}/:id/ingredients/batch`, AuthMiddleware, this.recipeController.addIngredientBatch);

    /**
     * @swagger
     * /recipes/{id}/instructions:
     *   post:
     *     summary: Add an instruction to a recipe
     *     tags: [Recipe Instructions]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateInstructionDto'
     *     responses:
     *       201:
     *         description: Instruction added successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/RecipeInstruction'
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe not found
     */
    this.router.post(
      `${this.path}/:id/instructions`,
      AuthMiddleware,
      ValidationMiddleware(CreateInstructionDto, 'body'),
      this.recipeController.addInstruction,
    );

    /**
     * @swagger
     * /recipes/{id}/instructions/batch:
     *   post:
     *     summary: Add multiple instructions to a recipe
     *     tags: [Recipe Instructions]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               instructions:
     *                 type: array
     *                 items:
     *                   $ref: '#/components/schemas/CreateInstructionDto'
     *     responses:
     *       201:
     *         description: Instructions added successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/RecipeInstruction'
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe not found
     */
    this.router.post(`${this.path}/:id/instructions/batch`, AuthMiddleware, this.recipeController.addInstructionBatch);

    /**
     * @swagger
     * /recipes/{id}/photo:
     *   post:
     *     summary: Upload a single photo for a recipe
     *     tags: [Recipe Photos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               photo:
     *                 type: string
     *                 format: binary
     *                 description: The photo file to upload (JPG, PNG, GIF, etc.)
     *               isPrimary:
     *                 type: boolean
     *                 description: Whether this is the primary photo for the recipe
     *     responses:
     *       201:
     *         description: Photo uploaded successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/RecipePhoto'
     *                 message:
     *                   type: string
     *       400:
     *         description: No file uploaded or invalid file type
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe not found
     */
    this.router.post(`${this.path}/:id/photo`, AuthMiddleware, this.recipeController.uploadPhoto);

    /**
     * @swagger
     * /recipes/{id}/photos:
     *   post:
     *     summary: Upload multiple photos for a recipe
     *     tags: [Recipe Photos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     requestBody:
     *       required: true
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
     *                 description: The photo files to upload (max 10)
     *     responses:
     *       201:
     *         description: Photos uploaded successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/RecipePhoto'
     *                 message:
     *                   type: string
     *       400:
     *         description: No files uploaded or invalid file types
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe not found
     */
    this.router.post(`${this.path}/:id/photos`, AuthMiddleware, this.recipeController.uploadPhotos);

    /**
     * @swagger
     * /recipes/{id}/photos/{photoId}:
     *   delete:
     *     summary: Delete a photo from a recipe
     *     tags: [Recipe Photos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *       - in: path
     *         name: photoId
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The photo ID
     *     responses:
     *       200:
     *         description: Photo deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe or photo not found
     */
    this.router.delete(`${this.path}/:id/photos/:photoId`, AuthMiddleware, this.recipeController.deletePhoto);

    /**
     * @swagger
     * /recipes/{id}/ingredients:
     *   get:
     *     summary: Get all ingredients for a recipe
     *     tags: [Recipe Ingredients]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     responses:
     *       200:
     *         description: List of ingredients for the recipe
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/RecipeIngredient'
     *       404:
     *         description: Recipe not found
     */
    this.router.get(`${this.path}/:id/ingredients`, this.recipeController.getAllIngredients);

    /**
     * @swagger
     * /recipes/{id}/instructions:
     *   get:
     *     summary: Get all instructions for a recipe
     *     tags: [Recipe Instructions]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     responses:
     *       200:
     *         description: List of instructions for the recipe
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/RecipeInstruction'
     *       404:
     *         description: Recipe not found
     */
    this.router.get(`${this.path}/:id/instructions`, this.recipeController.getAllInstructions);

    /**
     * @swagger
     * /recipes/ingredients/all:
     *   get:
     *     summary: Get all available ingredients across all recipes
     *     tags: [Recipe Ingredients]
     *     responses:
     *       200:
     *         description: List of unique ingredients with usage count
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       name:
     *                         type: string
     *                         description: Ingredient name
     *                       count:
     *                         type: integer
     *                         description: Number of recipes using this ingredient
     *       500:
     *         description: Server error
     */
    this.router.get(`${this.path}/ingredients/all`, this.recipeController.getAllAvailableIngredients);

    /**
     * @swagger
     * /recipes/instructions/all:
     *   get:
     *     summary: Get all available instructions across all recipes
     *     tags: [Recipe Instructions]
     *     responses:
     *       200:
     *         description: List of all instructions
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/RecipeInstruction'
     *       500:
     *         description: Server error
     */
    this.router.get(`${this.path}/instructions/all`, this.recipeController.getAllAvailableInstructions);

    /**
     * @swagger
     * /tags:
     *   get:
     *     summary: Get all available tags
     *     tags: [Tags]
     *     responses:
     *       200:
     *         description: List of all tags
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Tag'
     *                 message:
     *                   type: string
     */
    this.router.get('/tags', this.recipeController.getAllTags);

    /**
     * @swagger
     * /tags/{id}:
     *   get:
     *     summary: Get a tag by ID
     *     tags: [Tags]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The tag ID
     *     responses:
     *       200:
     *         description: Tag details
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/Tag'
     *                 message:
     *                   type: string
     *       404:
     *         description: Tag not found
     */
    this.router.get('/tags/:id', this.recipeController.getTagById);

    /**
     * @swagger
     * /tags:
     *   post:
     *     summary: Create a new tag
     *     tags: [Tags]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateTagDto'
     *     responses:
     *       201:
     *         description: Tag created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/Tag'
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid input
     */
    this.router.post('/tags', ValidationMiddleware(CreateTagDto), this.recipeController.createTag);

    /**
     * @swagger
     * /tags/{id}:
     *   put:
     *     summary: Update a tag
     *     tags: [Tags]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The tag ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateTagDto'
     *     responses:
     *       200:
     *         description: Tag updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/Tag'
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid input
     *       404:
     *         description: Tag not found
     */
    this.router.put('/tags/:id', ValidationMiddleware(UpdateTagDto), this.recipeController.updateTag);

    /**
     * @swagger
     * /tags/{id}:
     *   delete:
     *     summary: Delete a tag
     *     tags: [Tags]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The tag ID
     *     responses:
     *       200:
     *         description: Tag deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       404:
     *         description: Tag not found
     */
    this.router.delete('/tags/:id', this.recipeController.deleteTag);

    /**
     * @swagger
     * /recipes/{recipeId}/tags:
     *   get:
     *     summary: Get all tags for a recipe
     *     tags: [Recipe Tags]
     *     parameters:
     *       - in: path
     *         name: recipeId
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     responses:
     *       200:
     *         description: List of tags for the recipe
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Tag'
     *                 message:
     *                   type: string
     *       404:
     *         description: Recipe not found
     */
    this.router.get(`${this.path}/:recipeId/tags`, this.recipeController.getTagsByRecipe);

    /**
     * @swagger
     * /recipes/{recipeId}/tags:
     *   post:
     *     summary: Add tags to a recipe
     *     tags: [Recipe Tags]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: recipeId
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/TagRecipeDto'
     *     responses:
     *       200:
     *         description: Tags added to recipe successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Tag'
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid input
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe or tag not found
     */
    this.router.post(`${this.path}/:recipeId/tags`, AuthMiddleware, ValidationMiddleware(TagRecipeDto), this.recipeController.addTagsToRecipe);

    /**
     * @swagger
     * /recipes/{recipeId}/tags/{tagId}:
     *   delete:
     *     summary: Remove a tag from a recipe
     *     tags: [Recipe Tags]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: recipeId
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *       - in: path
     *         name: tagId
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The tag ID
     *     responses:
     *       200:
     *         description: Tag removed from recipe successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe or tag not found
     */
    this.router.delete(`${this.path}/:recipeId/tags/:tagId`, AuthMiddleware, this.recipeController.removeTagFromRecipe);

    /**
     * @swagger
     * /regions:
     *   get:
     *     summary: Get all regions
     *     tags: [Regions]
     *     responses:
     *       200:
     *         description: List of all regions
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Region'
     *                 message:
     *                   type: string
     */
    this.router.get('/regions', this.recipeController.getAllRegions);

    /**
     * @swagger
     * /regions/{id}:
     *   get:
     *     summary: Get a region by ID
     *     tags: [Regions]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The region ID
     *     responses:
     *       200:
     *         description: Region details
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/Region'
     *                 message:
     *                   type: string
     *       404:
     *         description: Region not found
     */
    this.router.get('/regions/:id', this.recipeController.getRegionById);

    /**
     * @swagger
     * /regions:
     *   post:
     *     summary: Create a new region
     *     tags: [Regions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateRegionDto'
     *     responses:
     *       201:
     *         description: Region created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/Region'
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid input
     *       409:
     *         description: Region with the same name already exists
     */
    this.router.post('/regions', ValidationMiddleware(CreateRegionDto), this.recipeController.createRegion);

    /**
     * @swagger
     * /regions/{id}:
     *   put:
     *     summary: Update a region
     *     tags: [Regions]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The region ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateRegionDto'
     *     responses:
     *       200:
     *         description: Region updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/Region'
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid input
     *       404:
     *         description: Region not found
     *       409:
     *         description: Region with the same name already exists
     */
    this.router.put('/regions/:id', ValidationMiddleware(UpdateRegionDto), this.recipeController.updateRegion);

    /**
     * @swagger
     * /regions/{id}:
     *   delete:
     *     summary: Delete a region
     *     tags: [Regions]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The region ID
     *     responses:
     *       200:
     *         description: Region deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       404:
     *         description: Region not found
     */
    this.router.delete('/regions/:id', this.recipeController.deleteRegion);

    /**
     * @swagger
     * /recipes/{recipeId}/region:
     *   post:
     *     summary: Set the region for a recipe
     *     tags: [Recipe Regions]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: recipeId
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RecipeRegionDto'
     *     responses:
     *       200:
     *         description: Region set successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/Recipe'
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid input
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the owner of the recipe
     *       404:
     *         description: Recipe or region not found
     */
    this.router.post(`${this.path}/:recipeId/region`, AuthMiddleware, ValidationMiddleware(RecipeRegionDto), this.recipeController.setRecipeRegion);

    /**
     * @swagger
     * /recipes/{id}/fork:
     *   post:
     *     summary: Fork a recipe
     *     description: Create a copy of a public recipe for personal modification
     *     tags: [Recipes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The original recipe ID to fork
     *     responses:
     *       201:
     *         description: Recipe forked successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/Recipe'
     *                 message:
     *                   type: string
     *       400:
     *         description: Cannot fork your own recipe
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Recipe not found or not public
     */
    this.router.post(`${this.path}/:id/fork`, AuthMiddleware, this.recipeController.forkRecipe);

    /**
     * @swagger
     * /recipes/{id}/ratings:
     *   get:
     *     summary: Get all ratings for a recipe
     *     tags: [Recipe Ratings]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     responses:
     *       200:
     *         description: List of ratings for the recipe
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/RecipeRating'
     *                 message:
     *                   type: string
     *       404:
     *         description: Recipe not found
     */
    this.router.get(`${this.path}/:id/ratings`, this.recipeController.getRatingsByRecipe);

    /**
     * @swagger
     * /recipes/{id}/ratings/mine:
     *   get:
     *     summary: Get the current user's rating for a recipe
     *     tags: [Recipe Ratings]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     responses:
     *       200:
     *         description: The user's rating for the recipe
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/RecipeRating'
     *                 message:
     *                   type: string
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Recipe not found or not yet rated
     */
    this.router.get(`${this.path}/:id/ratings/mine`, AuthMiddleware, this.recipeController.getUserRatingForRecipe);

    /**
     * @swagger
     * /recipes/{id}/ratings:
     *   post:
     *     summary: Rate a recipe
     *     tags: [Recipe Ratings]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateRatingDto'
     *     responses:
     *       201:
     *         description: Rating submitted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/RecipeRating'
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid rating value
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - recipe is not public
     *       404:
     *         description: Recipe not found
     */
    this.router.post(`${this.path}/:id/ratings`, AuthMiddleware, ValidationMiddleware(CreateRatingDto), this.recipeController.rateRecipe);

    /**
     * @swagger
     * /recipes/{id}/ratings:
     *   delete:
     *     summary: Delete the current user's rating for a recipe
     *     tags: [Recipe Ratings]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     responses:
     *       200:
     *         description: Rating deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Rating not found
     */
    this.router.delete(`${this.path}/:id/ratings`, AuthMiddleware, this.recipeController.deleteRating);

    /**
     * @swagger
     * /recipes/{id}/comments:
     *   get:
     *     summary: Get all comments for a recipe
     *     tags: [Recipe Comments]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     responses:
     *       200:
     *         description: List of comments for the recipe
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/RecipeComment'
     *                 message:
     *                   type: string
     *       404:
     *         description: Recipe not found
     */
    this.router.get(`${this.path}/:id/comments`, this.recipeController.getCommentsByRecipe);

    /**
     * @swagger
     * /recipes/{id}/comments:
     *   post:
     *     summary: Add a comment to a recipe
     *     tags: [Recipe Comments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The recipe ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateCommentDto'
     *     responses:
     *       201:
     *         description: Comment added successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/RecipeComment'
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid comment data
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - recipe is not public
     *       404:
     *         description: Recipe not found
     */
    this.router.post(`${this.path}/:id/comments`, AuthMiddleware, ValidationMiddleware(CreateCommentDto), this.recipeController.addCommentToRecipe);

    /**
     * @swagger
     * /recipes/comments/{commentId}:
     *   put:
     *     summary: Update a comment
     *     tags: [Recipe Comments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: commentId
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The comment ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateCommentDto'
     *     responses:
     *       200:
     *         description: Comment updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/RecipeComment'
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid comment data
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the author of the comment
     *       404:
     *         description: Comment not found
     */
    this.router.put(`/recipes/comments/:commentId`, AuthMiddleware, ValidationMiddleware(UpdateCommentDto), this.recipeController.updateComment);

    /**
     * @swagger
     * /recipes/comments/{commentId}:
     *   delete:
     *     summary: Delete a comment
     *     tags: [Recipe Comments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: commentId
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: The comment ID
     *     responses:
     *       200:
     *         description: Comment deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the author of the comment or recipe owner
     *       404:
     *         description: Comment not found
     */
    this.router.delete(`/recipes/comments/:commentId`, AuthMiddleware, this.recipeController.deleteComment);
  }
}
