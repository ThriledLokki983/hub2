import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  CreateIngredientDto,
  CreateInstructionDto,
  CreateRecipeDto,
  CreateTagDto,
  TagRecipeDto,
  RecipeQueryDto,
  UpdateRecipeDto,
  UpdateTagDto,
  CreateRatingDto,
  CreateCommentDto,
  UpdateCommentDto,
} from '@dtos/recipes.dto';
import { Recipe } from '@interfaces/recipes.interface';
import { RecipeService } from '@services/recipes.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import { count } from 'console';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const recipeDir = path.join(uploadsDir, 'recipes', req.params.id);
    if (!fs.existsSync(recipeDir)) {
      fs.mkdirSync(recipeDir, { recursive: true });
    }
    cb(null, recipeDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
  },
});

export class RecipeController {
  private recipeService = Container.get(RecipeService);

  public getRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use the validatedQuery from the ValidationMiddleware instead of req.query
      const queryParams: RecipeQueryDto = (req as any).validatedQuery || (req.query as any);
      const { recipes, total } = await this.recipeService.findAllRecipes(queryParams);

      res.status(200).json({ total, page: queryParams.page || 1, limit: queryParams.limit || 10, data: recipes });
    } catch (error) {
      next(error);
    }
  };

  public getRecipeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const recipe: Recipe = await this.recipeService.findRecipeById(recipeId);

      res.status(200).json({ data: recipe });
    } catch (error) {
      next(error);
    }
  };

  public createRecipe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const recipeData: CreateRecipeDto = req.body;
      const newRecipe: Recipe = await this.recipeService.createRecipe(userId, recipeData);

      res.status(201).json({ data: newRecipe });
    } catch (error) {
      next(error);
    }
  };

  public updateRecipe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;
      const recipeData: UpdateRecipeDto = req.body;
      const updatedRecipe: Recipe = await this.recipeService.updateRecipe(recipeId, userId, recipeData);

      res.status(200).json({ data: updatedRecipe });
    } catch (error) {
      next(error);
    }
  };

  public deleteRecipe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;
      await this.recipeService.deleteRecipe(recipeId, userId);

      res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public addIngredient = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;

      // Use the validated body directly for a single ingredient
      const ingredientData: CreateIngredientDto = req.body;
      const newIngredient = await this.recipeService.addIngredient(recipeId, userId, ingredientData);

      res.status(201).json({ data: newIngredient });
    } catch (error) {
      next(error);
    }
  };

  public addIngredientBatch = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;

      // Validate the request body against CreateIngredientsDto
      const data = req.body;
      if (!data.ingredients || !Array.isArray(data.ingredients)) {
        return res.status(400).json({ message: 'Request must include ingredients as an array' });
      }

      // Validate each ingredient
      for (const ingredient of data.ingredients) {
        if (!ingredient.name || typeof ingredient.name !== 'string' || ingredient.name.length < 1 || ingredient.name.length > 255) {
          return res.status(400).json({
            message: 'Each ingredient must have a valid name (string between 1-255 characters)',
          });
        }
      }

      // Process the batch of ingredients
      const newIngredients = await this.recipeService.addIngredient(recipeId, userId, data.ingredients);

      res.status(201).json({ data: newIngredients });
    } catch (error) {
      next(error);
    }
  };

  public addInstruction = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;

      // Use the validated body directly for a single instruction
      const instructionData: CreateInstructionDto = req.body;
      const newInstruction = await this.recipeService.addInstruction(recipeId, userId, instructionData);

      res.status(201).json({ data: newInstruction });
    } catch (error) {
      next(error);
    }
  };

  public addInstructionBatch = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;

      // Validate the request body
      const data = req.body;
      if (!data.instructions || !Array.isArray(data.instructions)) {
        return res.status(400).json({ message: 'Request must include instructions as an array' });
      }

      // Validate each instruction
      for (const instruction of data.instructions) {
        if (!instruction.step_number || typeof instruction.step_number !== 'number' || instruction.step_number < 1) {
          return res.status(400).json({
            message: 'Each instruction must have a valid step_number (number greater than or equal to 1)',
          });
        }

        if (!instruction.instruction || typeof instruction.instruction !== 'string' || instruction.instruction.length < 1) {
          return res.status(400).json({
            message: 'Each instruction must have valid instruction text (non-empty string)',
          });
        }
      }

      // Process the batch of instructions
      const newInstructions = await this.recipeService.addInstruction(recipeId, userId, data.instructions);

      res.status(201).json({ data: newInstructions });
    } catch (error) {
      next(error);
    }
  };

  // Single file upload for recipe photo
  public uploadPhoto = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const uploadSingle = upload.single('photo');

    uploadSingle(req, res, async err => {
      if (err) {
        return next(err);
      }

      try {
        const recipeId = req.params.id;
        const userId = req.user.id;
        const file = req.file;

        if (!file) {
          return res.status(400).json({ message: 'Please upload a file' });
        }

        // Get uploaded file info
        const fileData = {
          path: `/uploads/recipes/${recipeId}/${file.filename}`, // Store as relative URL
          originalname: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          isPrimary: req.body.isPrimary === 'true',
        };

        const photo = await this.recipeService.addPhoto(recipeId, userId, fileData);

        res.status(201).json({
          data: photo,
          message: 'Photo uploaded successfully',
        });
      } catch (error) {
        next(error);
      }
    });
  };

  // Multiple file upload for recipe photos
  public uploadPhotos = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const uploadMultiple = upload.array('photos', 10); // Allow up to 10 files

    uploadMultiple(req, res, async err => {
      if (err) {
        return next(err);
      }

      try {
        const recipeId = req.params.id;
        const userId = req.user.id;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
          return res.status(400).json({ message: 'Please upload at least one file' });
        }

        const uploadedPhotos = [];

        // Process each uploaded file
        for (const file of files) {
          const fileData = {
            path: `/uploads/recipes/${recipeId}/${file.filename}`, // Store as relative URL
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            isPrimary: false, // Multiple uploads can't be primary by default
          };

          const photo = await this.recipeService.addPhoto(recipeId, userId, fileData);
          uploadedPhotos.push(photo);
        }

        res.status(201).json({
          data: uploadedPhotos,
          message: 'Photos uploaded successfully',
        });
      } catch (error) {
        next(error);
      }
    });
  };

  public deletePhoto = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const photoId = req.params.photoId;
      const userId = req.user.id;

      await this.recipeService.deletePhoto(recipeId, photoId, userId);

      res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getAllIngredients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const ingredients = await this.recipeService.findAllIngredients(recipeId);

      res.status(200).json({ count: ingredients.length, message: 'Fetched all ingredients successfully', data: ingredients });
    } catch (error) {
      next(error);
    }
  };

  public getAllInstructions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const instructions = await this.recipeService.findAllInstructions(recipeId);

      res.status(200).json({ count: instructions.length, message: 'Fetched all instructions successfully', data: instructions });
    } catch (error) {
      next(error);
    }
  };

  public getAllAvailableIngredients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ingredients = await this.recipeService.findAllAvailableIngredients();

      res.status(200).json({ count: ingredients.length, message: 'Fetched all available ingredients successfully', data: ingredients });
    } catch (error) {
      next(error);
    }
  };

  public getAllAvailableInstructions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const instructions = await this.recipeService.findAllAvailableInstructions();

      res.status(200).json({ count: instructions.length, message: 'Fetched all available instructions successfully', data: instructions });
    } catch (error) {
      next(error);
    }
  };

  // Tag management endpoints
  public getAllTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllTagsData = await this.recipeService.findAllTags();

      res.status(200).json({ data: findAllTagsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTagById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tagId = req.params.id;
      const findOneTagData = await this.recipeService.findTagById(tagId);

      res.status(200).json({ data: findOneTagData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tagData: CreateTagDto = req.body;
      const createTagData = await this.recipeService.createTag(tagData);

      res.status(201).json({ data: createTagData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tagId = req.params.id;
      const tagData: UpdateTagDto = req.body;
      const updateTagData = await this.recipeService.updateTag(tagId, tagData);

      res.status(200).json({ data: updateTagData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tagId = req.params.id;
      await this.recipeService.deleteTag(tagId);

      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getTagsByRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.recipeId;
      const findTagsData = await this.recipeService.findTagsByRecipe(recipeId);

      res.status(200).json({ data: findTagsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public addTagsToRecipe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.recipeId;
      const userId = req.user.id;
      const { tag_ids } = req.body;
      const addedTagsData = await this.recipeService.addTagsToRecipe(recipeId, userId, tag_ids);

      res.status(200).json({ data: addedTagsData, message: 'added' });
    } catch (error) {
      next(error);
    }
  };

  public removeTagFromRecipe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.recipeId;
      const tagId = req.params.tagId;
      const userId = req.user.id;
      await this.recipeService.removeTagFromRecipe(recipeId, userId, tagId);

      res.status(200).json({ message: 'removed' });
    } catch (error) {
      next(error);
    }
  };

  // Region controller methods
  public getAllRegions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const regions = await this.recipeService.findAllRegions();
      res.status(200).json({ data: regions, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getRegionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const regionId = req.params.id;
      const region = await this.recipeService.findRegionById(regionId);
      res.status(200).json({ data: region, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createRegion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const regionData = req.body;
      const newRegion = await this.recipeService.createRegion(regionData);
      res.status(201).json({ data: newRegion, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateRegion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const regionId = req.params.id;
      const regionData = req.body;
      const updatedRegion = await this.recipeService.updateRegion(regionId, regionData);
      res.status(200).json({ data: updatedRegion, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteRegion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const regionId = req.params.id;
      await this.recipeService.deleteRegion(regionId);
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public setRecipeRegion = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.recipeId;
      const userId = req.user.id;
      const { region_id } = req.body;

      const updatedRecipe = await this.recipeService.setRecipeRegion(recipeId, userId, region_id);
      res.status(200).json({ data: updatedRecipe, message: 'Region set successfully' });
    } catch (error) {
      next(error);
    }
  };

  public forkRecipe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;

      const forkedRecipe = await this.recipeService.forkRecipe(recipeId, userId);

      res.status(201).json({
        data: forkedRecipe,
        message: 'Recipe forked successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Rating endpoints
  public getRatingsByRecipe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const ratings = await this.recipeService.getRatingsByRecipe(recipeId);
      res.status(200).json({ data: ratings, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserRatingForRecipe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;
      const rating = await this.recipeService.getUserRatingForRecipe(recipeId, userId);
      res.status(200).json({ data: rating, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public rateRecipe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;

      // Parse the rating value and ensure it's a number
      let rating = req.body.rating;
      if (typeof rating === 'string') {
        rating = parseInt(rating, 10);
      }

      // Validate the rating manually
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({
          message: 'Rating must be a number between 1 and 5',
        });
      }

      const ratingData: CreateRatingDto = { rating };
      const createdRating = await this.recipeService.rateRecipe(recipeId, userId, ratingData);

      res.status(201).json({ data: createdRating, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public deleteRating = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;
      await this.recipeService.deleteRating(recipeId, userId);
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  // Comment endpoints
  public getCommentsByRecipe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const comments = await this.recipeService.getCommentsByRecipe(recipeId);
      res.status(200).json({ data: comments, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public addCommentToRecipe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;
      const commentData: CreateCommentDto = req.body;
      const comment = await this.recipeService.addCommentToRecipe(recipeId, userId, commentData);
      res.status(201).json({ data: comment, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.user.id;
      const commentData: UpdateCommentDto = req.body;
      const comment = await this.recipeService.updateComment(commentId, userId, commentData);
      res.status(200).json({ data: comment, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.user.id;
      await this.recipeService.deleteComment(commentId, userId);
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
