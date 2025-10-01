/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The recipe ID
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID of the user who created the recipe
 *         title:
 *           type: string
 *           description: Recipe title
 *         slug:
 *           type: string
 *           description: URL-friendly version of the title
 *         description:
 *           type: string
 *           description: Recipe description
 *         image:
 *           type: string
 *           description: Main image path for the recipe
 *         chef:
 *           type: string
 *           description: Name of the chef
 *         category:
 *           type: string
 *           description: Recipe category
 *         region_id:
 *           type: string
 *           format: uuid
 *           description: ID of the region associated with the recipe
 *         region:
 *           $ref: '#/components/schemas/Region'
 *           description: Region object reference
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the recipe
 *         prep_time:
 *           type: integer
 *           description: Preparation time in minutes
 *         cook_time:
 *           type: integer
 *           description: Cooking time in minutes
 *         total_time:
 *           type: integer
 *           description: Total time in minutes
 *         servings:
 *           type: integer
 *           description: Number of servings
 *         difficulty:
 *           type: string
 *           description: Recipe difficulty level
 *         calories:
 *           type: integer
 *           description: Calories per serving
 *         protein:
 *           type: integer
 *           description: Protein in grams
 *         fat:
 *           type: integer
 *           description: Fat in grams
 *         carbohydrates:
 *           type: integer
 *           description: Carbohydrates in grams
 *         status:
 *           type: string
 *           default: published
 *           description: Status of the recipe
 *         is_public:
 *           type: boolean
 *           default: true
 *           description: Whether the recipe is public
 *         average_rating:
 *           type: number
 *           format: float
 *           description: Average user rating
 *         ratings_count:
 *           type: integer
 *           description: Number of ratings received
 *         views:
 *           type: integer
 *           description: Number of views
 *         source:
 *           type: string
 *           description: Original source of the recipe
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         ratings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecipeRating'
 *           description: Ratings for the recipe
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecipeComment'
 *           description: Comments for the recipe
 *       required:
 *         - title
 *         - user_id
 *
 *     RecipeWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Recipe'
 *         - type: object
 *           properties:
 *             ingredients:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeIngredient'
 *             instructions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeInstruction'
 *             photos:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipePhoto'
 *
 *     RecipeIngredient:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The ingredient ID
 *         recipe_id:
 *           type: string
 *           format: uuid
 *           description: ID of the recipe this ingredient belongs to
 *         name:
 *           type: string
 *           description: Name of the ingredient
 *         quantity:
 *           type: string
 *           description: Quantity of the ingredient
 *         unit:
 *           type: string
 *           description: Unit of measurement
 *         notes:
 *           type: string
 *           description: Additional notes for the ingredient
 *         order_index:
 *           type: integer
 *           description: Order position in the ingredients list
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       required:
 *         - name
 *         - recipe_id
 *
 *     RecipeInstruction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The instruction ID
 *         recipe_id:
 *           type: string
 *           format: uuid
 *           description: ID of the recipe this instruction belongs to
 *         step_number:
 *           type: integer
 *           description: The step number in the cooking process
 *         instruction:
 *           type: string
 *           description: The instruction text
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       required:
 *         - step_number
 *         - instruction
 *         - recipe_id
 *
 *     RecipePhoto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The photo ID
 *         recipe_id:
 *           type: string
 *           format: uuid
 *           description: ID of the recipe this photo belongs to
 *         file_path:
 *           type: string
 *           description: Path to the uploaded photo
 *         file_name:
 *           type: string
 *           description: Original file name
 *         file_size:
 *           type: integer
 *           description: Size of the file in bytes
 *         mime_type:
 *           type: string
 *           description: MIME type of the file
 *         is_primary:
 *           type: boolean
 *           description: Whether this is the primary photo for the recipe
 *         thumbnail_small:
 *           type: string
 *           description: Path to the small thumbnail
 *         thumbnail_medium:
 *           type: string
 *           description: Path to the medium thumbnail
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Upload timestamp
 *       required:
 *         - file_path
 *         - file_name
 *         - recipe_id
 *
 *     RecipeRating:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The rating ID
 *         recipe_id:
 *           type: string
 *           format: uuid
 *           description: ID of the recipe
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID of the user who left the rating
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating value (1-5 stars)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       required:
 *         - recipe_id
 *         - user_id
 *         - rating
 *
 *     RecipeComment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The comment ID
 *         recipe_id:
 *           type: string
 *           format: uuid
 *           description: ID of the recipe
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID of the user who left the comment
 *         user_email:
 *           type: string
 *           description: Email of the user who left the comment
 *         comment:
 *           type: string
 *           description: The comment text
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       required:
 *         - recipe_id
 *         - user_id
 *         - comment
 *
 *     CreateRecipeDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 255
 *           description: Recipe title
 *         slug:
 *           type: string
 *           description: URL-friendly version of the title (generated if not provided)
 *         description:
 *           type: string
 *           description: Recipe description
 *         chef:
 *           type: string
 *           description: Name of the chef
 *         category:
 *           type: string
 *           description: Recipe category
 *         region_id:
 *           type: string
 *           format: uuid
 *           description: ID of the region associated with the recipe
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the recipe
 *         prep_time:
 *           type: integer
 *           minimum: 0
 *           description: Preparation time in minutes
 *         cook_time:
 *           type: integer
 *           minimum: 0
 *           description: Cooking time in minutes
 *         total_time:
 *           type: integer
 *           minimum: 0
 *           description: Total time in minutes
 *         servings:
 *           type: integer
 *           minimum: 1
 *           description: Number of servings
 *         difficulty:
 *           type: string
 *           description: Recipe difficulty level
 *         calories:
 *           type: integer
 *           minimum: 0
 *           description: Calories per serving
 *         protein:
 *           type: integer
 *           minimum: 0
 *           description: Protein in grams
 *         fat:
 *           type: integer
 *           minimum: 0
 *           description: Fat in grams
 *         carbohydrates:
 *           type: integer
 *           minimum: 0
 *           description: Carbohydrates in grams
 *         status:
 *           type: string
 *           default: published
 *           description: Status of the recipe
 *         is_public:
 *           type: boolean
 *           default: true
 *           description: Whether the recipe is public
 *         source:
 *           type: string
 *           description: Original source of the recipe
 *       required:
 *         - title
 *
 *     CreateIngredientDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: Name of the ingredient
 *         quantity:
 *           type: string
 *           maxLength: 100
 *           description: Quantity of the ingredient
 *         unit:
 *           type: string
 *           maxLength: 50
 *           description: Unit of measurement
 *         notes:
 *           type: string
 *           description: Additional notes for the ingredient
 *         order_index:
 *           type: integer
 *           minimum: 0
 *           description: Order position in the ingredients list
 *       required:
 *         - name
 *
 *     CreateInstructionDto:
 *       type: object
 *       properties:
 *         step_number:
 *           type: integer
 *           minimum: 1
 *           description: The step number in the cooking process
 *         instruction:
 *           type: string
 *           minLength: 1
 *           description: The instruction text
 *       required:
 *         - step_number
 *         - instruction
 *
 *     CreateRatingDto:
 *       type: object
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating value (1-5 stars)
 *       required:
 *         - rating
 *
 *     CreateCommentDto:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *           minLength: 1
 *           description: The comment text
 *       required:
 *         - comment
 *
 *     UpdateCommentDto:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *           minLength: 1
 *           description: The updated comment text
 *       required:
 *         - comment
 *
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The tag ID
 *         name:
 *           type: string
 *           description: Name of the tag
 *         slug:
 *           type: string
 *           description: URL-friendly version of the name
 *         description:
 *           type: string
 *           description: Optional description of the tag
 *         count:
 *           type: integer
 *           description: Number of recipes using this tag
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       required:
 *         - id
 *         - name
 *         - slug
 *         - count
 *
 *     RecipeTag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The recipe-tag relationship ID
 *         recipe_id:
 *           type: string
 *           format: uuid
 *           description: ID of the recipe
 *         tag_id:
 *           type: string
 *           format: uuid
 *           description: ID of the tag
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *       required:
 *         - id
 *         - recipe_id
 *         - tag_id
 *
 *     CreateTagDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Name of the tag
 *         slug:
 *           type: string
 *           description: URL-friendly version of the name (generated if not provided)
 *         description:
 *           type: string
 *           description: Optional description of the tag
 *       required:
 *         - name
 *
 *     UpdateTagDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Name of the tag
 *         slug:
 *           type: string
 *           description: URL-friendly version of the name
 *         description:
 *           type: string
 *           description: Optional description of the tag
 *
 *     TagRecipeDto:
 *       type: object
 *       properties:
 *         tag_ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Array of tag IDs to associate with the recipe
 *       required:
 *         - tag_ids
 */

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  chef?: string;
  category?: string;
  region_id?: string; // Added region_id field
  region?: Region; // Added region object reference
  tags?: string[]; // Legacy tags format (array of strings)
  prep_time?: number;
  cook_time?: number;
  total_time?: number;
  servings?: number;
  difficulty?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbohydrates?: number;
  status?: string;
  is_public?: boolean;
  average_rating?: number;
  ratings_count?: number;
  views?: number;
  source?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  ingredients?: RecipeIngredient[];
  instructions?: RecipeInstruction[];
  photos?: RecipePhoto[];
  tag_objects?: Tag[]; // New property for enhanced tag system
  ratings?: RecipeRating[];
  comments?: RecipeComment[];
}

export interface RecipeIngredient {
  id?: string;
  recipe_id: string;
  name: string;
  quantity?: string;
  unit?: string;
  notes?: string;
  order_index?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface RecipeInstruction {
  id?: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface RecipePhoto {
  id?: string;
  recipe_id: string;
  file_path: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  is_primary?: boolean;
  thumbnail_small?: string;
  thumbnail_medium?: string;
  created_at?: Date;
}

export interface RecipeRating {
  id?: string;
  recipe_id: string;
  user_id: string;
  user_email?: string;
  rating: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface RecipeComment {
  id?: string;
  recipe_id: string;
  user_id: string;
  user_email?: string;
  comment: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface RecipeTag {
  id: string;
  recipe_id: string;
  tag_id: string;
  created_at?: Date;
}

export interface Region {
  id: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type RecipeCreateResponse = {
  id: string;
  title: string;
  created_at: Date;
};

export type RecipeQueryParams = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  user_id?: string;
  tags?: string[] | string;
  tag_ids?: string[] | string; // Add support for querying by tag IDs
  sort?: string;
  sort_direction?: 'ASC' | 'DESC';
  // Advanced filter parameters
  max_prep_time?: number;
  max_cook_time?: number;
  max_total_time?: number;
  min_calories?: number;
  max_calories?: number;
  min_protein?: number;
  max_protein?: number;
  min_fat?: number;
  max_fat?: number;
  min_carbs?: number;
  max_carbs?: number;
  exclude_ingredients?: string[];
};
